let video;
let faceMesh;
let faces = [];
let blade;
let knife;
let explosion;
let fruits = [];
let particles = [];

let score = 0;
let lives = 10;
let gameState = "start";
let gameFrames = 0;
let wavesSinceBomb = 0;
let nextBombWave = 5;
let explosionShake = 0;
let frozenScene = null;
let gameOverReason = "";

let sliceSound = new Audio("assets/slice.mp3");
let explosionSound = new Audio("assets/explosion.mp3");
sliceSound.volume = 0.2;
explosionSound.volume = 0.2;

async function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent("sketch-holder");

    knife = await loadImage("assets/knife.png");

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
    explosion = new Explosion();
}

function gotFaces(results) {
    faces = results;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function draw() {
    // During the explosion, freeze the whole scene behind the effects.
    if ((gameState === "exploding" || gameState === "gameover") && frozenScene) {
        push();
        if (gameState === "exploding" && explosionShake > 0.5) {
            translate(random(-explosionShake, explosionShake),
                      random(-explosionShake, explosionShake));
            explosionShake *= 0.82;
        }
        image(frozenScene, -20, -20, width + 40, height + 40);
        pop();
    } else {
        // Mirror the live webcam so movement feels natural.
        push();
        translate(width, 0);
        scale(-1, 1);
        image(video, 0, 0, width, height);
        pop();
        noStroke();
        fill(0, 80);
        rect(0, 0, width, height);
    }

    blade.update(faces);
    if (blade.active && gameState !== "exploding" && gameState !== "gameover") blade.display();

    if (gameState === "start") {
        displayStartScreen();
        return;
    }

    if (gameState === "exploding") {
        explosion.update();
        explosion.display();
        if (explosion.finished) gameState = "gameover";
        return;
    }

    if (gameState === "gameover") {
        displayGameOver();
        return;
    }

    if (gameState === "paused" || !blade.active) {
        for (let fruit of fruits) fruit.display();
        displayScore();
        if (gameState === "paused") {
            displayPauseMessage("Press P or Space to resume");
        } else {
            displayPauseMessage("Position your face in front of the camera to continue");
        }
        return;
    }

    gameFrames++;
    let difficulty = min(5, floor(score / 100));

    // A bomb arrives every 4–7 waves, rather than relying on a tiny chance.
    if (gameFrames % 72 === 0) {
        wavesSinceBomb++;
        if (wavesSinceBomb >= nextBombWave) {
            let bomb = new Fruit( random(150, width - 150), difficulty);
            bomb.type = "bomb";
            bomb.emoji = "💣";
            fruits.push(bomb);
            wavesSinceBomb = 0;
            nextBombWave = floor(random(4, 8));
        } else {
            let count = random() < 0.20 ? floor(random(2, 5)) : 1;
            let centerX = random(150, width - 150);
            for (let i = 0; i < count; i++) {
                let x = centerX + (i - (count - 1) / 2) * 90;
                fruits.push(new Fruit( x, difficulty));
            }
        }
    }

    // Update fruits and check blade collisions.
    for (let i = fruits.length - 1; i >= 0; i--) {
        let fruit = fruits[i];
        fruit.update();
        fruit.display();

        if (fruit.checkCollision(blade)) {
            if (fruit.type === "bomb") {
                gameState = "exploding";
                gameOverReason = "YOU HIT A BOMB!";
                // Freeze the webcam scene, then shake on impact.
                frozenScene = get();
                explosionShake = 18;
                explosion.start(fruit.x, fruit.y);
                playSound(explosionSound);
            } else {
                score += 10;
                playSound(sliceSound);
                for (let j = 0; j < 12; j++) {
                    particles.push(new Particle(fruit.x, fruit.y, fruit.particleColor));
                }
            }
            fruits.splice(i, 1);
        } else if (fruit.y > height + fruit.radius && fruit.type === "fruit") {
            lives--;
            fruits.splice(i, 1);
        }

        if (lives <= 0 && gameState !== "exploding") {
            lives = 0;
            gameState = "gameover";
            gameOverReason = "OUT OF LIVES!";
        }
        if (gameState === "gameover" || gameState === "exploding") break;
    }

    displayScore();
    if (gameState === "gameover") displayGameOver();

    // Fruit juice particles.
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }
}

function keyPressed() {
    if (key === " " && gameState === "start") {
        gameState = "playing";
        return false;
    }

    if (key === "p" || key === "P" || key === " ") {
        if (gameState === "playing") gameState = "paused";
        else if (gameState === "paused") gameState = "playing";
        return false;
    }

    if ((key === "r" || key === "R") && gameState === "gameover") {
        score = 0;
        lives = 10;
        fruits = [];
        particles = [];
        gameFrames = 0;
        wavesSinceBomb = 0;
        nextBombWave = 5;
        explosionShake = 0;
        frozenScene = null;
        gameOverReason = "";
        explosion.reset();
        gameState = "playing";
    }
}
