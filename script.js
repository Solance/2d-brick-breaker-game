let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playing = false;
let lives = 4;
let win = false;
let lost = false;
let pause = false;

const ballRadius = 20;

const ball = {
    x: canvas.width / 2 - ballRadius / 2,
    y: canvas.height - 45,
    dx: 4,
    dy: -4,
};

const keyboard = {
    left: false,
    right: false,
};

const paddle = {
    x: canvas.width / 2 - 88,
    y: canvas.height - 20,
    w: 160,
    h: 22,
};

base_image = new Image();
base_image.src = "heart.png";

second_base_image = new Image();
second_base_image.src = "heartbreak.png";

function drawHearts() {
    if (lives > 0) {
        ctx.drawImage(base_image, 10, 24, 34, 34);
    } else {
        ctx.drawImage(second_base_image, 10, 24, 34, 33);
    }
    if (lives > 1) {
        ctx.drawImage(base_image, 50, 24, 34, 34);
    } else {
        ctx.drawImage(second_base_image, 50, 24, 34, 33);
    }
    if (lives > 2) {
        ctx.drawImage(base_image, 90, 24, 34, 34);
    } else {
        ctx.drawImage(second_base_image, 90, 24, 34, 33);
    }
    if (lives == 4) {
        ctx.drawImage(base_image, 130, 24, 34, 34);
    } else {
        ctx.drawImage(second_base_image, 130, 24, 34, 33);
    }
}

let bricks = [
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
];

let rowColors = ["#1A535C", "#21537A", "#4ECDC4", "#f76969", "#FFE66D"];

function getBrick(rowIndex, colIndex) {
    return {
        x: colIndex * (canvas.width / 8) + 4,
        y: rowIndex * 56 + 70,
        w: canvas.width / 8 - 8,
        h: 48,
    };
}

function drawBricks() {
    for (let rowIndex = 0; rowIndex < bricks.length; rowIndex++) {
        const row = bricks[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            if (row[colIndex]) {
                const brick = getBrick(rowIndex, colIndex);
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brick.w, brick.h);
                ctx.fillStyle = rowColors[rowIndex];
                ctx.fill();
            }
        }
    }
}

document.addEventListener("keydown", function (event) {
    if (lives > 0)
        if (event.key == "ArrowLeft") {
            if (!pause) {
                playing = true;
                keyboard.left = true;
            }
        } else if (event.key == "ArrowRight") {
            if (!pause) {
                playing = true;
                keyboard.right = true;
            }
        }
});

