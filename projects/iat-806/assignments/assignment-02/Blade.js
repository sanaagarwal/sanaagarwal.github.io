class Blade {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.length = 90;
        this.active = false;
    }

    update(faces) {
        if (faces.length === 0) {
            this.active = false;
            return;
        }

        let face = faces[0];

        let leftEye = face.leftEye;
        let rightEye = face.rightEye;

        if (!leftEye || !rightEye) {
            this.active = false;
            return;
        }

        let eyeX = (leftEye.centerX + rightEye.centerX) / 2;
        let eyeY = (leftEye.centerY + rightEye.centerY) / 2;

        let targetX = width - eyeX;
        let targetY = eyeY - 80;


        this.x = lerp(this.x, targetX, 0.4);
        this.y = lerp(this.y, targetY, 0.4);

        this.active = true;
    }


    display() {
        push();
        imageMode(CENTER);
        image(knife, this.x, this.y - 40, 140, 150);
        pop();
    }
}