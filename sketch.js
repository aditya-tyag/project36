var dog,sadDog,happyDog;
var feed, addFood, foodObj, foodStock;
var food, database, fedTime, lastFed;

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);
  
  database= firebase.database();

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed= createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood= createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj= new Food();
  foodStock= database.ref('foodStock');
  foodStock.on("value", getFoodStock);
}

function draw() {
  background(46,139,87);
  foodObj.display();
  fedTime= database.ref('lastFed');
  fedTime.on("value", function (data){
    lastFed= data.val();
  })

  fill(255,255,254);
  textSize(20);
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12 + "PM", 310,40);
  }else if(lastFed==0){
    text("Last Feed: 12 AM", 310,40);
  }else{
    text("Last Feed: "+ lastFed +" AM", 310,40);
  }
  drawSprites();

}

//function to update food Stock
function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    lastFed: hour()
  })
}

//function to update food stock and last fed time
function updateFoodStock(x){
        
  database.ref('/').update({
    foodStock: x
  })
}

//function to add food in stock
function addFoods(){
  foodStock++;
  database.ref('/').update({
    foodStock: foodStock
  })
}

function getFoodStock(data){
  foodStock=data.val();
  foodObj.updateFoodStock(foodStock);
}
      