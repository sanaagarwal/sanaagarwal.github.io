// Start, pause, score and game-over screens.
function displayStartScreen() {
    push();
    fill(0, 150); noStroke(); rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    fill(255, 210, 70); textSize(48); textStyle(BOLD);
    text("BLADE-HEAD NINJA", width / 2, 170);
    fill(255); textSize(22); textStyle(NORMAL);
    text("Move your head to slice falling fruits!", width / 2, 260);
    text("Miss a fruit = Lose 1 life", width / 2, 305);
    text("Hit a bomb = Instant Death", width / 2, 340);
    textSize(28); fill(130, 255, 170);
    text("Press SPACE to Start", width / 2, 440);
    textSize(16); fill(220);
    text("Press P or space during the game to pause", width / 2, 490);
    pop();
}

function displayScore() {
    push();
    fill(255); noStroke(); textAlign(LEFT, TOP);
    textSize(32); textStyle(BOLD);
    text("SCORE: " + score, 25, 20);
    textSize(24); text("LIVES: " + lives, 25, 65);
    textStyle(NORMAL); textSize(17);
    text("Slice fruits. Avoid bombs!", 25, 105);
    pop();
}

function displayPauseMessage(message) {
    push();
    fill(0, 130); noStroke(); rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    fill(255, 220, 80); textSize(42); textStyle(BOLD);
    text("PAUSED", width / 2, height / 2 - 40);
    fill(255); textSize(22); textStyle(NORMAL);
    text(message, width / 2, height / 2 + 20);
    pop();
}

function displayGameOver() {
    push();
    fill(0, 190); noStroke(); rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    fill(255, 90, 90); textSize(50); textStyle(BOLD);
    text("GAME OVER", width / 2, height / 2 - 85);
    fill(255); textSize(26);
    text(gameOverReason, width / 2, height / 2 - 25);
    textSize(24);
    text("Final Score: " + score, width / 2, height / 2 + 25);
    textSize(20);
    text("Press R to Restart", width / 2, height / 2 + 85);
    pop();
}
