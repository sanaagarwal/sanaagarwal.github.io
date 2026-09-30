// A sketch that reacts when someone uses the mouse and the keyboard.
// It can be a toy, a creature, a game, a machine that does nothing useful. Anything.
// Make it fun and weird. The stranger and more playful it is, the better. Bonus points for weird.

// REQUIREMENTS:
//     DONE   Several shapes — at least three kinds, like circle(), rect(), triangle(), line(), arc().
//     DONE   The mouse — mouseX, mouseY, mouseIsPressed, or mousePressed().
//     DONE   The keyboard — keyIsPressed, key, or keyPressed().
//     DONE   Conditionals — if / else. Something changes when something is true.
//     DONE   Randomness — random(). Something is different each time.
//     DONE   An array — a list of things, like colors, positions, or words, that your sketch uses.
//     DONE   A function you wrote — at least one of your own, besides setup() and draw().

// IDEA: pet outing party
// multiple animals w varying expressions
// change animal color w 'c'
// change bg w 'b'
// change animal 'a'
// change expression w 'e' ??
// space for random generated one
// mouse to move it around / click to place it

// enter for fireworks/party/music

let petColor = "grey"
let petExpr
let bgScene
let petAnimal = "bear"
let currentAnimalIndex = 0
let listOfAnimals = ['bear', 'bunny', 'cat']
let currentBgIndex = 0
let listOfBg = []
let isClicked = false;
let xPos = 0
let yPos = 0



async function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');

  bgScene = await loadImage("./bg/home.png");
  listOfBg[0] = await loadImage('./bg/clouds.png');
  listOfBg[1] = await loadImage('./bg/halloween.png');
  listOfBg[2] = await loadImage('./bg/meadow.png');
  listOfBg[3] = await loadImage('./bg/stars.png');

}

function draw() {

  background(bgScene);



  // drawScene = default (randomly generated)

  // if (e pressed) { petExpr = next on [list of expr] }
  // if (space pressed) {
        // petColor = random
        // bgScene = random
        // petExpr = random
        // petAnimal = random
        // drawScene() }

   (isClicked === true) ? drawPet(xPos, yPos, petColor, petAnimal) : drawPet (mouseX, mouseY,petColor, petAnimal);

}


function mousePressed() {
  isClicked = !isClicked
  xPos = mouseX;
  yPos = mouseY;
}

function keyPressed() {
  if (key === 'c'){
    // maybe change to array of colors  ??
    petColor = color(random(255), random(255), random(255));
  }
  if (key === 'a'){
    currentAnimalIndex = ( currentAnimalIndex + 1 ) % listOfAnimals.length
    petAnimal = listOfAnimals[currentAnimalIndex];
  }
  if (key === 'b'){
    currentBgIndex = ( currentBgIndex + 1 ) % listOfBg.length
    bgScene = listOfBg[currentBgIndex];
  }
}

function drawPet (x, y, animalColor, animalType){
  if (animalType === 'bear'){
    drawBear(x, y, animalColor)
  }
  if (animalType === 'bunny'){
    drawBunny(x, y, animalColor)
  }
  if (animalType === 'cat'){
    drawCat(x, y, animalColor)
  }
}

function drawBear(x, y, animalColor) {
  push();
  translate(x, y);

  // --- LAYER 1: THE BODY (Furthest Back) ---
  fill(animalColor);
  noStroke(); // Makes the shapes look softer and less harsh
  arc(0, 85, 190, 160, PI, TWO_PI); // Tweaked position to attach to the head better

  // --- LAYER 2: THE EARS ---
  // Left Ear (Outer then Inner)
  fill(animalColor);
  circle(-50, -45, 45);
  fill("#ffccd5"); // Cute soft pink inner ear!
  circle(-50, -45, 25);

  // Right Ear (Outer then Inner)
  fill(animalColor);
  circle(50, -45, 45);
  fill("#ffccd5");
  circle(50, -45, 25);

  // --- LAYER 3: THE MAIN HEAD ---
  fill(animalColor);
  circle(0, 0, 120);

  // --- LAYER 4: BLUSHY CHEEKS ---
  fill("rgba(255, 182, 193, 0.6)"); // Transparent pink for soft cheeks
  circle(-40, 15, 20); // Left cheek
  circle(40, 15, 20);  // Right cheek

  // --- LAYER 5: THE EYES ---
  // Left Eye
  fill("white");
  circle(-22, -5, 22); // Shifted down slightly for cuteness
  fill("black");
  circle(-22, -5, 12);
  fill("white");
  circle(-25, -8, 5); // Little shiny eye reflection catch-light

  // Right Eye (Fixed the color bug here)
  fill("white");
  circle(22, -5, 22);
  fill("black");
  circle(22, -5, 12);
  fill("white");
  circle(19, -8, 5); // Reflection catch-light

  // --- LAYER 6: THE SNOUT & MOUTH ---
  fill("#f5ebe0"); // Soft cream/beige color for the snout mask
  circle(0, 20, 35);

  // Nose
  fill("black");
  circle(0, 12, 10);

  // Happy little smile arc
  noFill();
  stroke("black");
  strokeWeight(2);
  arc(0, 16, 14, 10, 0, PI); // Classic curved smile container

  pop();
}


