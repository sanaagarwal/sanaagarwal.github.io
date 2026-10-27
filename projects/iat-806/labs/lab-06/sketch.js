let balls = [];
let numBalls = 2000;
let bodySegmentation
let video
let segmentation

let options = {
  maskType: "person",
};

async function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent("sketch-holder");

  video = createCapture("VIDEO");
  video.size(640,480);
  video.hide();

  bodySegmentation = await ml5.bodySegmentation ("BodyPix", options);
  bodySegmentation.detectStart(video, gotResults);


  for (let i = 0; i < numBalls; i++) {
    balls.push(createRandomBall());
  }
}

function draw() {
  background(120);
  //image(video, 0, 0);

  // if (segmentation) {
  //   image(segmentation.mask, 0, 0, width, height);
  // }

  for (let star of balls) {
    //let active = star.contains(mouseX, mouseY)
    let active
    if (segmentation){
      active  = star.isOnBody(segmentation.mask)
    }
    star.respond(active);
    star.update(2)
  }
}

function mousePressed() {
  balls.forEach((ball) => {
    let active = ball.contains(mouseX, mouseY)
    ball.respond(active);
  })
}

function gotResults(result) {
  segmentation = result;
}