document.addEventListener("keyup", function (event) {
    if (event.key == "ArrowLeft") {
        keyboard.left = false;
    } else if (event.key == "ArrowRight") {
        keyboard.right = false;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key == "r") {
        restart();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key == "p") {
        pause = !pause;
        playing = !playing;
    }
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#21537A";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#21537A";
    ctx.fill();
}

function drawRestartText() {
    ctx.font = "14px Nunito Sans";
    ctx.fillStyle = "#f76969";
    ctx.textAlign = "left";
    ctx.fillText("(P) PAUSE (R) RESTART", canvas.width - 180, 46);
}

function drawWinText() {
    ctx.font = "50px Bungee Spice";
    ctx.fillStyle = "#1A535C";
    ctx.textAlign = "center";
    ctx.fillText(
        "You win! Press R for restart",
        canvas.width / 2,
        canvas.height / 2 - 50
    );
}

function drawLostText() {
    ctx.font = "50px Bungee Spice";
    ctx.fillStyle = "#1A535C";
    ctx.textAlign = "center";
    ctx.fillText(
        "Game over! Press R for restart",
        canvas.width / 2,
        canvas.height / 2 + 100
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRestartText();
    if (win) {
        drawWinText();
    }
    if (lost) {
        drawLostText();
    }
    drawHearts();
    drawBricks();
    drawBall();
    drawPaddle();
}

function bounceBallOffRectangle(ballCollisionBox, rec) {
    if (
        ballCollisionBox.right <= rec.x &&
        ballCollisionBox.right + ball.dx > rec.x
    ) {
        ball.dx = -1 * Math.abs(ball.dx);
    } else if (
        ballCollisionBox.left >= rec.x + rec.w &&
        ballCollisionBox.left + ball.dx < rec.x + rec.w
    ) {
        ball.dx = 1 * Math.abs(ball.dx);
    } else if (
        ballCollisionBox.bottom <= rec.y &&
        ballCollisionBox.bottom + ball.dy > rec.y
    ) {
        ball.dy = -1 * Math.abs(ball.dy);
    } else if (
        ballCollisionBox.top >= rec.y + rec.h &&
        ballCollisionBox.top + ball.dy < rec.y + rec.h
    ) {
        ball.dy = 1 * Math.abs(ball.dy);
    }
}

function checkBallCollision(ballCollisionBox, rec) {
    if (
        ballCollisionBox.right + ball.dx > rec.x &&
        ballCollisionBox.left + ball.dx < rec.x + rec.w &&
        ballCollisionBox.bottom + ball.dy > rec.y &&
        ballCollisionBox.top + ball.dy < rec.y + rec.h
    ) {
        return true;
    }
    return false;
}

function checkCollisions() {
    const ballCollisionBox = {
        left: ball.x - ballRadius,
        top: ball.y - ballRadius,
        right: ball.x + ballRadius,
        bottom: ball.y + ballRadius,
    };

    if (ballCollisionBox.left + ball.dx < 0) {
        ball.dx = Math.abs(ball.dx);
    }
    if (ballCollisionBox.right + ball.dx > canvas.width) {
        ball.dx = -Math.abs(ball.dx);
    }
    if (ballCollisionBox.top + ball.dy < 0) {
        ball.dy = -ball.dy;
    }
    if (ballCollisionBox.bottom + ball.dy > canvas.height + 40) {
        playing = false;
        lives--;
        ball.x = canvas.width / 2 - ballRadius / 2;
        ball.y = canvas.height - 45;
        ball.dx = 4;
        ball.dy = -4;
        paddle.x = canvas.width / 2 - 88;
        paddle.y = canvas.height - 20;
        if (lives <= 0) {
            playing = false;
            lost = true;
        }
    }

    if (checkBallCollision(ballCollisionBox, paddle)) {
        let lm = paddle.x + paddle.w / 4;
        let mm = paddle.x + paddle.w / 2;
        let rm = paddle.x + (paddle.w - paddle.w / 4);
        ball.dy = -ball.dy;
        if (ball.x < paddle.x) {
            ball.dx -= 10;
        } else if (ball.x < lm) {
            ball.dx -= 4;
        } else if (ball.x < mm) {
            ball.dx -= 2;
        } else if (ball.x < rm) {
            ball.dx += 2;
        } else if (ball.x < paddle.x + paddle.w) {
            ball.dx += 4;
        } else {
            ball.dx += 10;
        }
        ball.dy = Math.min(-0.8, ball.dy);
        var scale = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx /= scale;
        ball.dy /= scale;
        ball.dx *= 5.6;
        ball.dy *= 5.6;
        if (Math.abs(ball.dy) < 0.01) ball.dy = -1;
    }

    for (let rowIndex = 0; rowIndex < bricks.length; rowIndex++) {
        const row = bricks[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            if (row[colIndex]) {
                const brick = getBrick(rowIndex, colIndex);
                let didCollide = checkBallCollision(ballCollisionBox, brick);
                if (didCollide) {
                    bounceBallOffRectangle(ballCollisionBox, brick);
                    row[colIndex] = false;
                }
            }
        }
    }
}

function checkRowEmpty(row, _rowIndex, _arr) {
    // row = [true, false, true, true, false];
    for (let i = 0; i < row.length; i++) {
        if (row[i]) {
            return false;
        }
    }
    return true;
}

function checkWin() {
    if (playing) {
        if (bricks.every(checkRowEmpty)) {
            win = true;
            playing = false;
        }
    }
}

function updatePositions() {
    if (playing) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (keyboard.left) paddle.x -= 8;
        if (keyboard.right) paddle.x += 8;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.w > canvas.width)
            paddle.x = canvas.width - paddle.w;
    }
}

function restart() {
    playing = false;
    win = false;
    lost = false;
    pause = false;
    ball.x = canvas.width / 2 - ballRadius / 2;
    ball.y = canvas.height - 45;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = canvas.width / 2 - 88;
    paddle.y = canvas.height - 20;
    lives = 4;
    for (let rowIndex = 0; rowIndex < bricks.length; rowIndex++) {
        const row = bricks[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            bricks[rowIndex][colIndex] = true;
        }
    }
}

setInterval(() => {
    draw();
    checkWin();
    checkCollisions();
    updatePositions();
}, 10);
