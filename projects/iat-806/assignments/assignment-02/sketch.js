// sliceable objects class w common functions?
    // have fruits, bombs, special powers subclasses extending from it?
// can maybe get AI vectors of fruits / bombs / power fruits for animations (including slicing part?)
// have an animation of head protector ? and blade on top of video , while maybe masking the original video?
// points and scores tally variables
    // maybe 2 lives for bombs ? or like in classic game, no  more than 3-5 fruits missed
// game state variable  : not playing / reset mode, playing where objects are falling
// with more points, add how fast the fruits are falling ?

// maybe add features later for modularity:
// special power fruits
// extra complexity of knife also swinging and moving, making it harder to slice?


let video;
let bodyPose;
let poses = [];

let blade;
let fruits = [];
let score = 0;

async function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent("sketch-holder");

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    bodyPose = await ml5.bodyPose("MoveNet");
    bodyPose.detectStart(video, gotPoses);

    blade = new Blade();
}

function draw() {
    background(30);

    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // Dark overlay for readability
    fill(0, 0, 0, 35);
    noStroke();
    rect(0, 0, width, height);

    // Update blade using nose position
    if (poses.length > 0) {
        let pose = poses[0];

        let leftEye = pose.left_eye;
        let rightEye = pose.right_eye;

        if (
            leftEye.confidence > 0.3 &&
            rightEye.confidence > 0.3
        ) {
            let eyeX = (leftEye.x + rightEye.x) / 2;
            let eyeY = (leftEye.y + rightEye.y) / 2;

            blade.update(width - eyeX, eyeY);
            blade.active = true;
        } else {
            blade.active = false;
        }
    } else {
        blade.active = false;
    }

    // display blade
    if (blade.active) {
        blade.display();
    }

    // create and add a fruit every 1.2 seconds
    if (frameCount % 60 === 0) {
        fruits.push(new Fruit());
    }

    // Update fruits backwards
    for (let i = fruits.length - 1; i >= 0; i--) {
        let fruit = fruits[i];

        fruit.update();
        fruit.display();

        if (blade.active && fruit.checkCollision(blade)) {
            score += 10;
            fruits.splice(i, 1);
        } else if (fruit.y > height + fruit.radius) {
            fruits.splice(i, 1);
        }
    }

    // Score display
    fill(255);
    noStroke();
    textSize(28);
    textStyle(BOLD);
    textAlign(LEFT);
    text("SCORE: " + score, 20, 40);

    textSize(15);
    textStyle(NORMAL);
    text("Move your head to slice the fruit!", 20, 65);

    if (!blade.active) {
        textAlign(CENTER);
        fill(255, 220, 100);
        textSize(20);
        text("Position your face in the camera", width / 2, 100);
    }
}


function gotPoses(results) {
    poses = results;
}

class Blade {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.length = 90;
        this.active = false;
    }

    update(eyeX, eyeY) {
        this.x = eyeX;
        this.y = eyeY - 75;
    }

    display() {
        push();

        stroke(255);
        strokeWeight(4);

        fill(180, 230, 255);
        triangle(
            this.x - 10, this.y,
            this.x + 10, this.y,
            this.x, this.y - this.length
        );

        stroke(255, 190, 60);
        strokeWeight(8);
        line(
            this.x - 18, this.y,
            this.x + 18, this.y
        );

        pop();
    }
}

class Fruit {
    constructor() {
        this.radius = random(35, 80);
        this.x = random(50, width - 50);
        this.y = -this.radius;
        this.speed = 3;
        this.emoji = random([
            "🍎", "🍉", "🍊", "🍋", "🍓"
        ]);
    }

    update() {
        this.y += this.speed
    }

    display() {
        push();
        textAlign(CENTER, CENTER);
        textSize(this.radius * 2);
        text(this.emoji, this.x, this.y);
        pop();
    }

    checkCollision(blade) {
        // Blade is a vertical segment
        let bladeTop = blade.y - blade.length;
        let bladeBottom = blade.y;

        // Closest point on blade to fruit
        let closestY = constrain(
            this.y,
            bladeTop,
            bladeBottom
        );

        let distance = dist(
            this.x,
            this.y,
            blade.x,
            closestY
        );

        return distance < this.radius + 5;
    }
}
