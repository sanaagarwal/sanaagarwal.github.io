let stars = [];
let numStars = 400;

function setup() {
  const canvas = createCanvas(700, 400);
  canvas.parent("sketch-holder");

  for (let i = 0; i < numStars; i++) {
    let X = random(0, width);
    let Y = random(0, height)
    let C = color(192, 192, 192)
    let L = 2;

    let star = new Star(X, Y, C, L);
    stars.push(star);
  }
}

function draw() {
  background(20);

  for (let star of stars) {
    star.changeSize(2)
    star.teleport(0.02)
    star.twinkle();
    if (mouseIsPressed) {
      star.flyToMoon(mouseX, mouseY);
    }
    star.show();
  }

  noStroke();
  fill(255, 255, 230, 10);
  circle(mouseX, mouseY, 120);
  fill(255, 255, 240);
  circle(mouseX, mouseY, 80);
}

class Star {
  constructor(x, y, c, l) {
    this.x = x;
    this.y = y;
    this.baseColor = c;
    this.color = c;
    this.l = l;
  }

  changeSize(byHowMuch) {
    if (this.l > 0) {
      this.l = constrain(this.l + random(-byHowMuch, byHowMuch), 2, 18);
    }
  }

  teleport(chance) {
    if (random(0, 1) < chance) {
      this.x = random(0, width);
      this.y = random(0, height);
    }
  }

  twinkle() {
    let flash = sin(frameCount * 0.03 + this.x);
    let amount = map(flash, -1, 1, 0, 1);
    this.color = lerpColor(this.baseColor, color(255, 255, 255), amount);
  }

  flyToMoon(mx, my) {
    this.x = lerp(this.x, mx, 0.04);
    this.y = lerp(this.y, my, 0.04);
    this.color = color(255, 255, 255, 80);

  }

  show() {
    fill(this.color);
    noStroke();

    let length = this.l / 2;
    let thickness = length * 0.2;

    beginShape();
    vertex(this.x, this.y - length);
    vertex(this.x + thickness, this.y);
    vertex(this.x, this.y + length);
    vertex(this.x - thickness, this.y);
    endShape(CLOSE);

    beginShape();
    vertex(this.x - length, this.y);
    vertex(this.x, this.y - thickness);
    vertex(this.x + length, this.y);
    vertex(this.x, this.y + thickness);
    endShape(CLOSE);
  }
}