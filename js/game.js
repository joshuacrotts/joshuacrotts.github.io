var canvas = document.getElementById("myCanvas");
var ctx    = canvas.getContext("2d");
var BRICK_SPRITES = [] //0 - RED, 1 - GREEN
const BRICK_TYPES = 2;

var POWER_UPS = [] //0 - multi
const POWER_TYPES = 2;

var currentPowerUps = [];

window.onload = function() {
  //Initializes the bricks
  for(c = 0; c < brickColumnCount; c++)
  {
    bricks[c] = []

    for(r = 0; r < brickRowCount; r++)
    {
      bricks[c][r] = {x : 0, y : 0, status : 1};
    }
  }

  //Loads in brick images
  for(i = 0; i < BRICK_TYPES; i++)
  {
    BRICK_SPRITES.push(new Image());
  }
  BRICK_SPRITES[0].src = "images/brickbreaker_images/bricks/redbrick.png";
  BRICK_SPRITES[1].src = "images/brickbreaker_images/bricks/greenbrick.png";

  //Loads in power ups
  for(i = 0; i < POWER_TYPES; i++)
  {
    POWER_UPS.push(new Image());
  }
  POWER_UPS[0].src = "images/brickbreaker_images/Multi/multi0.png";
  POWER_UPS[1].src = "images/brickbreaker_images/Large/large0.png";

  randomizeBallVelocity();
}


/* Game State information
 * GAME_STATES[PLAY] = 1 for play to be active
 */
GAME_STATES = [];
const MENU  = 0;
const PLAY  = 1;
const PAUSE = 2;

GAME_STATES.push(1, 0, 0);

//Constants
const RED   = "#ff0000";
const WHITE = "#ffffff";

//Canvas information
var x = canvas.width / 2;
var y = canvas.height - 80;

//Paddle variables
var paddleHeight = 10;
var paddleWidth  = 75;
var paddleX      = (canvas.width - paddleWidth) / 2;

//Key press variables
var rightPressed = false;
var leftPressed  = false;

//Ball information
var ballRadius       = 5;
var ballColor        = RED;
var ballOutline      = WHITE;

//Brick information
var brickRowCount    = 7;
var brickColumnCount = 5;

//Single brick information
var brickWidth      = 80;
var brickHeight     = 20;
var brickPadding    = 7;
var brickOffsetTop  = 30;
var brickOffsetLeft = 40;

//Game logic
var count = brickRowCount * brickColumnCount;
var rem   = count;
var score = 0;
var lives = 50;

var speedUp = [];

//List of bricks
var bricks = [];

//Numbers for generating the random ball velocity
var upper_limit = -4.0;
var lower_limit = 4.0;
var velX;
var velY;

function drawBall()
{
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle  = ballColor;
  ctx.fillStroke = ballOutline;
  ctx.stroke     = 10;

  ctx.fill();
  ctx.closePath();
}

function drawPaddle()
{
  ctx.beginPath();
  //x, y, w, h
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#00ffff";
  ctx.fill();
  ctx.closePath();
}

function drawBricks()
{
  for(c = 0; c < brickColumnCount; c++)
  {
    for(r = 0; r < brickRowCount; r++)
    {
      if(bricks[c][r].status == 1)
      {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();

        if(c % 2 === 0)
        {
          ctx.drawImage(BRICK_SPRITES[0], brickX, brickY);
        }
        else
        {
          ctx.drawImage(BRICK_SPRITES[1], brickX, brickY);
        }

        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawPowerUps()
{
  if(currentPowerUps.length === 0)
    return;

  for(i = 0; i < powerUps.length; i++)
  {
    var powerUp = currentPowerUps[i]
    ctx.drawImage(currentPowerUps[powerUp],
                  currentPowerUps[powerUp].x,
                  currentPowerUps[powerUp].y);
    currentPowerUps[powerUps].y += 1;
  }
}

function collisionDetection()
{
  //Ball collision
  if(y + velY < ballRadius)
  {
    velY = -velY;
  }
  else if(y + velY > canvas.height - ballRadius)
  {
    if(x >= paddleX && x <= paddleX + paddleWidth)
    {
      velY = - velY;
    }
    else
    {
      lives--;
      if(!lives)
      {
        alert("Sorry, you lost.");
        document.location.reload();
      }
      else
      {
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleWidth = 80;
        rem         = count;
        paddleX     = ((canvas.width - paddleWidth) / 2);

        randomizeBallVelocity();
      }
    }
  }
  else
  {
    y += velY;
  }

  if(x + velX < ballRadius || x + velX > canvas.width - ballRadius)
  {
    velX = -velX;
  }
  else
  {
    x += velX;
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth)
  {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0)
  {
    paddleX -= 7;
  }

  //Brick collision
  for(c = 0; c < brickColumnCount; c++)
  {
    for(r = 0; r < brickRowCount; r++)
    {

        var b = bricks[c][r];

        if(b.status == 1)
        {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight)
          {
            var snd=new Audio("audio/explode_1.wav");
            snd.play();
            velY = -velY;
            b.status = 0;
            score++;
            count--;


            //var powerUpRand = getRandomInteger(5);
            // //Possibly pull a powerUp
            // if(powerUpRand == 3)
            // {
            //   currentPowerUps.push(1, {x: b.x, y : b.y, status: 1});
            // }
            // else if(powerUpRand == 2)
            // {
            //   currentPowerUps.push(1);
            // }

            /*** Change color of ball when it touches a brick ***/
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            if(ballColor == RED)
            {
              ballColor = WHITE;
              ballOutline = RED;
            }
            else
            {
              ballColor = RED;
              ballOutline = WHITE;
            }

            ctx.stroke = "10";
            ctx.fill();
            ctx.closePath();
          }

          if(count === 0)
          {
            alert("You won!");
            document.location.reload();
          }
        }

    }
  }
}

function drawScore()
{
  ctx.font = "18px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 40, 20);
}

function drawTitle()
{
  ctx.font = "18px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("BRICK BREAKER", canvas.width - 320, 20);
}
function drawLives()
{
  ctx.font = "18px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Lives: " + lives, canvas.width - 90, 20);
}

function drawMenu()
{
  ctx.font = "18px Arial"
  ctx.fillStyle = "#fff"
  var x = getRandomArbitrary(canvas.width - 351, canvas.width - 349);
  var y = getRandomArbitrary(319, 321);
  ctx.fillText("PRESS SPACE TO PLAY", x, y);
}

function keyDownHandler(e)
{
  if(GAME_STATES[MENU] == 1){
    if(e.keyCode == 32)
    {
      GAME_STATES[PLAY] = 1;
      GAME_STATES[MENU] = 0;
    }
  }
  else if(GAME_STATES[PLAY] == 1)
  {
    if(e.keyCode == 39)
      rightPressed = true;
    if(e.keyCode == 37)
      leftPressed = true;
  }
}

function keyUpHandler(e)
{
  if(e.keyCode == 39)
  {
    rightPressed = false;
  }
  if(e.keyCode == 37)
  {
    leftPressed = false;
  }
}

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawTitle();
  drawLives();
  drawPowerUps();

  if(GAME_STATES[MENU] == 1)
    drawMenu();

  if(GAME_STATES[PLAY] == 1)
    collisionDetection();
}

function randomizeBallVelocity()
{
  do{
    velX = getRandomArbitrary(lower_limit, upper_limit);
  }while(velX < 2.0 && velX > -2.0);

  do{
    velY = getRandomArbitrary(lower_limit, upper_limit);
  }while(velY < 2.0 && velY > -2.0);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInteger(max)
{
  return Math.floor(Math.random() * max);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(draw, 16.66);
