let character = []
let ball = []
let lights = []
let index = 0
let numFrames = 8
let bg
let audios = []
let currentAudioIndex = -1
let isPaused = false
let dancerFrames = 0
let dancerSpeed = 10;

async function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');

  bg = await loadImage('backdrop.png');
  for (let i = 0; i < numFrames; i++) {
    let fileName1 = "frames/frame_"+i+".png";
    character.push(await loadImage(fileName1));
    let fileName2 = "ball/frame_"+i+".png";
    ball.push(await loadImage(fileName2));
    let fileName3 = "lights/spotlight_"+i+".png";
    lights.push(await loadImage(fileName3));
  }

  for (let i=0; i < 5; i++){
    let audioName = "audios/audio_"+i+".mp3";
    audios.push(await loadSound(audioName));
  }
}

function draw() {
  background(bg);

  let speed = 10
  let slowFrame = floor(frameCount / speed)
  index = slowFrame % numFrames

  if (!isPaused) {
    dancerFrames++;
  }

  let dancerIndex = floor (dancerFrames / dancerSpeed)  % numFrames;
  image(character[dancerIndex], 215, 80, 270, 330)

  image(lights[index], 5 , 0)
  image(lights[index], 0, 0)

  image(ball[index], 530, -5, 140, 175) // right ball
  image(ball[(slowFrame+2)%numFrames], 35, -5, 140, 175) // left ball

}

function mousePressed() {
  if (isPaused) return false;

  userStartAudio();
  if (currentAudioIndex >= 0){
    audios[currentAudioIndex].stop();
  }
  currentAudioIndex = (currentAudioIndex + 1) % audios.length;
  audios[currentAudioIndex].play();
  audios[currentAudioIndex].loop();
}

function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused;
    if (isPaused) {
      getAudioContext().suspend();
    } else {
      getAudioContext().resume();
    }
    return false;
  }

  if (key === 's') {
    dancerSpeed = random (0,20);
  }
}
