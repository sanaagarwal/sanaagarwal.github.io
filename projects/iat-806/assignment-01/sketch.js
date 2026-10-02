// REQUIREMENTS:
//     DONE   Several shapes — at least three kinds, like circle(), rect(), triangle(), line(), arc().
//     DONE   The mouse — mouseX, mouseY, mouseIsPressed, or mousePressed().
//     DONE   The keyboard — keyIsPressed, key, or keyPressed().
//     DONE   Conditionals — if / else. Something changes when something is true.
//     DONE   Randomness — random(). Something is different each time.
//     DONE   An array — a list of things, like colors, positions, or words, that your sketch uses.
//     DONE   A function you wrote — at least one of your own, besides setup() and draw().

// --- TODO ---
// enter key
// >> fireworks/party/music
// >> sweet treat
// trailing paws
// bound animal / clicks  to canvas only

// import

let startImage
let bgScene
let petAnimal = "bear"
let currentAnimalIndex = 0
let listOfAnimals = ['bear', 'bunny', 'cat']
let currentBgIndex = 0
let listOfBg = []
let currentColorIndex = 0
let listOfColor = ["#533c24","#f6eeee","#d33b28", "#276fb5", "#23754a", "#808183"]
let petColor = listOfColor[0];
let isClicked = true;
let xPos = 550
let yPos = 280
let coordsHistory = [[550, 280]]



async function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');

  startImage = await loadImage("./bg/start.png");
  bgScene = startImage
  listOfBg[0] = await loadImage('./bg/clouds.png');
  listOfBg[1] = await loadImage('./bg/halloween.png');
  listOfBg[2] = await loadImage('./bg/meadow.png');
  listOfBg[3] = await loadImage('./bg/stars.png');

}

function draw() {

  background(bgScene);

  fill(30, 30, 30, 80)
  rect(0,0,width, height);

  fill(20);

  let index = 0
  let innerArray = coordsHistory[index];
  let cordIndexX = coordsHistory[index][0];
  let cordIndexY = coordsHistory[index][1];
  for (let i = 0; i < cordIndexX; i++) {
    circle(cordIndexX+80, cordIndexY, 100);
    // index++;
  }


   if (isClicked === true) {
     drawPet(xPos, yPos, petColor, petAnimal)
   } else {
     drawPet (mouseX, mouseY, petColor, petAnimal);
     coordsHistory.push({x: mouseX, y: mouseY});
     if (coordsHistory.length >= 100){
       coordsHistory.shift();
     }
   }

}


function mousePressed() {
  isClicked = !isClicked
  xPos = mouseX;
  yPos = mouseY;
  //console.log(coordsHistory[0], coordsHistory[1], coordsHistory[2]);

}

function keyPressed() {
  if (key === 'c'){
    currentColorIndex = (currentColorIndex + 1) % listOfColor.length
    petColor = listOfColor[currentColorIndex];
  }
  if (key === 'a'){
    currentAnimalIndex = ( currentAnimalIndex + 1 ) % listOfAnimals.length
    petAnimal = listOfAnimals[currentAnimalIndex];
  }
  if (key === 'b'){
    currentBgIndex = ( currentBgIndex + 1 ) % listOfBg.length
    bgScene = listOfBg[currentBgIndex];
  }
  if (key === ' '){
    bgScene = random(listOfBg);
    petAnimal = random(listOfAnimals);
    petColor = random(listOfColor);
    return false;
  }
  if (keyCode === 13){
    bgScene = startImage
  }
}

function drawPet (x, y, animalColor, animalType){
  if (animalType === 'bear'){
    drawBear(x, y, animalColor)
  } else if (animalType === 'bunny'){
    drawBunny(x, y, animalColor)
  } else if (animalType === 'cat'){
    drawCat(x, y, animalColor)
  }
}