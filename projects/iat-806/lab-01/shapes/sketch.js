function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(20);
    //text("X: " + mouseX + ", Y: " + mouseY, mouseX, mouseY);
    fill("orange");

    circle(200, 100, 50);
    rect(160, 129, 80, 130)
    rect(172, 263, 10, 50);
    rect(218, 263, 10, 50);
    rect(245, 160, 50, 10);
    rect(106, 160, 50, 10);

    fill("red");
    triangle(232, 45, 190, 65, 240, 90)
}
