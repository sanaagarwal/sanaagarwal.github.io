// All movement sources share this pose format. A future learned or recorded
// choreography can supply autonomousPose without changing the artwork.
class MotionController {
    constructor(homeX) {
        this.home = homeX;
        this.pose = this.restPose();
        this.velocity = this.restPose();
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.manualWeight = 1;
        this.autonomousPose = null;
        this.spinAngle = 0;
        this.spinTarget = 0;
        this.spinArmed = false;
    }

    restPose() {
        return {
            x: this.home,
            y: 420,
            tilt: 0,
            curl: [0, 0, 0, 0, 0],
            spread: [0, 0, 0, 0, 0]
        };
    }

    manualPose(input) {
        if (!input) {
            return this.restPose();
        }

        return {
            x: map(input.x, 0, 1, 160, 840, true),
            y: map(input.y, 0, 1, 325, 465, true),
            tilt: input.tilt * 0.28,
            curl: input.curl,
            spread: input.spread || [0, 0, 0, 0, 0]
        };
    }

    mix(manual, autonomous) {
        if (!autonomous) {
            return manual;
        }

        const weight = this.manualWeight;
        const result = this.restPose();

        for (const key of ['x', 'y', 'tilt']) {
            result[key] = lerp(autonomous[key], manual[key], weight);
        }

        for (let i = 0; i < 5; i++) {
            result.curl[i] = lerp(autonomous.curl[i], manual.curl[i], weight);
            result.spread[i] = lerp(autonomous.spread[i], manual.spread[i], weight);
        }

        return result;
    }

    requestSpin(direction = 1) {
        // Ignore repeated requests until the current turn finishes.
        if (Math.abs(this.spinTarget - this.spinAngle) < 0.01) {
            this.spinTarget += direction * TWO_PI;
        }
    }

    updateSpin(input, timeStep) {
        // Straighten the middle finger to arm the gesture. Curl it deeply
        // to pull the head string and trigger one full body twirl.
        // Separate thresholds prevent repeated spins from tracking jitter.
        if (!input) {
            this.spinArmed = false;
        } else if (input.curl[2] < 0.25) {
            this.spinArmed = true;
        } else if (input.curl[2] > 0.80 && this.spinArmed) {
            const direction = input.spread?.[2] < -0.12 ? -1 : 1;
            this.requestSpin(direction);
            this.spinArmed = false;
        }

        const remaining = this.spinTarget - this.spinAngle;
        const step = 0.12 * timeStep;
        this.spinAngle += constrain(remaining, -step, step);

        // Keep angles small after a completed turn.
        if (Math.abs(this.spinTarget - this.spinAngle) < 0.001) {
            this.spinAngle = 0;
            this.spinTarget = 0;
        }
    }

    update(input) {
        const manual = this.manualPose(input);
        const target = this.mix(manual, this.autonomousPose);
        const timeStep = constrain(deltaTime / 16.67, 0.1, 2);

        // A damped spring gives the puppet a loose, overshooting motion.
        for (const key of ['x', 'y', 'tilt']) {
            const displacement = target[key] - this.pose[key];
            const acceleration = displacement * 0.065;
            const damping = pow(0.78, timeStep);
            this.velocity[key] += acceleration * timeStep;
            this.velocity[key] *= damping;
            this.pose[key] += this.velocity[key] * timeStep;
        }

        for (let i = 0; i < 5; i++) {
            this.pose.spread[i] = lerp(this.pose.spread[i], target.spread[i], 0.22);
            const displacement = target.curl[i] - this.pose.curl[i];
            this.velocity.curl[i] += displacement * 0.12 * timeStep;
            this.velocity.curl[i] *= pow(0.74, timeStep);
            this.pose.curl[i] += this.velocity.curl[i] * timeStep;
            this.pose.curl[i] = constrain(this.pose.curl[i], 0, 1);
        }

        this.updateSpin(input, timeStep);
        this.pose.spin = this.spinAngle;
        return this.pose;
    }
}
