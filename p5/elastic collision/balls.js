class Ball {
    constructor(x, y, diameter, xVel, yVel) {
        this.x = x;
        this.y = y;

        this.mass = diameter;
        this.diameter = diameter;
        this.radius = diameter / 2;

        this.xVel = xVel;
        this.yVel = yVel;
    }

    create(width, height) {
        this.x = this.getPositionWithResolvedWallOverlap(this.x, this.xVel, width);
        this.y = this.getPositionWithResolvedWallOverlap(this.y, this.yVel, height);

        noStroke();
        circle(this.x, this.y, this.diameter);
    }

    getPositionWithResolvedWallOverlap(coordinate, velocity, maxDist) {
        let newCoordinate = coordinate;

        if ((coordinate + velocity + this.radius) > maxDist) {
            newCoordinate = maxDist - this.radius;
        }
        else if ((coordinate + velocity - this.radius) < 0) {
            newCoordinate = this.radius;
        }

        return newCoordinate;
    }

    handleWallCollision(width, height) {
        if (this.y >= height - this.radius) {
            this.yVel = -this.yVel;
        }
        else if (this.y - this.radius <= 0) {
            this.yVel = -this.yVel;
        }

        if (this.x >= width - this.radius) {
            this.xVel = -this.xVel;
        }
        else if (this.x - this.radius <= 0) {
            this.xVel = -this.xVel;
        }
    }
}