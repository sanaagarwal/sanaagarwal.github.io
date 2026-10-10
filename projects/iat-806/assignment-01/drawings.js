function drawPuppy(x, y, animalColor, sizeScale, hatIndex) {
    push(); translate(x, y); scale(sizeScale); noStroke();

    // body
    fill(animalColor); arc(0, 85, 190, 160, PI, TWO_PI);

    // ears
    fill("#4a3321");
    push(); translate(-46, -5); rotate(0.25);  ellipse(0, 0, 55, 75); pop();
    push(); translate(46, -5);  rotate(-0.25); ellipse(0, 0, 55, 75); pop();

    // hat
    drawHat(hatIndex)

    // head
    fill(animalColor); circle(0, 0, 120);

    // cheeks
    fill("rgba(255, 182, 193, 0.4)"); circle(-42, 20, 18); circle(42, 20, 18);

    // eyes
    fill("white"); circle(-22, 0, 20); fill("#231f20"); circle(-20, 0, 12); fill("white"); circle(-22, -3, 5);
    fill("white"); circle(22, 0, 20); fill("#231f20"); circle(20, 0, 12); fill("white"); circle(18, -3, 5);

    // mouth
    fill("#fcf6bd"); ellipse(0, 25, 45, 35);
    fill("#ff7096"); arc(0, 28, 16, 18, 0, PI);
    fill("#1e1b18"); ellipse(0, 16, 18, 12);

    pop();
}

function drawHat(hatIndex) {
    push();
    translate(0, -55);
    noStroke();

    // colors
    let hatBaseColors = ["#ff477e", "#00f5d4", "#fee440", "#70e000", "#9b5de5"];
    let hatAccentColors = ["#ffffff", "#fee440", "#ff477e", "#ffffff", "#00f5d4"];

    let baseColor = hatBaseColors[hatIndex % hatBaseColors.length];
    let accentColor = hatAccentColors[hatIndex % hatAccentColors.length];

    // main hat
    fill(baseColor);
    triangle(-35, 10, 35, 10, 0, -55);
    fill(accentColor);
    circle(0, -52, 12);

    // designs
    fill(accentColor);
    if (hatIndex === 0) {
        rect(-10, -24, 20, 6, 1);
    } else if (hatIndex === 1) {
        quad(-8, -18, 2, -22, 12, -10, 0, -6);
    } else if (hatIndex === 2) {
        circle(-6, -14, 6); circle(6, -24, 5); circle(0, -8, 6);
    } else if (hatIndex === 3) {
        rect(-3, -35, 6, 35, 1);
    } else if (hatIndex === 4) {
        triangle(-8, -12, 8, -12, 0, -25);
    }

    pop();
}

function drawHomeStage() {
    background("#f4ebd9");
    noStroke();

    drawDecor()

    fill("#855830"); rect(0, 300, width, 100);

    // instructions
    fill("#4a3b32");
    textAlign(CENTER);
    textSize(23);
    text("Pick Your Pet's Outing Outfit!", width / 2, 70);
    textSize(16);
    text("Press [ h ] to change hat  •  Press [ c ] to change color", width / 2, 100);
    textSize(17);
    text("➔ Press [ spacebar ] to go to the park! ➔", width / 2, 135);
}

function drawParkStage(fetchCount) {
    background("#a2d2ff");
    noStroke();

    // sun
    fill("#fff3b0"); circle(660, 0, 180);

    // clouds
    fill("#fefae0");
    circle(220, 95, 50); circle(250, 100, 40); circle(195, 105, 35);
    circle(520, 100, 60); circle(560, 105, 45); circle(490, 110, 50);

    // hills
    fill("#ccd5ae"); circle(120, 480, 580);
    fill("#e2ece9"); circle(420, 520, 550);
    fill("#e9f5db"); circle(650, 490, 590);

    // ground
    fill("#588157"); rect(0, 300, width, 100);
    fill("#3a5a40"); rect(0, 340, width, 60);

    // instructions
    fill("#6a6a6a"); textAlign(LEFT); textSize(16);
    text("🥏 Discs Caught: " + fetchCount , 30, 30);
    textSize(14); fill("#6a6a6a");
    text("👉 Click inside the frame to throw a toy disc!", 30, 50);
}

function drawPartyStage() {
    background("#3a1f43");
    noStroke();

    fill("#5c3826");
    rect(0, 300, width, 100);

    drawDecor()
}

function drawDecor (){
    fill("#ff4d6d"); triangle(40, 0, 90, 0, 65, 40);
    fill("#ffb703"); triangle(90, 0, 140, 0, 115, 40);
    fill("#06d6a0"); triangle(140, 0, 190, 0, 165, 40);
    fill("#118ab2"); triangle(190, 0, 240, 0, 215, 40);
}
