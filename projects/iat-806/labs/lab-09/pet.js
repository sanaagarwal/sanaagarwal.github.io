let pet = createPet();

function createPet() {
    return {
        color: "#a8cf91",
        mood: "neutral",
        health: 50,
        eyes: 2,
        size: 1
    };
}

function setup() {
    const canvas = createCanvas(420, 300);
    canvas.parent("canvas");
}

function draw() {
    background(248, 239, 227);

    noStroke();
    fill(90, 65, 50, 35);
    ellipse(width / 2, 252, 160, 18);

    let bounce = sin(frameCount * 0.06) * 3;
    let shake = 0;

    if (pet.mood === "happy" || pet.mood === "excited") {
        bounce = -abs(sin(frameCount * 0.12)) * 24;
    } else if (pet.mood === "angry" || pet.mood === "disgusted") {
        shake = sin(frameCount * 0.7) * 5;
    }

    push();
    translate(width / 2 + shake, 155 + bounce);
    scale(pet.size);
    drawPet();
    pop();
}

function drawPet() {
    noStroke();
    fill(pet.color);

    ellipse(79, 38, 54, 25);
    triangle(-72, -35, -65, -115, -8, -65);
    triangle(72, -35, 65, -115, 8, -65);

    fill(235, 165, 180);
    triangle(-57, -55, -57, -91, -29, -60);
    triangle(57, -55, 57, -91, 29, -60);

    fill(pet.color);
    ellipse(-45, 66, 47, 34);
    ellipse(45, 66, 47, 34);
    ellipse(0, 0, 176, 150 + sin(frameCount * 0.06) * 3);

    for (let i = 0; i < pet.eyes; i++) {
        const x = (i - (pet.eyes - 1) / 2) * 32;
        drawEye(x, -15);
    }

    noStroke();
    fill(235, 145, 155, 180);
    ellipse(-60, 15, 22, 12);
    ellipse(60, 15, 22, 12);

    drawMouth();
}

function drawEye(x, y) {
    stroke(55, 45, 55);
    strokeWeight(3);

    if (pet.mood === "sleepy") {
        noFill();
        arc(x, y, 22, 13, 0, PI);
        return;
    }

    noStroke();
    fill(255);
    ellipse(x, y, 25, 35);
    fill(55, 45, 55);
    ellipse(x, y + 2, 12, 20);
    fill(255);
    circle(x + 2, y - 3, 5);

    if (pet.mood === "angry") {
        stroke(55, 45, 55);
        strokeWeight(4);
        line(x - 10, y - 23, x + 10, y - 15);
    }
}

function drawMouth() {
    stroke(55, 45, 55);
    strokeWeight(4);
    noFill();

    if (pet.mood === "happy" || pet.mood === "excited") {
        fill(55, 45, 55);
        arc(0, 25, 34, 30, 0, PI, CHORD);
        noStroke();
        fill(235, 145, 155);
        ellipse(0, 34, 14, 7);
    } else if (["sad", "angry", "disgusted"].includes(pet.mood)) {
        arc(0, 38, 28, 18, PI, TWO_PI);
    } else {
        fill(55, 45, 55);
        ellipse(0, 27, 12, 9);
    }
}
