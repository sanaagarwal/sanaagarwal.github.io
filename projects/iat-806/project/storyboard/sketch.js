
let board
// setup only runs once
async function setup() {
  let canvas = createCanvas(700, 400);
  canvas.parent('sketch-holder');

  board = await loadImage("board.png")

}

// draw runs forever (on loop)
function draw() {
  background(board);

}


