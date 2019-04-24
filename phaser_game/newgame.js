const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

let player
let bricks

let red_brick
let blue_brick
let green_brick
let yellow_brick

let balls

let score = 0

const ROW_BRICKS = 5
const COL_BRICKS = 7

const BRICK_WIDTH = 60
const BRICK_HEIGHT = 15

function preload()
{
  game.load.image('sky', 'assets/sky.png')
  game.load.image('platform', 'assets/platform.png')
  game.load.image('paddle', 'brickbreaker_images/paddle.png')
  game.load.image('ball', 'brickbreaker_images/ball.png')
  game.load.image('redbrick', 'brickbreaker_images/bricks/redbrick.png')
  game.load.image('bluebrick', 'brickbreaker_images/bricks/bluebrick.png')
  game.load.image('greenbrick', 'brickbreaker_images/bricks/greenbrick.png')
  game.load.image('yellowbrick', 'brickbreaker_images/bricks/yellowbrick.png')
}

function create()
{
  //Initialize the physics system
  game.physics.startSystem(Phaser.Physics.ARCADE)

  //Load in the background sprite
  game.add.sprite(0, 0, 'sky')

  //Create the group which encapsulates all bricks
  bricks = game.add.group()
  bricks.enableBody = true

  //Create the group which holds all the balls
  balls = game.add.group()
  balls.enableBody = true

  /*Initializes the bricks (position and type)*/
  let leftOffset = 150
  //Offset from the far left of the screen (50)
  for(var y = 30; y <= COL_BRICKS * 30; y += 30)
  {
    for(var x = leftOffset; x < game.world.height; x += BRICK_WIDTH + 10)
    {
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
  let ball = balls.create(300, 300, 'ball')

  //Adds the paddle to the screen
  player = game.add.sprite(32, game.world.height - 20, 'paddle')
  game.physics.arcade.enable(player)
  player.body.immovable = true
  player.body.collideWorldBounds = true
  player.anchor.set(0.5,1);

  scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000'})
  cursors = game.input.keyboard.createCursorKeys()

  for(var c = 0; c < balls.children.length; c++)
  {
    balls.children[c].body.velocity.set(150, -150)
    balls.children[c].body.collideWorldBounds = true
    balls.children[c].anchor.set(0.5)
    balls.children[c].body.bounce.set(1)

  }
}

function update()
{
  game.physics.arcade.collide(player, balls)
  game.physics.arcade.collide(balls, bricks, ballHitsBrick)

  if(cursors.left.isDown)
  {
    player.body.velocity.x = -150
  }
  else if(cursors.right.isDown)
  {
    player.body.velocity.x = 150
  }
  else
  {
    player.body.velocity.x = 0
  }
}

function ballHitsBrick(ball, brick)
{
  brick.kill()
}
