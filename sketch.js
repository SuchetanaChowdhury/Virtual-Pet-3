//Create variables here
var dog, dogImg;
var happyDog
var database
var foodStock
var foodRemaining;
var feed, addFood;
var fedTime, lastFed, currentTime;
var foodObj;
var gameState, readState;
var bedroom, garden, washroom;

function preload(){
 //load images here
 dogImg = loadImage("images/Dog.png");
 dogHappy = loadImage("images/Happy.png");
 bedroom = loadImage("images/Bed Room.png");
 garden = loadImage("images/Garden.png");
 washroom = loadImage("images/Wash Room.png");

}

function setup() {
 createCanvas(900, 500);
 dog = createSprite(750, 250, 10, 10);
 dog.addImage("dog",dogImg);

 dog.scale = 0.2;
 database = firebase.database();
 foodStock = database.ref('food');
 foodStock.on("value", readStock, showError);

 foodObj = new Food();

 fedTime = database.ref('FeedTime');
 fedTime.on("value", function(data){
   lastFed=data.val();
 })
 //read game Sate from database
 readState = database.ref('gameSate');
 readState.on("value", function(data){
  gameState=data.val();
});

 feed = createButton("Feed the dog");
 feed.position(700,120);
 feed.mousePressed(feedDog);

 addFood = createButton("Add Food");
 addFood.position(800,120);
 addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87)
  // if(keyWentDown(UP_ARROW)){ 
  //   dog.changeImage("happydog",dogHappy)
  //    foodRemaining=foodRemaining-1 
  //    writeStock(foodRemaining);
  //  } 
  // if(keyWentUp(UP_ARROW)){
  //     dog.changeImage("dog",dogImg);
  // }
   
    currentTime=hour();
      if(currentTime==(lastFed+1)){
        update("Playing");
        foodObj.garden();
     }else if(currentTime==(lastFed+2)){
      update("Sleeping");
        foodObj.bedroom();
     }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
        foodObj.washroom();
     }else{
      update("Hungry")
      foodObj.display();
     }

     if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
    }

 drawSprites();
}

function writeStock(x){
  database.ref('/').update({
    "food":x
  })
}

function readStock(data){
  foodRemaining = data.val();
  foodObj.updateFoodStock(foodRemaining);
}

function showError(){
  console.log("there is in error in showing your data");
}

function feedDog(){
  dog.addImage(dogHappy);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  foodRemaining=foodRemaining-1;
  database.ref('/').update({
    //Food:foodObj.getFoodStock(),
    Food:foodRemaining,
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodRemaining++;
  foodObj.updateFoodStock(foodObj.getFoodStock()+1);
  database.ref('/').update({
    Food:foodRemaining
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}