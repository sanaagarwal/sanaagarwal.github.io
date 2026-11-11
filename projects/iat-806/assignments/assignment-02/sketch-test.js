let video;
let faceMesh;
let faces = [];

let blade; let knife;
let fruits = [];
let particles = [];

let score = 0;
let lives = 10;
let gameState = "start";
let gameFrames = 0;
let gameOverReason = "";

let sliceSound = new Audio("slice.mp3");
let explosionSound = new Audio("explosion.mp3");
sliceSound.volume = 0.2;
explosionSound.volume = 0.2;

let explosionTimer = 0;
let explosionX = 0;
let explosionY = 0;
let explosionParticles = [];

async function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent("sketch-holder")

    knife = await loadImage("knife.png");

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

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
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

    if (gameState === "exploding") {

        // Show remaining fruits without moving them
        for (let fruit of fruits) {
            fruit.display();
        }

        displayScore();
        displayExplosion();

        if (explosionTimer <= 0) {
            gameState = "gameover";
        }

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

    // create fruits
    let difficulty = min(5, floor(score / 100));

    if (gameFrames % 72 === 0) {

        let count = 1;

        if (random() < 0.20) {
            count = floor(random(2, 5));
        }

        let centerX = random(150, width - 150);
        for (let i = 0; i < count; i++) {
            let x = centerX + (i - (count - 1) / 2) * 90;
            let allowBombs = gameFrames >= 180 && count === 1;

            fruits.push(new Fruit(allowBombs, x, difficulty));
        }
    }

    // update fruits and bombs positions


    for (let i = fruits.length - 1; i >= 0; i--) {
        let fruit = fruits[i];

        fruit.update();
        fruit.display();

        // if fruits/bombs are hit
        if (fruit.checkCollision(blade)) {

            if (fruit.type === "bomb") {

                gameState = "exploding";
                gameOverReason = "YOU HIT A BOMB!";

                explosionX = fruit.x;
                explosionY = fruit.y;
                explosionTimer = 45;

                // Create fiery explosion particles
                explosionParticles = [];

                for (let j = 0; j < 35; j++) {

                    let angle = random(TWO_PI);
                    let speed = random(4, 12);

                    explosionParticles.push({
                        x: explosionX,
                        y: explosionY,
                        speedX: cos(angle) * speed,
                        speedY: sin(angle) * speed,
                        size: random(6, 16),
                        life: 255,
                        color: random([
                            [255, 70, 0],
                            [255, 150, 0],
                            [255, 230, 40],
                            [255, 255, 180]
                        ])
                    });
                }

                playSound(explosionSound);

            } else {
                score += 10;
                playSound(sliceSound);
                for (let j = 0; j < 12; j++) {
                    particles.push(
                        new Particle(
                            fruits[i].x,
                            fruits[i].y,
                            fruits[i].particleColor
                        )
                    );
                }
            }

            fruits.splice(i, 1);

        // if fruits are missed
        } else if (fruit.y > height + fruit.radius && fruit.type === "fruit") {
            lives--;
            fruits.splice(i, 1);
        }

        if (lives <= 0) {
            lives = 0;
            gameState = "gameover";
            gameOverReason = "OUT OF LIVES!";
        }

        if (gameState === "gameover" || gameState === "exploding") {
            break;
        }
    }

    displayScore();

    if (gameState === "gameover") {
        displayGameOver();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}


function displayExplosion() {
    if (explosionTimer <= 0) return;

    push();

    let progress = 1 - explosionTimer / 45;
    let fade = 255 * (1 - progress);

    // Bright screen flash at the beginning
    noStroke();
    fill(255, 100, 20, max(0, 160 - progress * 600));
    rect(0, 0, width, height);

    // Large expanding orange ring
    noFill();
    stroke(255, 80, 0, fade);
    strokeWeight(12 * (1 - progress));
    circle(explosionX, explosionY, 50 + progress * 400);

    // Smaller yellow ring
    stroke(255, 220, 50, fade);
    strokeWeight(6 * (1 - progress));
    circle(explosionX, explosionY, 30 + progress * 280);

    // Bright explosion centre
    noStroke();
    fill(255, 240, 100, fade);
    circle(explosionX, explosionY, 100 * (1 - progress));

    pop();

    // Draw fiery particles
    displayExplosionParticles();

    explosionTimer--;
}

function displayExplosionParticles() {

    for (let p of explosionParticles) {

        // Move particles outward
        p.x += p.speedX;
        p.y += p.speedY;

        // Gradually slow down
        p.speedX *= 0.96;
        p.speedY *= 0.96;

        // Fade away
        p.life -= 6;

        push();
        noStroke();

        fill(
            p.color[0],
            p.color[1],
            p.color[2],
            max(0, p.life)
        );

        circle(
            p.x,
            p.y,
            p.size * max(0, p.life / 255)
        );

        pop();
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
        particles = [];
        gameFrames = 0;
        gameOverReason = "";
        gameState = "playing";
        explosionTimer = 0;
        explosionParticles = [];
    }
}
