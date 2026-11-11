// Fire, smoke and sparks. No emoji debris or starburst.
class Explosion {
    constructor() {
        this.reset();
    }

    start(x, y) {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.duration = 78; // About two seconds at 60 FPS
        this.active = true;
        this.finished = false;
        this.particles = [];

        for (let i = 0; i < 140; i++) {
            let angle = random(TWO_PI);
            let speed = random(2, 12);
            let type = i < 55 ? "fire" : i < 100 ? "smoke" : "spark";
            this.particles.push({
                x: x, y: y,
                vx: cos(angle) * speed,
                vy: sin(angle) * speed,
                size: type === "spark" ? random(2, 6) : random(25, 65),
                type: type,
                life: 255,
                delay: random(0, 10)
            });
        }
    }

    update() {
        if (!this.active) return;
        this.frame++;
        for (let p of this.particles) {
            if (this.frame < p.delay) continue;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.97;
            p.vy *= 0.97;
            if (p.type === "smoke") {
                p.vy -= 0.04;
                p.size += 0.7;
                p.life -= 2.3;
            } else if (p.type === "fire") {
                p.size += 0.3;
                p.life -= 4;
            } else {
                p.vy += 0.12;
                p.life -= 2.5;
            }
        }
        if (this.frame >= this.duration) {
            this.active = false;
            this.finished = true;
        }
    }

    display() {
        if (!this.active) return;
        push();
        noStroke();
        if (this.frame < 10) {
            fill(255, 180, 90, 170 * (1 - this.frame / 10));
            rect(0, 0, width, height);
        }

        for (let p of this.particles) {
            if (this.frame < p.delay || p.life <= 0) continue;
            let alpha = max(0, p.life);
            if (p.type === "fire") {
                noStroke();
                fill(255, 80, 10, alpha * 0.45);
                circle(p.x, p.y, p.size * 1.8);
                fill(255, 160, 25, alpha * 0.7);
                circle(p.x, p.y, p.size);
            } else if (p.type === "smoke") {
                noStroke();
                fill(35, 35, 40, alpha * 0.4);
                circle(p.x, p.y, p.size * 1.8);
                fill(75, 65, 60, alpha * 0.25);
                circle(p.x, p.y, p.size);
            } else {
                stroke(255, 190, 50, alpha);
                strokeWeight(p.size);
                line(p.x, p.y, p.x - p.vx * 2, p.y - p.vy * 2);
            }
        }
        pop();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.frame = 0;
        this.duration = 78;
        this.particles = [];
        this.active = false;
        this.finished = false;
    }
}
