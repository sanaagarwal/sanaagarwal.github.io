class Ball {
  constructor(x, y, fillColor, d) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.origColor = fillColor;
    this.fillColor = fillColor;
    this.highlightColor = color(100, 100, 100, 50);
  }

  update(byHowMuch) {
    this.move(byHowMuch);
    this.show();
  }

  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  changeSize(byHowMuch) {
    this.d = constrain(this.d + random(-byHowMuch, byHowMuch), 2, 30);
  }

  contains(px, py) {
    return dist(this.x, this.y, px, py) < this.d;
  }

  respond(active) {
    if (active) this.highlight();
    else this.deHighlight();
  }

  highlight() {
    this.fillColor = this.highlightColor;
  }

  deHighlight() {
    this.fillColor = this.origColor;
  }

  isOnBody(mask) {
    let px = mask.get(floor(this.x), floor(this.y)); // [r, g, b, a]
    return px[3] < 128; // opaque = body
  }

  show() {
    fill(this.fillColor);
    noStroke();
    circle(this.x, this.y, this.d * 2);
  }
}

class BubblyBall extends Ball {

  respond(active){
    super.respond(active);
    super.changeSize(10);
  }
}

class AngryBall extends Ball {

  constructor(x, y, fillColor, d, emojiText) {
    super(x, y, fillColor, d);
    this.emojiText = emojiText
    this.sizeMultiplier = 5;
  }

  respond(active) {
    if (active){
      this.sizeMultiplier = 5
    } else this.sizeMultiplier = 0
  }

  show(){
    textSize(this.d * this.sizeMultiplier);
    noStroke();
    text(this.emojiText, this.x, this.y);
  }
}