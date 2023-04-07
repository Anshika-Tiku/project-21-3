var PLAY = 1;
var END = 0;
var gameState = PLAY;

var coinImg;
var crownImg;
var flyingAstronaut;
var spaceImage;
var standingAstronaut;
var astronaut;
var stars;
var invisibleGround;
var obstacle, obstacle1, obstacle2, obstacle3;
var score;
var gameOverImg, restartImg;
var gameOver, restart;
var jumpSound, checkPointSound, dieSound;
var coinsGroup, obstaclesGroup;
var crownGroup;
var space;
var crown;

function preload() {
  flyingAstronaut = loadAnimation("flying_astronaut.png");
  standingAstronaut = loadAnimation("standing_astronaut.png");
  spaceImage = loadImage("space.bg.jpg");
  stars = loadImage("stars.jpg");
  coinImg = loadImage("coins.png");
  crownImg = loadImage("crown.png");
  obstacle1 = loadImage("obstacle_meteroid.png");
  obstacle2 = loadImage("obstacle_meteroid1.png");
  obstacle3 = loadImage("obstacle_meteroid2.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  astronaut = createSprite(50, 160, 20, 50);
  astronaut.addAnimation("standing", standingAstronaut);
  astronaut.addAnimation("collided", flyingAstronaut);
  astronaut.scale = 0.5;

  space = createSprite(200, windowHeight/2 , 400, 20);
  space.addImage("space", spaceImage);
  space.x = space.width / 2;

  gameOver = createSprite(windowWidth/2,windowHeight/2-50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(windowWidth/2, windowHeight/2+50);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(200, windowHeight-20, windowWidth, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  crownGroup = new Group();
  coinsGroup = new Group();


  astronaut.setCollider("rectangle",0,0,astronaut.width,astronaut.height);
  astronaut.debug = false;
  score = 0;
}

  function draw() {
  background(stars);
  text("Score: "+ score, 500,50);

  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    space.velocityX = -(4 + 3* score/100);

    score = score + Math.round(getFrameRate()/60);
    if(score>0 && score%100 === 0){
      checkPointSound.play();
    }

    if (space.x < 0){
      space.x = space.width/2;
    }

    if(keyDown("space") && astronaut.y >= 100) {
      astronaut.velocityY = -12;
      jumpSound.play();
    }

    astronaut.velocityY = astronaut.velocityY + 0.8;

    spawnCoins();
    spawnCrown();
    spawnObstacles();

    if(obstaclesGroup.isTouching(astronaut)){
      astronaut.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play();        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    astronaut.changeAnimation("collided", flyingAstronaut);

    space.velocityX = 0;
    astronaut.velocityY = 0

    obstaclesGroup.setLifetimeEach(-1);
    crownGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);    

    astronaut.collide(invisibleGround);

    if(mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function reset(){
  gameState=PLAY;
  score=0;
  obstaclesGroup.destroyEach();
  crownGroup.destroyEach();
  coinsGroup.destroyEach();
  astronaut.changeAnimation("standing", standingAstronaut)
  astronaut.x = 50;
  astronaut.y = 160;
  gameOver.visible=false;
  restart.visible=false;
}
  
  
  function spawnObstacles(){
   if (frameCount % 60 === 0){
     obstacle = createSprite(600,165,10,40);
     obstacle.velocityX = -(6 + score/100);
     
     
      var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        case 3: obstacle.addImage(obstacle3);
                break;
        default: break;
      }
     
             
      obstacle.scale = 0.5;
      obstacle.lifetime = 300;
     
 
      obstaclesGroup.add(obstacle);
   }
  }
  
  function spawnCoins() {
    if (frameCount % 60 === 0) {
      var coin = createSprite(windowWidth, Math.round(random(windowHeight/2 - 100, windowHeight/2 + 100)), 40, 10);
      coin.addImage(coinImg);
      coin.scale = 0.02;
      coin.velocityX = -3;
      coin.lifetime = windowWidth/3;
      coinsGroup.add(coin);
      
    }
  }
  
  
  
  function spawnCrown() {
    if (frameCount % 300 === 0) {
      crown = createSprite(windowWidth, Math.round(random(50, windowHeight/2 - 50)), 40, 10);
      crown.addImage(crownImg);
      crown.scale = 0.2;
      crown.velocityX = -3;
      crown.lifetime = windowWidth/3;
      crownGroup.add(crown);
    }
  }
  
