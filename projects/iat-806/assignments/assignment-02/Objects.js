class Fruit {
    constructor() {
        this.radius = random(30, 45);

        this.x = random(60, width - 60);
        this.y = -this.radius;

        this.speed = random(2, 4);

        // 15% chance of a bomb
        if (random() < 0.15) {
            this.type = "bomb";
            this.emoji = "💣";
        } else {
            this.type = "fruit";
            this.emoji = random([
                "🍎", "🍉", "🍊", "🍋", "🍓"
            ]);
        }
    }

    update() {
        this.y += this.speed;
    }

    display() {
        push();

        textAlign(CENTER, CENTER);
        textSize(this.radius * 2);
        text(this.emoji, this.x, this.y);

        pop();
    }

    checkCollision(blade) {
        if (!blade.active) {
            return false;
        }

        let bladeTop = blade.y - blade.length;
        let bladeBottom = blade.y;

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
