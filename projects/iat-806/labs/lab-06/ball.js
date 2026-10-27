class Ball {
  constructor(x, y, c, d, maxD = 30) {
    this.x = x;
    this.y = y;
    this.baseColor = c;
    this.color = c;
    this.d = d;
    this.maxD = maxD;
    this.highlightC = "red"
    this.isClicked = false;
  }

  update(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);
    this.show();
  }

  contains(pointX, pointY) {
    let dis = dist(this.x, this.y, pointX, pointY);
    return dis < this.d
  }

  changeSize(byHowMuch) {
    this.d = constrain(this.d + random(-byHowMuch, byHowMuch), 15, this.maxD);
  }

  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  highlight() {
    this.color = this.highlightC
  }

  deHighlight() {
    this.color = this.baseColor
  }

  respond(active) {
    if (active) {
      this.highlight();
    } else {
      this.deHighlight();
    }
  }

  isOnBody(mask){
    // mask.get returns [ r g b a ]
    let pix = mask.get(floor(this.x), floor(this.y));
    return pix[3] < 128
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, this.d)
  }
}

function createRandomBall() {
  let X = random(0, width);
  let Y = random(0, height)
  let C = color("orange")
  let D = 15;

  return new Ball(X, Y, C, D);
}
