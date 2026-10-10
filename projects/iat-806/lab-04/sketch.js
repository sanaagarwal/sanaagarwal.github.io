let frames = []
let numFrames = 8
let numCols = 8
let numRows = 6
let colWidth
let rowHeight

let colors = []
let speeds = []


async function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');

  for (let i = 0; i < numCols; i++) {
    colors[i] = [];
    speeds[i] = [];
    for (let j = 0; j < numRows; j++) {
      colors[i][j] = [random(0, 255), random(0, 255), random(0, 255)];
      speeds[i][j] = random (1, 10)
    }
  }
  colWidth = width / numCols;
  rowHeight = height / numRows;

  for (let i = 0; i < numFrames; i++) {
    let fileName1 = "frames/frame_"+i+".png";
    frames.push(await loadImage(fileName1));
  }
}

function draw() {
  background(120);

  if (mouseX < width){
    numCols = floor(map(mouseX, 0, width, 1, 20 ))
    colWidth = width / numCols;
  }


  for(let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      fill (colors[i][j][0], colors[i][j][1], colors[i][j][2], 100);
      rect(i * colWidth,j * rowHeight, colWidth, rowHeight);
      animate(frames, speeds[i][j], i * colWidth, j * rowHeight, 60)
    }
  }

  let speed = 10
 //  animate(frames, 10, 50, 80, 100)
 //  animate(frames, 15, 215, 80, 200)
 //  animate(frames, 5, 400, 80, 300)
}

function animate(frames, speed, xPos, yPos, imgWidth, imgHeight) {

  let index = getFrameIndex(speed)
  let currentFrame = frames[index]

  let origWidth = currentFrame.width
  let origHeight = currentFrame.height

  if (imgWidth && !imgHeight){
    let scale = imgWidth / origWidth
    imgHeight = scale * origHeight
  }

  // TODO : complete the logic of having the right scale thing

  image(currentFrame, xPos, yPos, imgWidth, imgHeight)

}

function getFrameIndex (speed){
  let slowFrame = floor(frameCount / speed)

  return slowFrame % numFrames
}

function keyPressed () {
  if (key === ' '){
    noLoop()
    return false;
  }

}


