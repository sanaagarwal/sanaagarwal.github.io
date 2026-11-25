const FINGERS = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]];
const FINGER_NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
const LIMB_NAMES = ['Left leg', 'Left arm', 'Head', 'Right arm', 'Right leg'];
let model, video, hands = [], cameraOn = false, modelReady = false;
let lastDetection = 0, cameraStarting = false;
function initTracking() {
    model = ml5.handPose({ maxHands: 2, flipped: false }, () => {
        modelReady = true;
        setStatus('Model ready. Enable camera to begin.');
    });
}
function setStatus(message) {
    document.getElementById('status').textContent = message;
}
async function startCamera() {
    if (cameraOn || cameraStarting)
        return;
    if (!modelReady) {
        setStatus('Hand model still loading. Please try again shortly.');
        return;
    }
    cameraStarting = true;
    setStatus('Requesting camera permission…');
    try {
        // Use p5 capture directly, rather than an empty createVideo source.
        video = createCapture({ video: { width: 640, height: 480 }, audio: false }, () => {
            cameraOn = true;
            cameraStarting = false;
            model.detectStart(video, results => {
                hands = results;
                lastDetection = millis();
            });
            document.getElementById('camera').textContent = 'Stop camera';
        });
        video.size(640, 480);
        video.hide();
        video.elt.addEventListener('error', () => {
            cameraStarting = false;
            setStatus('Camera error. Check browser permissions.');
        });
    }
    catch (error) {
        cameraStarting = false;
        setStatus('Camera unavailable: ' + error.message);
    }
}
function stopCamera() {
    if (!cameraOn)
        return;
    model.detectStop();
    video.elt.srcObject?.getTracks().forEach(track => track.stop());
    video.remove();
    video = null;
    hands = [];
    cameraOn = false;
    document.getElementById('camera').textContent = 'Enable camera';
    setStatus('Camera stopped. Mouse practice is available.');
}
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
function readHand(hand) {
    const p = hand.keypoints;
    if (!p || p.length < 21)
        return null;
    const w = video.width || 640;
    const h = video.height || 480;
    const palm = p[9];
    const size = Math.max(15, distance(p[0], palm));
    // Normalize fingertip offsets by palm size. Project onto palm-local axes
    // so moving or rotating the entire hand does not also pull every string.
    const ux = (p[0].x - palm.x) / size;
    const uy = (p[0].y - palm.y) / size;
    const fingers = FINGERS.map(indices => {
        const [a, b, c, d] = indices.map(i => p[i]);
        const length = distance(a, b) + distance(b, c) + distance(c, d);
        const curl = constrain((1 - distance(a, d) / Math.max(1, length)) * 3.8, 0, 1);
        const dx = d.x - a.x;
        const dy = d.y - a.y;
        return { curl, spread: constrain((dx * uy - dy * ux) / size, -1, 1) };
    });
    return {
        x: 1 - p[0].x / w,
        y: p[0].y / h,
        curl: fingers.map(f => f.curl),
        spread: fingers.map(f => f.spread),
        tilt: constrain(-ux, -1, 1),
        points: p.map(k => ({ x: 1 - k.x / w, y: k.y / h }))
    };
}
function getHandInputs() {
    const result = [null, null];
    if (millis() - lastDetection > 700)
        return result;
    for (const hand of hands) {
        const input = readHand(hand);
        if (!input)
            continue;
        const label = String(hand.handedness || '').toLowerCase();
        let slot = label === 'left' ? 0 : label === 'right' ? 1 : input.x < 0.5 ? 0 : 1;
        if (swapHands)
            slot = 1 - slot;
        if (result[slot] && !result[1 - slot])
            slot = 1 - slot;
        result[slot] = input;
    }
    return result;
}
