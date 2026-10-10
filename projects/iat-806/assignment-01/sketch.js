let gameStage = "home";
let hatIndex = 0;
let currentColorIndex = 0;
let listOfColor = [
        "#dfb479",
    "#9c6644",
    "#5c3d2e",
    "#e6ccb2",
];
let petColor = listOfColor[0];
let xCord = 350;
let yCord = 260;
let coordsHistory = [{ x: xCord, y: yCord }];
let fetchCount = 0;
let droppedDiscs = [];
let showSurprise = false;
let confettiParticles = [];

let parkAudio = new Audio('audio/park.mp3');
let partyAudio1 = new Audio('audio/party1.mp3');
let partyAudio2 = new Audio('audio/party2.mp3');

function setup() {
    let canvas = createCanvas(700, 400);
    canvas.parent('sketch-holder');

    parkAudio.loop = true;
    partyAudio1.loop = true;
}

function draw() {
    // home stage
    if (gameStage === "home") {
        drawHomeStage();
    }

    // park stage
    else if (gameStage === "park") {
        drawParkStage(fetchCount);

        // trail
        coordsHistory.push({ x: xCord, y: yCord });
        for (let i = 0; i < coordsHistory.length; i++) {
            let alphaValue = map(i, 0, coordsHistory.length, 25, 180);
            let c = color(petColor); c.setAlpha(alphaValue); fill(c); noStroke();
            let trailSize = map(i, 0, coordsHistory.length, 0, 60);
            circle(coordsHistory[i].x, coordsHistory[i].y, trailSize);
        }
        if (coordsHistory.length >= 40) { coordsHistory.shift(); }

        // draw discs where clicked
        for (let i = 0; i < droppedDiscs.length; i++) {
            fill("#ea4b4b"), stroke("#4e2828"), strokeWeight(2);
            ellipse(droppedDiscs[i].x, droppedDiscs[i].y, 40, 20);
        }

        // puppy fetching the discs, stop moving after 5
        if (droppedDiscs.length > 0 && fetchCount < 5) {
            let targetX = droppedDiscs[0].x;
            let targetY = droppedDiscs[0].y;

            xCord = lerp(xCord, targetX, 0.04);
            yCord = lerp(yCord, targetY, 0.04);

            let distanceToDisc = dist(xCord, yCord, targetX, targetY);

            if (distanceToDisc < 20) {
                droppedDiscs.shift();
                fetchCount++;
            }
        }
    }

    // party stage
    else if (gameStage === "party") {
        drawPartyStage();

        if (showSurprise) {
            fill("white"); textAlign(CENTER); textSize(24);
            text("🎉 SURPRISE PUPPY PARTY! 🎉", width / 2, 80);
            textSize(14); text("Keep tapping [ ENTER ] for more confetti!  •  [ SPACE ] to reset", width / 2, 120);

            let guestLeftHop  = 260 + sin(frameCount * 0.14) * 6;
            let guestRightHop = 260 + sin(frameCount * 0.08) * 6;

            drawPuppy(130, guestLeftHop, "#7f5539", 0.75, hatIndex) ;
            drawPuppy(570, guestRightHop, "#2f1f17", 0.75, hatIndex);

            // draw confetti
            for (let i = 0; i < confettiParticles.length; i++) {
                fill(confettiParticles[i].color);
                circle(confettiParticles[i].x, confettiParticles[i].y, confettiParticles[i].size);

                // move it down and sway
                confettiParticles[i].y += confettiParticles[i].speedY;
                confettiParticles[i].x += sin(frameCount * 0.04 + i) * 0.7;
            }

        } else {
            fill("white"); textAlign(CENTER); textSize(20);
            text("🚪 Sshhh!... The room is dark.", width / 2, 80);
            textSize(15); fill("#ddb892");
            text("Press [ ENTER ] for a SURPRISE!", width / 2, 120);
        }

        // co-ords to move back to the starting point
        xCord = lerp(xCord, width / 2, 0.04);
        yCord = lerp(yCord, 260, 0.04);
    }

    // draw puppy
    let bobbingY = yCord + sin(frameCount * 0.08) * 5;
    drawPuppy(xCord, bobbingY, petColor, 1.0, hatIndex);

    if (fetchCount === 5 && frameCount % 60 < 30) {
        noStroke()
        fill("#ea4b4b");
        textSize(20);
        text("💤 Puppy's tired, let's press [ SPACE ] to go home!", 30, 75);
    }
}

function mousePressed() {
    if (gameStage === "park") {
        let restrictedX = constrain(mouseX, 30, width - 30);
        let restrictedY = constrain(mouseY, 30, height - 30);
        droppedDiscs.push({ x: restrictedX, y: restrictedY });
    }
}

function keyPressed() {
    if (gameStage === "home") {
        if (key === 'c') {
            currentColorIndex = (currentColorIndex + 1) % listOfColor.length;
            petColor = listOfColor[currentColorIndex];
        }
        if (key === 'h') {
            hatIndex = (hatIndex + 1) % 5;
        }
    }

    if (key === ' ') {
        if (gameStage === "home") {
            gameStage = "park";
            parkAudio.play().catch(e => console.log("Waiting for user interaction to sound..."));
        } else if (gameStage === "park") {
            gameStage = "party";
            stopAudio(parkAudio)
            fetchCount = 0;
            droppedDiscs = [];
        } else if (gameStage === "party") {
            gameStage = "home";
            showSurprise = false;
            confettiParticles = [];
            stopAudio(partyAudio1);
            stopAudio(partyAudio2);
        }
        return false;
    }

    if (keyCode === 13 && gameStage === "party") {
        partyAudio2.currentTime = 0;

        partyAudio1.play().catch(e => console.log("Audio activation requires focus"));
        partyAudio2.play().catch(e => console.log("Audio activation requires focus"));

        showSurprise = true;

        // create confetti particles in the list
        for (let i = 0; i < 100; i++) {
            confettiParticles.push({
                x: random(0, width),
                y: random(-400, -10),
                speedY: random(2, 5),
                size: random(6, 25),
                color: color(random(140, 255), random(140, 255), random(140, 255))
            });
        }
    }
}

function stopAudio(audio){
    audio.pause();
    audio.currentTime = 0;
}

