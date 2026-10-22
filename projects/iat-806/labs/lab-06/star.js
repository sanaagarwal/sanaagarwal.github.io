class Star {
  constructor(x, y, c, l, maxL = 30) {
    this.x = x;
    this.y = y;
    this.baseColor = c;
    this.color = c;
    this.l = l;
    this.maxL = maxL;
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
    return dis < this.l
  }

  changeSize(byHowMuch) {
    this.l = constrain(this.l + random(-byHowMuch, byHowMuch), 15, this.maxL);
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
    // noStroke();

    circle(this.x, this.y, this.l)
  }
}

function createRandomStar() {
  let X = random(0, width);
  let Y = random(0, height)
  let C = color(192, 192, 192)
  let L = 10;

  return new Star(X, Y, C, L);
}
