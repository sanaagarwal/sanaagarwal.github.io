const STRING_COLORS = ['#e8aa62', '#78c6e1', '#d1a2ef', '#9dd1a0', '#ed9bad'];
class Puppet {
    constructor(name, x, girl) {
        this.name = name;
        this.girl = girl;
        this.controller = new MotionController(x);
    }
    // Joint positions are separate from the artwork, so sprites can replace shapes later.
    joints(p) {
        const c = p.curl;
        const s = p.spread;
        // Spread moves the limb sideways; curl pulls it upwards.
        return {
            head: { x: s[2] * 22, y: -125 - c[2] * 25 },
            leftShoulder: { x: -26, y: -85 },
            rightShoulder: { x: 26, y: -85 },
            leftElbow: { x: -43 - c[1] * 17, y: -50 - c[1] * 48 },
            rightElbow: { x: 43 + c[3] * 17, y: -50 - c[3] * 48 },
            leftHand: { x: -49 - c[1] * 45 + s[1] * 65, y: -12 - c[1] * 155 },
            rightHand: { x: 49 + c[3] * 45 + s[3] * 65, y: -12 - c[3] * 155 },
            leftHip: { x: -15, y: 0 },
            rightHip: { x: 15, y: 0 },
            leftKnee: { x: -22 - c[0] * 24, y: 44 - c[0] * 30 },
            rightKnee: { x: 22 + c[4] * 24, y: 44 - c[4] * 30 },
            leftFoot: { x: -25 - c[0] * 55 + s[0] * 45, y: 84 - c[0] * 105 },
            rightFoot: { x: 25 + c[4] * 55 + s[4] * 45, y: 84 - c[4] * 105 }
        };
    }
    segment(a, b, width) {
        stroke('#795034');
        strokeWeight(width + 3);
        line(a.x, a.y, b.x, b.y);
        stroke('#d6a56e');
        strokeWeight(width);
        line(a.x, a.y, b.x, b.y);
        noStroke();
        fill('#825438');
        circle(a.x, a.y, 10);
        fill('#edc28d');
        circle(a.x, a.y, 5);
    }
    draw(input, practice) {
        const p = this.controller.update(input);
        const j = this.joints(p);

        // A 2D approximation of a turn around the vertical axis.
        // The puppet narrows in profile and shows its back halfway through.
        const facing = cos(p.spin);
        const horizontalScale = Math.max(0.12, Math.abs(facing));
        const facingBack = facing < 0;
        const world = (joint) => {
            const projectedX = joint.x * horizontalScale;
            return {
                x: p.x + projectedX * cos(p.tilt) - joint.y * sin(p.tilt),
                y: p.y + projectedX * sin(p.tilt) + joint.y * cos(p.tilt)
            };
        };
        const anchors = [j.leftFoot, j.leftHand, j.head, j.rightHand, j.rightFoot].map(world);
        const handX = p.x;
        const handY = 100 + (input ? input.y * 35 : 0);
        const tips = this.drawHand(handX, handY, p.curl);
        for (let i = 0; i < 5; i++) {
            stroke(practice ? STRING_COLORS[i] : '#e8cf9d');
            strokeWeight(practice ? 1.8 : 1);
            line(tips[i].x, tips[i].y, anchors[i].x, anchors[i].y);
        }
        push();
        translate(p.x, p.y);
        rotate(p.tilt);
        scale(horizontalScale, 1);
        strokeCap(ROUND);
        this.segment(j.leftHip, j.leftKnee, 17);
        this.segment(j.leftKnee, j.leftFoot, 15);
        this.segment(j.rightHip, j.rightKnee, 17);
        this.segment(j.rightKnee, j.rightFoot, 15);
        for (const foot of [j.leftFoot, j.rightFoot]) {
            fill('#55332b');
            stroke('#321e1c');
            strokeWeight(2);
            ellipse(foot.x, foot.y, 29, 14);
        }
        this.segment(j.leftShoulder, j.leftElbow, 15);
        this.segment(j.leftElbow, j.leftHand, 13);
        this.segment(j.rightShoulder, j.rightElbow, 15);
        this.segment(j.rightElbow, j.rightHand, 13);
        noStroke();
        fill('#e4b47d');
        circle(j.leftHand.x, j.leftHand.y, 17);
        circle(j.rightHand.x, j.rightHand.y, 17);
        fill(this.girl ? '#a94e50' : '#3e7777');
        stroke('#6e4638');
        strokeWeight(2);
        rect(-29, -94, 58, 94, 12);
        if (this.girl) {
            fill('#b85d60');
            quad(-26, -44, 26, -44, 43, 20, -43, 20);
            stroke('#edc18c');
            line(-35, 10, 35, 10);
        }
        else if (!facingBack) {
            fill('#d9b67c');
            triangle(-18, -92, 18, -92, 0, -62);
            fill('#633a35');
            triangle(-15, -83, 0, -77, -15, -70);
            triangle(15, -83, 0, -77, 15, -70);
        }
        noStroke();
        fill('#e8c08d');
        rect(-9, -112, 18, 22, 5);
        push();
        translate(j.head.x, j.head.y);
        rotate((p.curl[2] - .2) * .25);
        if (this.girl) {
            fill('#69422d');
            ellipse(0, 4, 68, 79);
        }
        fill('#e6b67f');
        stroke('#825438');
        strokeWeight(2);
        ellipse(0, 0, 58, 64);
        noStroke();
        fill('#70472e');
        arc(0, -10, 60, 48, PI, TWO_PI);
        if (this.girl) {
            ellipse(-25, 2, 10, 43);
            ellipse(25, 2, 10, 43);
        }
        else {
            triangle(-28, -12, -12, -34, 10, -20);
        }
        if (facingBack) {
            noStroke();
            fill('#70472e');
            ellipse(0, 0, 58, 64);
        } else {
            fill('#3b2923');
            ellipse(-11, -2, 5, 7);
            ellipse(11, -2, 5, 7);
            fill('#c77f60');
            ellipse(-19, 9, 9, 5);
            ellipse(19, 9, 9, 5);
            noFill();
            stroke('#86523c');
            strokeWeight(2);
            arc(0, 8, 17, 13, 0, PI);
        }
        pop();
        if (practice) {
            noStroke();
            for (let i = 0; i < 5; i++) {
                fill(STRING_COLORS[i]);
                circle([j.leftFoot, j.leftHand, j.head, j.rightHand, j.rightFoot][i].x, [j.leftFoot, j.leftHand, j.head, j.rightHand, j.rightFoot][i].y, 8);
            }
        }
        pop();
        noStroke();
        fill('#f2d8aa');
        textAlign(CENTER);
        textSize(13);
        text(this.name, p.x, 540);
    }
    drawHand(x, y, curl) {
        // Stylized hand illustration; the finger curls reflect tracked input.
        push();
        translate(x, y);
        stroke('#a97855');
        strokeWeight(2);
        fill('#e6bd90');
        rect(-25, -3, 50, 42, 15);
        rect(-12, 32, 24, 20, 5);
        const tips = [];
        for (let i = 0; i < 5; i++) {
            const baseX = -29 + i * 14;
            const length = [24, 43, 49, 43, 33][i];
            const tx = baseX + (i - 2) * 4;
            const ty = -length + curl[i] * length * .72;
            stroke('#a97855');
            strokeWeight(13);
            line(baseX, 5, tx, ty);
            stroke('#e6bd90');
            strokeWeight(10);
            line(baseX, 5, tx, ty);
            tips.push({ x: x + tx, y: y + ty });
        }
        pop();
        return tips;
    }
}
