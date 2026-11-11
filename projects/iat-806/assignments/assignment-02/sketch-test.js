let video;
let faceMesh;
let faces = [];

let blade;
let fruits = [];

let score = 0;
let lives = 10;
let gameState = "start";
let gameFrames = 0;
let gameOverReason = "";

async function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent("sketch-holder")

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    faceMesh = await ml5.faceMesh({
        maxFaces: 1,
        refineLandmarks: false,
        flipHorizontal: false
    });

    faceMesh.detectStart(video, gotFaces);

    blade = new Blade();
}

function gotFaces(results) {
    faces = results;
}

function draw() {
    // mirror webcam
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // darken webcam
    fill(0, 100);
    rect(0, 0, width, height);

    // update blade position and tracking
    blade.update(faces);

    if (blade.active) {
        blade.display();
    }

    // start screen
    if (gameState === "start") {
        displayStartScreen();
        return;
    }

    // game over screen
    if (gameState === "gameover") {
        displayGameOver();
        return;
    }

    // pause screen
    if (gameState === "paused" || !blade.active) {

        for (let fruit of fruits) {
            fruit.display();
        }

        displayScore();

        if (gameState === "paused") {
            displayPauseMessage("Press P or Space to resume");
        } else {
            displayPauseMessage("Position your face in front of the camera to continue");
        }

        return;
    }


    gameFrames++;

    // create fruits every 1.2 seconds
    if (gameFrames % 72 === 0) {
        fruits.push(new Fruit());
    }

    // update fruits and bombs positions
    for (let i = fruits.length - 1; i >= 0; i--) {
        let fruit = fruits[i];

        fruit.update();
        fruit.display();

        // if fruits/bombs are hit
        if (fruit.checkCollision(blade)) {

            if (fruit.type === "bomb") {
                gameState = "gameover";
                gameOverReason = "YOU HIT A BOMB!";
            } else {
                score += 10;
            }

            fruits.splice(i, 1);

        // if fruits are missed
        } else if (fruit.y > height + fruit.radius && fruit.type === "fruit") {
            lives--;
            fruits.splice(i, 1);
        }

        if (lives <= 0 || gameState === "gameover") {
            lives = 0;
            gameState = "gameover";
            gameOverReason = "OUT OF LIVES!";
        }

        if (gameState === "gameover") {
            break;
        }
    }

    displayScore();

    if (gameState === "gameover") {
        displayGameOver();
    }
}


function displayStartScreen() {
    push();

    fill(0, 150);
    noStroke();
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);

    fill(255, 210, 70);
    textSize(48);
    textStyle(BOLD);
    text("BLADE-HEAD NINJA", width / 2, 170);

    fill(255);
    textSize(22);
    textStyle(NORMAL);

    text("Move your head to slice falling fruits!", width / 2, 260);
    text("Miss a fruit = Lose 1 life", width / 2, 305);
    text("Hit a bomb = Instant Death", width / 2, 340);

    textSize(28);
    fill(130, 255, 170);
    text("Press SPACE to Start", width / 2, 440);

    textSize(16);
    fill(220);
    text("Press P or space during the game to pause", width / 2, 490);

    pop();
}

function displayScore() {
    push();

    fill(255);
    noStroke();
    textAlign(LEFT, TOP);

    textSize(32);
    textStyle(BOLD);
    text("SCORE: " + score, 25, 20);

    textSize(24);
    text("LIVES: " + lives, 25, 65);

    textStyle(NORMAL);
    textSize(17);
    text("Slice fruits. Avoid bombs!", 25, 105);

    pop();
}

function displayPauseMessage(message) {
    push();

    fill(0, 130);
    noStroke();
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);

    fill(255, 220, 80);
    textSize(42);
    textStyle(BOLD);
    text("PAUSED", width / 2, height / 2 - 40);

    fill(255);
    textSize(22);
    textStyle(NORMAL);
    text(message, width / 2, height / 2 + 20);

    pop();
}

function displayGameOver() {
    push();

    fill(0, 190);
    noStroke();
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);

    fill(255, 90, 90);
    textSize(50);
    textStyle(BOLD);
    text("GAME OVER", width / 2, height / 2 - 85);

    fill(255);
    textSize(26);
    text(gameOverReason, width / 2, height / 2 - 25);

    textSize(24);
    text("Final Score: " + score, width / 2, height / 2 + 25);

    textSize(20);
    text("Press R to Restart", width / 2, height / 2 + 85);

    pop();
}


function keyPressed() {

    // start game
    if (key === " " && gameState === "start") {
        gameState = "playing";
        return false;
    }

    // pause game
    if (key === "p" || key === "P" || key === " ") {

        if (gameState === "playing") {
            gameState = "paused";
        }
        else if (gameState === "paused") {
            gameState = "playing";
        }
        return  false;
    }

    // restart
    if (
        (key === "r" || key === "R") &&
        gameState === "gameover"
    ) {
        score = 0;
        lives = 10;
        fruits = [];
        gameFrames = 0;
        gameOverReason = "";
        gameState = "playing";
    }
}
