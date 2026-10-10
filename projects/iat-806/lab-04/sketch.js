let frames = [];
let frames2 = [];
let numFrames = 8;
let numCols = 20;
let numRows = 10;
let colWidth;
let rowHeight;
let colors = [];
let speeds = [];

async function setup() {
  const canvas = createCanvas(800, 420);
  canvas.parent("sketch-holder");

  for (let i = 0; i < 50; i++) {
    colors[i] = [];
    speeds[i] = [];
    for (let j = 0; j < 30; j++) {
      colors[i][j] = [random(1, 255), random(1, 255), random(1, 255)];
      speeds[i][j] = random(1, 10);
    }
  }

  rowHeight = height / numRows;

  for (let i = 0; i < numFrames; i++) {
    let fileName = "frames/frame_" + i + ".png";
    frames.push(await loadImage(fileName));
  }

  for (let i = 0; i < 4; i++) {
    let fileName = "frames2/frame_" + i + ".png";
    frames2.push(await loadImage(fileName));
  }
}

function draw() {
  background(120);

  if (mouseX < width && mouseX > 0) {
    numCols = Math.floor(map(mouseX, 0, width, 2, 20));
    colWidth = width / numCols;
  }

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {

      let topLeftX = i * colWidth;
      let topLeftY = j * rowHeight;
      let x = i * colWidth + (colWidth / 2);
      let y = j * rowHeight + (rowHeight / 2);

      let d = dist(mouseX, mouseY, x, y);
      let maxDist = dist(0, 0, width, height);

      // speed of dancer
      let speed = map(d, 0, maxDist, 2, 20);
      speed = constrain(speed, 1, 30);

      // cell colors
      fill(colors[i][j][0], colors[i][j][1], colors[i][j][2], 120);
      rect(topLeftX, topLeftY, colWidth, rowHeight);

      // size of dancer
      let dynamicWidth = map(d, 0, 600, colWidth, colWidth * 0.4);
      dynamicWidth = constrain(dynamicWidth, colWidth * 0.4, colWidth);

      // type of dancer
      if (d < 200) {
          animate(frames2, speed, topLeftX, topLeftY, dynamicWidth);
        } else {
          animate(frames, speed, topLeftX, topLeftY, dynamicWidth);
        }
    }
  }
}

function animate(frames, speed, xPosition, yPosition, imageWidth, imageHeight) {
  let index = getFrameIndex(frames, speed);
  let currentFrame = frames[index];
  if (!currentFrame || !currentFrame.width) {
    return;
  }
  let origWidth = currentFrame.width;
  let origHeight = currentFrame.height;

  if (!imageWidth && !imageHeight) {
    imageWidth = origWidth;
    imageHeight = origHeight;
  } else if (imageWidth && !imageHeight) {
    let scale = imageWidth / origWidth;
    imageHeight = scale * origHeight;
  } else if (imageHeight && !imageWidth) {
    let scale = imageHeight / origHeight;
    imageWidth = scale * origWidth;
  }

  image(currentFrame, xPosition, yPosition, imageWidth, imageHeight);
}

function getFrameIndex(frames, speed) {
  let slowFrame = Math.floor(frameCount / speed);
  return slowFrame % frames.length;
}
