const width = window.innerWidth;
const height = window.innerHeight;

const maxBalls = 50;

/*
    Lower the number, higher the reaction speed
    Should be greater than 0
*/
const dragFactor = 10;

let balls = [];

function setup() {
    createCanvas(width, height);
    setupBalls();
}

function draw() {
    background(0);
    updateBallPosition();
    handleDynamicBallsCollision();
    handleBallOverlap();
    drawLineFromSelectedBall();
}

let isBallSelected = false;
let selectedBallId;

function mouseReleased() {
    if (isBallSelected) {
        let ball = balls[selectedBallId];

        ball.xVel = (ball.x - mouseX) / dragFactor;
        ball.yVel = (ball.y - mouseY) / dragFactor;
    }

    selectedBallId = undefined;
    isBallSelected = false;
    return false;
}

function mouseDragged() {
    for (let i = 0; i < maxBalls; i++) {
        let ball = balls[i];
        let distance = dist(ball.x, ball.y, mouseX, mouseY);
        if (distance < ball.radius && dragFactor > 0) {
            isBallSelected = true;
            selectedBallId = i;
            break;
        }
    }

    return false;
}

function drawLineFromSelectedBall() {
    if (isBallSelected) {
        stroke(255, 0, 0);
        strokeWeight(5);
        line(balls[selectedBallId].x, balls[selectedBallId].y, mouseX, mouseY);
    }
}

function setupBalls() {
    for (let i = 0; i < maxBalls; i++) {
        let diameter = random(10, 50);
        let radius = diameter / 2;

        let xPos = random(radius, width - radius);
        let yPos = random(radius, height - radius);

        if (isBallPositionUnique(xPos, yPos, radius))
            balls.push(new Ball(xPos, yPos, diameter, random(-2, 2), random(-2, 2)));
    }
}

function isBallPositionUnique(xPos, yPos, radius) {
    for (let ball of balls)
        if (dist(ball.x, ball.y, xPos, yPos) <= (ball.radius + radius))
            return false;

    return true;
}

function updateBallPosition() {
    for (let ball of balls) {
        ball.x += ball.xVel;
        ball.y += ball.yVel;
        ball.create(width, height);
        ball.handleWallCollision(width, height);
    }
}

function handleBallOverlap() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let ball1 = balls[i];
            let ball2 = balls[j];

            let distance = dist(ball1.x, ball1.y, ball2.x, ball2.y);
            let sumOfRadiusOfBalls = ball1.radius + ball2.radius;
            if (distance <= sumOfRadiusOfBalls) {
                let overlapDistCorrection = (sumOfRadiusOfBalls - distance) / 2;
                let normalizedX = (ball1.x - ball2.x) / distance;
                let normalizedY = (ball1.y - ball2.y) / distance;

                let offsetX = normalizedX * overlapDistCorrection;
                let offsetY = normalizedY * overlapDistCorrection;

                ball1.x += offsetX;
                ball1.y += offsetY;
                ball2.x -= offsetX;
                ball2.y -= offsetY;
            }
        }
    }
}

function handleDynamicBallsCollision() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let ball1 = balls[i];
            let ball2 = balls[j];

            let distance = dist(ball1.x, ball1.y, ball2.x, ball2.y);
            if (distance <= (ball1.radius + ball2.radius)) {
                let normalizedX = (ball1.x - ball2.x) / distance;
                let normalizedY = (ball1.y - ball2.y) / distance;

                let tangentialX = normalizedY;
                let tangentialY = -normalizedX;

                let dotProductTangent1 = (ball1.xVel * tangentialX) + (ball1.yVel * tangentialY);
                let dotProductTangent2 = (ball2.xVel * tangentialX) + (ball2.yVel * tangentialY);

                let dotProductNormal1 = (ball1.xVel * normalizedX) + (ball1.yVel * normalizedY);
                let dotProductNormal2 = (ball2.xVel * normalizedX) + (ball2.yVel * normalizedY);

                let conservationOfMomentumNormal1 =
                    ((2 * ball2.mass * dotProductNormal2) + (dotProductNormal1 * (ball1.mass - ball2.mass)))
                        / (ball1.mass + ball2.mass);

                let conservationOfMomentumNormal2 =
                    ((2 * ball1.mass * dotProductNormal1) + (dotProductNormal2 * (ball2.mass - ball1.mass)))
                        / (ball1.mass + ball2.mass);

                ball1.xVel = (normalizedX * conservationOfMomentumNormal1) + (tangentialX * dotProductTangent1);
                ball1.yVel = (normalizedY * conservationOfMomentumNormal1) + (tangentialY * dotProductTangent1);
                ball2.xVel = (normalizedX * conservationOfMomentumNormal2) + (tangentialX * dotProductTangent2);
                ball2.yVel = (normalizedY * conservationOfMomentumNormal2) + (tangentialY * dotProductTangent2);
            }
        }
    }
}