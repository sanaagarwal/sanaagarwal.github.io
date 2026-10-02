// global variables
let frame0

let frames = []
let index
let numFrames = 8

// setup only runs once
async function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');

  for (let i = 0; i < numFrames; i++) {
   // let fileName = `frames/frame_${i}.png`
    let fileName = "frames/frame_"+i+".png";
    frames.push(await loadImage(fileName));
  }
}

// draw runs forever (on loop)
function draw() {
  background(60);
  fill (1000)

  let speed = 15
  let slowFrame = floor(frameCount / speed)
  index = slowFrame % frames.length
  image(frames[index], 100, 100, 192, 256)

  text(frameCount, 500, 300)


}