function drawBunny(x, y, animalColor) {
  push();
  translate(x, y);
  noStroke(); // Removes harsh outlines for that clean, soft look

  // --- LAYER 1: THE BODY (Furthest Back) ---
  fill(animalColor);
  arc(0, 85, 190, 160, PI, TWO_PI); // Same body dimensions as the bear

  // --- LAYER 2: THE LONG FLOOPY EARS ---
  // Left Ear (Outer then Inner)
  fill(animalColor);
  rect(-42, -140, 32, 100, 20); // Smooth rounded rectangle ears
  fill("#ffccd5"); // Matching soft pink inner ear
  rect(-35, -132, 18, 80, 15);

  // Right Ear (Outer then Inner)
  fill(animalColor);
  rect(10, -140, 32, 100, 20);
  fill("#ffccd5");
  rect(17, -132, 18, 80, 15);

  // --- LAYER 3: THE MAIN HEAD ---
  fill(animalColor);
  circle(0, 0, 120);

  // --- LAYER 4: BLUSHY CHEEKS ---
  fill("rgba(255, 182, 193, 0.6)"); // Same translucent pink cheeks
  circle(-40, 15, 20);
  circle(40, 15, 20);

  // --- LAYER 5: THE EYES (With Catch-Lights) ---
  // Left Eye
  fill("white");
  circle(-22, -5, 22);
  fill("black");
  circle(-22, -5, 12);
  fill("white");
  circle(-25, -8, 5); // Glistening reflection

  // Right Eye
  fill("white");
  circle(22, -5, 22);
  fill("black");
  circle(22, -5, 12);
  fill("white");
  circle(19, -8, 5); // Glistening reflection

  // --- LAYER 6: THE SNOUT, NOSE & BUCKO TEETH ---
  // Two small buck teeth clipping under the snout
  fill("white");
  rect(-10, 22, 9, 12, 0, 0, 3, 3); // Left tooth (slightly rounded bottom corners)
  rect(1, 22, 9, 12, 0, 0, 3, 3);  // Right tooth

  fill("#f5ebe0"); // Matching cream/beige snout mask
  circle(0, 20, 35);

  // Tiny soft pink triangle nose right in the middle
  fill("#ffccd5");
  triangle(-7, 13, 7, 13, 0, 21);

  pop();
}

function drawCat(x, y, animalColor) {
  push();
  translate(x, y);
  noStroke(); // Keeps the artwork soft and clean

  // --- LAYER 1: THE BODY (Furthest Back) ---
  fill(animalColor);
  arc(0, 85, 190, 160, PI, TWO_PI); // Standard matching body arch

  // --- LAYER 2: THE SHARP CAT EARS ---
  // Left Ear Outer & Inner
  fill(animalColor);
  triangle(-55, -25, -20, -55, -50, -85); // Pointy cat ear triangle
  fill("#ffccd5"); // Matching soft pink inner ear detail
  triangle(-51, -30, -23, -53, -47, -76);

  // Right Ear Outer & Inner
  fill(animalColor);
  triangle(55, -25, 20, -55, 50, -85);
  fill("#ffccd5");
  triangle(51, -30, 23, -53, 47, -76);

  // --- LAYER 3: THE MAIN HEAD ---
  fill(animalColor);
  circle(0, 0, 120); // Head diameter matches your other pets

  // --- LAYER 4: BLUSHY CHEEKS ---
  fill("rgba(255, 182, 193, 0.6)"); // Translucent pink cheeks
  circle(-40, 15, 20);
  circle(40, 15, 20);

  // --- LAYER 5: THE EYES (With Catch-Lights) ---
  // Left Eye
  fill("white");
  circle(-22, -5, 22);
  fill("black");
  circle(-22, -5, 12);
  fill("white");
  circle(-25, -8, 5); // Glistening reflection

  // Right Eye
  fill("white");
  circle(22, -5, 22);
  fill("black");
  circle(22, -5, 12);
  fill("white");
  circle(19, -8, 5);

  // --- LAYER 6: THE SNOUT & WHISKERS ---
  // Whiskers need to be thin, sharp lines
  stroke("#4a4a4a"); // Soft dark grey stroke for the lines
  strokeWeight(2.5);
  strokeCap(ROUND); // Makes the ends of the whisker lines rounded and clean

  // Left Whiskers
  line(-35, 15, -65, 12); // Top left whisker
  line(-35, 22, -65, 25); // Bottom left whisker

  // Right Whiskers
  line(35, 15, 65, 12);  // Top right whisker
  line(35, 22, 65, 25);  // Bottom right whisker

  noStroke(); // Turn off strokes before drawing the remaining shapes

  // Soft cream/beige double-circle snout mask
  fill("#f5ebe0");
  circle(-8, 20, 22); // Left cheek pad
  circle(8, 20, 22);  // Right cheek pad

  // Tiny soft pink inverted triangle nose sitting right in the seam
  fill("#ffccd5");
  triangle(-6, 13, 6, 13, 0, 19);

  // Happy mouth line hanging below the nose
  noFill();
  stroke("#4a4a4a");
  strokeWeight(2);
  // Double curve for a classic cat "w" mouth shape
  arc(-6, 20, 12, 10, 0, PI);
  arc(6, 20, 12, 10, 0, PI);

  pop();
}



