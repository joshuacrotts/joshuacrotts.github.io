const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

//Paddle
let player
let pVelX = 350

//Bricks
let bricks

//Balls list
let balls

//Ball information
const BALL_WIDTH = 29
const BALL_HEIGHT = BALL_WIDTH

//Powerups
let multiBall
let largePaddle
let invincibility
  let invincibilityTimer = 0;
  let hasInvincibility   = false;

//Score
let score = 0

//Game information
const ROW_BRICKS = 5
const COL_BRICKS = 7

//Brick dimensions
const BRICK_WIDTH = 60
const BRICK_HEIGHT = 15

//Borders
let BORDERS

//Miscellaneous info
var GAME_STATE = 0 //0 for start, 1 for play, 2 for pause, -1 for debug

function preload()
{
  game.load.image('sky', 'assets/sky.png')
  game.load.image('platform', 'assets/platform.png')
  game.load.image('paddle', 'brickbreaker_images/paddle.png')
  game.load.image('largepaddle', 'brickbreaker_images/largepaddle.jpg')
  game.load.image('ball', 'brickbreaker_images/new_ball_sprite.png')
  game.load.image('border', 'brickbreaker_images/platform.png')

  game.load.image('redbrick', 'brickbreaker_images/bricks/redbrick.png')
  game.load.image('bluebrick', 'brickbreaker_images/bricks/bluebrick.png')
  game.load.image('greenbrick', 'brickbreaker_images/bricks/greenbrick.png')
  game.load.image('yellowbrick', 'brickbreaker_images/bricks/yellowbrick.png')
  game.load.spritesheet('multi', 'brickbreaker_images/Multi/multiball_ss.png', 44, 22)
  game.load.spritesheet('large', 'brickbreaker_images/Large/largepaddle_ss.png', 64, 42)
  //game.load.spritesheet('ball_ss', 'brickbreaker_images/ball_ss.jpg', 85, 85)
}

/**
  * Overridden method which initializes all entities, sprites,
  * physics bodies, etc.
  */
function create()
{
  //Initialize the physics system
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.physics.arcade.checkCollision.bottom = false;
  //Load in the background sprite
  game.add.sprite(0, 0, 'sky')

  //Initialize the borders since collision is being stupid
  BORDERS = game.add.group()
  BORDERS.enableBody = true

  //Initialize BORDERS
  initBorders()

  //Create the group which encapsulates all bricks
  bricks = game.add.group()
  bricks.enableBody = true

  //Create the group which holds all the balls
  balls = game.add.group()
  balls.enableBody = true

  //Multi ball group
  multiBall = game.add.group()
  multiBall.enableBody = true

  //Large paddle group
  largePaddle = game.add.group()
  largePaddle.enableBody = true

  /*Initializes the bricks (position and type)*/
  let leftOffset = 150
  //Offset from the far left of the screen (50)
  for(var y = 30; y <= COL_BRICKS * 30; y += 30)
  {
    for(var x = leftOffset; x < game.world.height; x += BRICK_WIDTH + 10)
    {
      //Generates a random brick type to spawn
      let brickType = game.rnd.integerInRange(0, 3)
      let brick;

      switch(brickType)
      {
        case 0: brick = bricks.create(x, y, 'redbrick'); break
        case 1: brick = bricks.create(x, y, 'bluebrick'); break
        case 2: brick = bricks.create(x, y, 'greenbrick'); break
        case 3: brick = bricks.create(x, y, 'yellowbrick'); break
      }
      brick.body.immovable = true
    }
  }

  //Initializes a single ball with a fixed position
  let ball = balls.create(game.rnd.integerInRange(100, game.world.width - 100), game.rnd.integerInRange(300, 500), 'ball')

  //Adds the paddle to the screen
  player = game.add.sprite(game.rnd.integerInRange(200, 400), game.world.height - 20, 'paddle')

  //Allows the player to have physics
  game.physics.arcade.enable(player)

  //We don't need the paddle to go out of bounds or have the balls PUSH
  //the paddle
  player.body.immovable = true
  player.body.collideWorldBounds = true
  player.anchor.set(0.5,1);

  //Defines score text
  scoreText = game.add.text(16, 16, 'Score: '+score, { fontSize: '32px', fill: '#000'})

  //Handles keyboard input
  cursors = game.input.keyboard.createCursorKeys()

  //Pre-initializes all balls in the game
  for(var c = 0; c < balls.children.length; c++)
  {
    let b = balls.children[c]
    b.body.velocity.set(250, -250)
    //b.body.collideWorldBounds = true
    b.anchor.set(0.5)
    b.body.bounce.set(1)

  }
}

/**
  * Function that handles all game update logic, including
  * collision detection, animations, movement, etc.
  */
