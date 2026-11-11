class Fruit {
    constructor(allowBombs, startX, difficulty) {
        this.radius = random(30, 45);
        this.x = startX ?? random(60, width - 60);
        this.y = -this.radius;

        this.speedY = 2 + difficulty * 0.8;
        this.speedX = random(-1, 1);
        this.angle = 0;
        this.rotationSpeed = random(-0.03, 0.03);


        if (allowBombs && random() < 0.15) {
            this.type = "bomb";
            this.emoji = "💣";
        } else {
            this.type = "fruit";
            this.emoji = random([
                "🍎", "🍉", "🍊", "🍋", "🍓"
            ]);
        }

        let fruitColors = {
            "🍎": [255, 60, 60],
            "🍉": [255, 70, 100],
            "🍊": [255, 160, 30],
            "🍋": [255, 220, 40],
            "🍓": [230, 40, 80]
        };

        this.particleColor = fruitColors[this.emoji] || [255, 255, 255];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.rotationSpeed;

        // Bounce off the left or right edge
        if (this.x <= this.radius || this.x >= width - this.radius) {
            this.speedX *= -1;
        }

        // Keep fruit inside the canvas
        this.x = constrain(this.x, this.radius, width - this.radius);
    }

    display() {
        push();


        translate(this.x, this.y);
        rotate(this.angle);

        fill(255)
        textAlign(CENTER, CENTER);
        textSize(this.radius * 2);
        text(this.emoji, 0, 0);

        pop();
    }

    checkCollision(blade) {
        if (!blade.active) {
            return false;
        }

        let bladeTop = blade.y - 110;
        let bladeBottom = blade.y - 55;

        // Closest point on the blade to the fruit
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

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        this.speedX = random(-3, 3);
        this.speedY = random(-3, 3);

        this.size = random(4, 9);
        this.life = 255;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Slow down the movement
        this.speedX *= 0.9;
        this.speedY *= 0.9;

        // Fade away
        this.life -= 15;
    }

    display() {
        push();
        noStroke();
        fill(
            red(this.color),
            green(this.color),
            blue(this.color),
            max(0, this.life)
        );
        circle(this.x, this.y, this.size);
        pop();
    }
}