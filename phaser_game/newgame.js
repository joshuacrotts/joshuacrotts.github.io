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

  //Offset from the far left of the screen (50)
  for(var y = 20; y <= COL_BRICKS * 50; y += 20)
  {
    for(var x = 30; x < game.world.height; x += 70)
    {

    }
  }
  let brick = platforms.create(400, 450, 'redbrick')
  brick.body.immovable = true

  let ball = balls.create(300, 300, 'ball')

  player = game.add.sprite(32, game.world.height - 150, 'paddle')
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

function update()
{
  game.physics.arcade.collide(player, balls)
  //game.physics.arcade.collide(balls, bricks)
  //game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)


  if(cursors.left.isDown)
  {
    player.body.velocity.x = -150
  }else if(cursors.right.isDown)
  {
    player.body.velocity.x = 150
  }else {
    player.body.velocity.x = 0
  }
}
