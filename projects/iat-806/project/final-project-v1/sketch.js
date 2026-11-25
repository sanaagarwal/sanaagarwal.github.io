let puppets;
let mode = 'practice';
let showCamera = false;
let swapHands = false;
let selected = 0;
let demoCurl = [0, 0, 0, 0, 0];
function setup() {
    const canvas = createCanvas(1000, 650);
    canvas.parent('canvas');
    puppets = [new Puppet('OLIVER', 330, false), new Puppet('CLARA', 670, true)];
    initTracking();
    document.getElementById('practice').onclick = () => setMode('practice');
    document.getElementById('stage').onclick = () => setMode('stage');
    document.getElementById('camera').onclick = () => cameraOn ? stopCamera() : startCamera();
    document.getElementById('preview').onclick = () => {
        showCamera = !showCamera;
        document.getElementById('preview').textContent = showCamera ? 'Hide webcam' : 'Show webcam';
    };
    setMode('practice');
}
function setMode(next) {
    mode = next;
    document.getElementById('practice').classList.toggle('active', next === 'practice');
    document.getElementById('stage').classList.toggle('active', next === 'stage');
}

function drawStage() {
    background('#21151c');
    noStroke();

    // Layered backdrop and warm spotlights.
    for (let i = 0; i < 10; i++) {
        fill(50 + i * 3, 29 + i * 2, 33 + i * 2);
        rect(70 + i * 10, 20 + i * 5, 860 - i * 20, 540 - i * 5, 8);
    }
    fill(255, 220, 150, 13);
    triangle(310, 0, 110, 540, 510, 540);
    triangle(690, 0, 490, 540, 890, 540);

    // Wooden floorboards.
    fill('#694534');
    rect(55, 505, 890, 55);
    stroke('#94694a');
    strokeWeight(1);
    for (let i = 0; i < 12; i++) {
        line(55 + i * 81, 560, 500 + (i - 6) * 48, 505);
    }

    // Alternating curtain folds.
    noStroke();
    for (let i = 0; i < 7; i++) {
        fill(i % 2 ? '#651f32' : '#8b3044');
        quad(i * 13, 0, i * 13 + 19, 0, 100 - i * 9, 520, 70 - i * 10, 520);
        quad(1000 - i * 13, 0, 981 - i * 13, 0, 900 + i * 9, 520, 930 + i * 10, 520);
    }
    fill('#8b3044');
    rect(0, 0, width, 26);
    fill('#d3a25f');
    rect(0, 25, width, 4);
}

function draw() {
    drawStage();
    const inputs = cameraOn ? getHandInputs() : [null, null];
    if (!cameraOn) {
        inputs[selected] = { x: constrain(mouseX / width, .16, .84), y: constrain(mouseY / height, 0, 1), tilt: 0, curl: demoCurl };
    }
    for (let i = 0; i < 2; i++)
        puppets[i].draw(inputs[i], mode === 'practice');
    if (cameraOn) {
        setStatus(`${inputs.filter(Boolean).length}/2 hands tracked · S swaps hand assignment · keep hands in view`);
    }
    if ((showCamera || mode === 'practice') && cameraOn && video) {
        push();
        translate(982, 40);
        scale(-1, 1);
        image(video, 0, 0, 160, 120);
        // Overlay the actual detected landmarks on the mirrored preview.
        pop();
        for (const input of inputs) {
            if (!input)
                continue;
            for (const point of input.points) {
                noStroke();
                fill(120, 255, 180);
                circle(822 + point.x * 160, 40 + point.y * 120, 4);
            }
        }
    }
    noStroke();
    fill('#261a22');
    rect(0, 560, width, 90);
    fill('#f1d6aa');
    textAlign(LEFT);
    textSize(15);
    if (mode === 'practice') {
        text('PRACTICE  ·  Curl or spread fingers. Deep middle-finger curl = twirl. Straighten to reset.', 24, 582);
        for (let i = 0; i < 5; i++) {
            fill(STRING_COLORS[i]);
            textSize(13);
            text(`${i + 1}  ${FINGER_NAMES[i]} → ${LIMB_NAMES[i]}`, 24 + i * 195, 608);
            for (let h = 0; h < 2; h++) {
                fill(70);
                rect(24 + i * 195, 613 + h * 6, 145, 4);
                fill(STRING_COLORS[i]);
                rect(24 + i * 195, 613 + h * 6, 145 * (inputs[h]?.curl[i] || 0), 4);
            }
        }
        fill('#c9ac93');
        textSize(12);
        text('Without camera: move mouse, hold 1–5 to pull strings, press Tab to switch puppets. With camera: S swaps hands.', 24, 633);
    }
    else {
        textAlign(CENTER);
        textSize(20);
        text('THE STAGE IS YOURS', 500, 593);
        textSize(13);
        fill('#c9ac93');
        text('Move together. Experiment with gestures and choreography. Deep middle-finger curl to twirl.', 500, 620);
    }
}
function keyPressed() {
    if (key === 's' || key === 'S') {
        swapHands = !swapHands;
    }
    if (key === 't' || key === 'T') {
        puppets[selected].controller.requestSpin();
    }
    if (!cameraOn) {
        if (keyCode === TAB) {
            selected = 1 - selected;
            return false;
        }
        const fingerIndex = Number(key) - 1;
        if (fingerIndex >= 0 && fingerIndex < 5) {
            demoCurl[fingerIndex] = 1;
        }
    }
}

function keyReleased() {
    const fingerIndex = Number(key) - 1;
    if (fingerIndex >= 0 && fingerIndex < 5) {
        demoCurl[fingerIndex] = 0;
    }
}

window.addEventListener('pagehide', () => {
    if (cameraOn) {
        stopCamera();
    }
});