function update()
{
  collisionDetection()

  //Updates the multi balls that are active in the world
  for(var p = 0; p < multiBall.children.length; p++)
  {
    let currentPUp = multiBall.children[p]
    //Play the active animation if its visible

    if(currentPUp == null) continue;

    currentPUp.animations.play('multi')

    //If it is off the screen, we no longer need it.
    if(currentPUp.body.y > game.world.height + 40)
    {
      currentPUp.kill()
    }
  }

  //Updates the large paddle that are active in the world
  for(var l = 0; l < largePaddle.children.length; l++)
  {
    let currentLarge = largePaddle.children[l]

    if(currentLarge == null) continue

    currentLarge.animations.play('large')

    //If it is off the screen, we no longer need it.
    if(currentLarge.body.y > game.world.height + 40)
    {
      currentLarge.kill()
    }
  }

  //Updates the ball sprites and animations that are active
  for(var b = 0; b < balls.children.length; b++)
  {

    let currentB = balls.children[b]

    if(currentB == null) continue;

    if(currentB.body.y > game.world.height + 20)
    {
      currentB.kill()

      if(balls.children.length === 1){
        alert("You lose D:")
        window.location = location
      }
    }

  }

  //Keyboard input
  if(cursors.left.isDown)
  {
    player.body.velocity.x = -pVelX
  }
  else if(cursors.right.isDown)
  {
    player.body.velocity.x = pVelX
  }
  else
  {
    player.body.velocity.x = 0
  }

  //invincibility timer
  if(hasInvincibility)
  {
    invincibilityTimer++;
    console.log()
    if(invincibilityTimer >= 100)
    {
      hasInvincibility = false  
    }
  }
}

/**
  * Function that initializes the collision detection
  * between any and all entities in the game.
  */
function collisionDetection()
{
  game.physics.arcade.collide(player, balls)
  game.physics.arcade.collide(balls, bricks, ballHitsBrick)
  game.physics.arcade.collide(balls, BORDERS)
  game.physics.arcade.overlap(player, multiBall, multiBallHitsPlayer)
  game.physics.arcade.overlap(player, largePaddle, invincibililityHitsPlayer)
}

/** Callback function to determine what happens when the ball collides
  * with some arbitrary brick. A powerup has the chance of spawning
  *
  * @param ball is some ball that is passed in
  * @param brick the brick that was destroyed
  */
function ballHitsBrick(ball, brick)
{
  let powerUpGenerator = game.rnd.integerInRange(0, 3)

  score += 10

  scoreText.text = "Score: " + score

  if(powerUpGenerator == 3)
  {
    multi = multiBall.create(brick.x + BRICK_WIDTH / 2, brick.y + BRICK_HEIGHT, 'multi')
    multi.animations.add('multi', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10, true)
    multi.body.velocity.set(0, 50)
  }
  else if(powerUpGenerator >= 0)
  {
    large = largePaddle.create(brick.x + BRICK_WIDTH / 2, brick.y + BRICK_HEIGHT, 'large')
    large.animations.add('large', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
    large.body.velocity.set(0, 50)
  }

  brick.kill(BORDERS.children[3])
}

/**
  * When a multiball power-up hits the paddle/player, this callback function
  * is called.
  *
  */
function multiBallHitsPlayer(player, powerUp)
{
  powerUp.kill()

  let b = balls.create(game.rnd.integerInRange(100, game.world.width - 100), game.rnd.integerInRange(300, 500), 'ball')
  b.body.velocity.set(150, -150)
  b.body.collideWorldBounds = true
  b.anchor.set(0.5)
  b.body.bounce.set(1)
}

/**
  * if we run into the large power-up, the old paddle is trashed
  * and the new one is loaded.
  */
function invincibililityHitsPlayer(player, powerUp)
{
  powerUp.kill()
  hasInvincibility = true
  invincibilityTimer = 0

  let wall = BORDERS.create(0, game.world.height - 10, 'border')
  wall.scale.setTo(2, 2)
  wall.body.immovable = true
}

function initBorders()
{

    //Left border
    let ground = BORDERS.create(-400, 0, 'border')
    ground.scale.setTo(1,20)
    ground.body.immovable = true

    //Right border
    ground = BORDERS.create(game.world.width, 0, 'border')
    ground.scale.setTo(1,30)
    ground.body.immovable = true

    //Top border
    ground = BORDERS.create(0, -65, 'border')
    ground.scale.setTo(2,2)
    ground.body.immovable = true
}

/** Range function takes in two integers and computes a list of
  * numbers [start, end) exclusive.
  *
  * If end > start, throws an exception.
  */
function range(start, end)
{
  if(end > start)
    throw exception("end cannot be greater than start!")
  let list = []

  for(var i = start; i < end; i++)
  {
    list.push(i);
  }

  return list;
}
