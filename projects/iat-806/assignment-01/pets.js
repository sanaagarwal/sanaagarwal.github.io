function drawBear(x, y, animalColor) {
    push();
    translate(x, y);

    // body
    fill(animalColor);
    noStroke(); // Makes the shapes look softer and less harsh
    arc(0, 85, 190, 160, PI, TWO_PI);

    // left ear
    fill(animalColor);
    circle(-50, -45, 45);
    fill("#ffccd5");
    circle(-50, -45, 25);

    // right ear
    fill(animalColor);
    circle(50, -45, 45);
    fill("#ffccd5");
    circle(50, -45, 25);

    // head
    fill(animalColor);
    circle(0, 0, 120);

    // cheeks
    fill("rgba(255, 182, 193, 0.6)");
    circle(-40, 15, 20);
    circle(40, 15, 20);

    // left eye
    fill("white");
    circle(-22, -5, 22);
    fill("black");
    circle(-22, -5, 12);
    fill("white");
    circle(-25, -8, 5);

    // right eye
    fill("white");
    circle(22, -5, 22);
    fill("black");
    circle(22, -5, 12);
    fill("white");
    circle(19, -8, 5);

    // mouth
    fill("#f5ebe0");
    circle(0, 20, 35);

    // nose
    fill("black");
    circle(0, 12, 10);

    // smile
    noFill();
    stroke("black");
    strokeWeight(2);
    arc(0, 16, 14, 10, 0, PI);

    pop();
}


function drawBunny(x, y, animalColor) {
    push();
    translate(x, y);
    noStroke();

    // body
    fill(animalColor);
    arc(0, 85, 190, 160, PI, TWO_PI);

    // left ear
    fill(animalColor);
    rect(-42, -140, 32, 100, 20);
    fill("#ffccd5");
    rect(-35, -132, 18, 80, 15);

    // right ear
    fill(animalColor);
    rect(10, -140, 32, 100, 20);
    fill("#ffccd5");
    rect(17, -132, 18, 80, 15);

    // head
    fill(animalColor);
    circle(0, 0, 120);

    // cheeks
    fill("rgba(255, 182, 193, 0.6)");
    circle(-40, 15, 20);
    circle(40, 15, 20);

    // Left Eye
    fill("white");
    circle(-22, -5, 22);
    fill("black");
    circle(-22, -5, 12);
    fill("white");
    circle(-25, -8, 5);

    // Right Eye
    fill("white");
    circle(22, -5, 22);
    fill("black");
    circle(22, -5, 12);
    fill("white");
    circle(19, -8, 5);

    // mouth
    fill("#f5ebe0");
    circle(0, 20, 35);

    // teeth
    fill("white");
    rect(-10, 22, 9, 12, 0, 0, 3, 3);
    rect(1, 22, 9, 12, 0, 0, 3, 3);

    // nose
    fill("#ffccd5");
    triangle(-7, 13, 7, 13, 0, 21);

    pop();
}

function drawCat(x, y, animalColor) {
    push();
    translate(x, y);
    noStroke();

    // body
    fill(animalColor);
    arc(0, 85, 190, 160, PI, TWO_PI);

    // left ear
    fill(animalColor);
    triangle(-55, -25, -20, -55, -50, -85);
    fill("#ffccd5");
    triangle(-51, -30, -23, -53, -47, -76);

    // right ear
    fill(animalColor);
    triangle(55, -25, 20, -55, 50, -85);
    fill("#ffccd5");
    triangle(51, -30, 23, -53, 47, -76);

    // head
    fill(animalColor);
    circle(0, 0, 120);

    // cheeks
    fill("rgba(255, 182, 193, 0.6)");
    circle(-40, 15, 20);
    circle(40, 15, 20);

    // left eye
    fill("white");
    circle(-22, -5, 22);
    fill("black");
    circle(-22, -5, 12);
    fill("white");
    circle(-25, -8, 5);

    // right Eye
    fill("white");
    circle(22, -5, 22);
    fill("black");
    circle(22, -5, 12);
    fill("white");
    circle(19, -8, 5);

    // whiskers
    stroke("#4a4a4a");
    strokeWeight(2.5);
    strokeCap(ROUND);

    // left
    line(-35, 15, -65, 12);
    line(-35, 22, -65, 25);

    // right
    line(35, 15, 65, 12);
    line(35, 22, 65, 25);

    noStroke();

    // snout
    fill("#f5ebe0");
    circle(-8, 20, 22);
    circle(8, 20, 22);

    // nose
    fill("#ffccd5");
    triangle(-6, 13, 6, 13, 0, 19);

    // mouth
    noFill();
    stroke("#4a4a4a");
    strokeWeight(2);

    arc(-6, 20, 12, 10, 0, PI);
    arc(6, 20, 12, 10, 0, PI);

    pop();
}