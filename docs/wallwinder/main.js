title = "Wallwinder";

description = `[HOLD]\nto freeze time\nDon't touch\nANYTHING!`;

characters = [
 `
 RR
 RR
 `,
 `
 rr
 rr
 `,
 `
 ll
 ll
 `
];

options = {
  viewSize: { x: 100, y: 100 },
  theme: "shapeDark",
  isPlayingBgm: true
};

let ball;
let ballX;
let ballY;
let ballVelX = 0;
let ballVelY = 0;
let prevVelX = 0;
let prevVelY = 0;
let nowBar;
let prevBar;
let barAngle;
let prevAngle;
let barAngleVel;
let BarSpeed;
let barRotation = 1;
// walls
let wallPos;
let wallBoxes;
let wallSpeed;
let wallsOut = 0;

function update() {
  if (!ticks) {
    reset();
  }
  if(ticks % 60 == 0 && !input.isPressed)
    score++;

  // background
  color("black");
  rect(10, 119, 80, 1);

  color("light_red");
  // corners
  rect(0, 0, 5, 5);
  rect(0, 95, 5, 5);
  rect(95, 0, 5, 5);
  rect(95, 95, 5, 5);
  // walls
  rect(0, 0, 100, 1);
  rect(0, 0, 1, 100);
  rect(99, 0, 1, 100);
  rect(0, 99, 100, 1);
  color("black");

  // draw wall boxes
  wallPos[0].forEach(pos => {
    char("a", pos.x, pos.y);
  });
  wallPos[1].forEach(pos => {
    char("a", pos.x, pos.y);
  });
  wallPos[2].forEach(pos => {
    char("a", pos.x, pos.y);
  });
  wallPos[3].forEach(pos => {
    char("a", pos.x, pos.y);
  });
  // the walls are alive
  let topPos = vec(wallBoxes[0]);
  char("b", topPos.x, topPos.y);
  let leftPos = vec(wallBoxes[1]);
  char("b", leftPos.x, leftPos.y);
  let bottomPos = vec(wallBoxes[2]);
  char("b", bottomPos.x, bottomPos.y);
  let rightPos = vec(wallBoxes[3]);
  if(rightPos.x < 0)
    wallsOut = 0;
  char("b", rightPos.x, rightPos.y);

  // input and player update
  ball = box(ballX, ballY, 2.5);
  if(input.isJustPressed)
  {
    prevAngle = barAngle;
  }
  if(input.isPressed)
  {
    // rotate bar
    barAngle += barAngleVel * BarSpeed * barRotation;
    prevBar = bar(ballX, ballY, 10 * sqrt(pow(ballVelX, 2) + pow(ballVelY, 2)), 0.5, prevAngle, 0);
    nowBar = bar(ballX, ballY, 10, 0.5, barAngle, 0);
    BarSpeed += 0.001;
  }
  else if(input.isJustReleased)
  {
    barRotation *= -1;
    BarSpeed = 0.03;
    
    const shootSpeed = 1;
    prevVelX = ballVelX;
    prevVelY = ballVelY;
    ballVelX = Math.cos(barAngle) * shootSpeed;
    ballVelY = Math.sin(barAngle) * shootSpeed;
  }
  else // unfreeze time
  {
    // Update the ball's position
    ballX += speedLimit(ballVelX + prevVelX);
    ballY += speedLimit(ballVelY + prevVelY);
    // ballVelX /= 1.01;
    // ballVelY /= 1.01;
    prevVelX /= 1.02;
    prevVelY /= 1.02;
    prevBar = bar(ballX, ballY, 10 * sqrt(pow(prevVelX, 2) + pow(prevVelY, 2)), 0.5, prevAngle, 0);
    nowBar = bar(ballX, ballY, 10 * sqrt(pow(ballVelX, 2) + pow(ballVelY, 2)), 0.5, barAngle, 0);
    // update wall box pos
    wallBoxes[0] = vec(topPos.x, topPos.y + wallSpeed);
    wallBoxes[1] = vec(leftPos.x + wallSpeed, leftPos.y);
    wallBoxes[2] = vec(bottomPos.x, bottomPos.y - wallSpeed);
    wallBoxes[3] = vec(rightPos.x - wallSpeed, rightPos.y);
  }

  // wall collision
  if (ball.isColliding.rect.light_red || ball.isColliding.char.a || ball.isColliding.char.b) {

    end();
  }

  if(ticks != 0 && ticks % 120 == 0 && wallsOut == 0)
  {
    // make sure they are empty
    wallBoxes.pop();
    wallBoxes.pop();
    wallBoxes.pop();
    wallBoxes.pop();
    let top, left, bottom, right;
    // get a random position of a remaining wall boxes
    top = getRandom(wallPos[0]);
    left = getRandom(wallPos[1]);
    bottom = getRandom(wallPos[2]);
    right = getRandom(wallPos[3]);
    // vacate wall box
    wallBoxes.push(wallPos[0][top]);
    wallBoxes.push(wallPos[1][left]);
    wallBoxes.push(wallPos[2][bottom]);
    wallBoxes.push(wallPos[3][right]);
    wallPos[0][top] = vec(0, 0);
    wallPos[1][left] = vec(0, 0);
    wallPos[2][bottom] = vec(0, 0);
    wallPos[3][right] = vec(0, 0);
    wallsOut = 1;
  }
}

function reset() {
  ballX = 50;
  ballY = 50;
  ballVelX = 0;
  ballVelY = 0;
  prevVelX = 0;
  prevVelY = 0;
  barAngle = PI / 2;
  BarSpeed = 0.03;
  barAngleVel = 2;
  // the walls sleep
  wallPos = [];
  wallBoxes = [];
  wallPos.push([]);
  wallPos.push([]);
  wallPos.push([]);
  wallPos.push([]);
  for (let i = 5; i <= 95 ; i += 2)
  {
    wallPos[0].push(vec(i, 2)); // Top wall
    wallPos[1].push(vec(1, i)); // Left wall
    wallPos[2].push(vec(i, 98)); // Bottom wall
    wallPos[3].push(vec(97, i)); // Right wall
  }
  wallSpeed = 2;
}

function speedLimit(num) {
  const maxSpeed = 1.5;
  if(num > 0 && num > maxSpeed)
    return maxSpeed;
  else if(num < 0 && num < -maxSpeed)
    return -maxSpeed;
  else
    return num;
}

function getRandom(arr) {
  return Math.floor(Math.random() * arr.length);
}