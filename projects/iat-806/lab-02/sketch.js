// testing sketch.js edits for github


// global variables
let xCord = 100;
let yCord = 100;
let xChange = 3;
let yChange = 3;
let diameter = 120;
let sizeIncrement = 1;
let rightColor = "blue";
let leftColor = "red";
let ballColor;
let isPaused = false;

// setup only runs once
function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');
}

// draw runs forever (on loop)
function draw() {
  background(20);

  // left half is one color, right half is the other
  ballColor = (xCord > width / 2) ? rightColor : leftColor
  fill(ballColor);

  // only change circle's variables if not paused
  if (isPaused === false){
    yCord += yChange;
    xCord += xChange;
    diameter += sizeIncrement;
  }

  let radius = diameter / 2;

  // restrict coordinates within hte canvas frame to prevent circle from glitching
  xCord = constrain(xCord, radius, width-radius)
  yCord = constrain(yCord, radius, height-radius)

  // change direction and size
  if (xCord >= (width - radius) || xCord <= radius) {
    xChange *= -1
    sizeIncrement *= -1
  }
  if (yCord >= height - radius || yCord <= radius) {
    yChange *= -1
  }

  // draw circle
  circle(xCord, yCord, diameter);
}


function mousePressed() {

  // don't change anything if paused
  if (isPaused === true) {
    return;
  }

  // give random colors to the 2 sides
  leftColor = color (random(255), random(255), random(255));
  rightColor = color (random(255), random(255), random(255));

  // change direction
  xChange *= -1;
  yChange *= -1;

  // change speed
  sizeIncrement *= -1;
}

function keyPressed() {
  // if space is pressed, make isPaused variable true
  if (key === ' ') {
    isPaused = !isPaused
  }

}


