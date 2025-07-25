const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };

class Paddle {
    posx;
    posy;
    width;
    height;
    maxHeight = BOARD_HEIGHT;
    minHeight = 0;
    color;
    ctrl = new keyControlArr();
    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
        this.ctrl = new keyControlArr();
    }

    move(is_cpu, ball) {
        if (is_cpu) {
            // ball.y <- where the ball is
            // this.y <- where the paddle is
            // this.l <- how long the paddle is

            // control this.vy using ball
            // don't set this.y! (cheating)
            this.vely = Math.sign(ball.posy - this.posy - this.height / 2 ) * PADDLE_VELOCITY;
        }
        this.posy = Math.min(this.maxHeight - this.height, Math.max(this.minHeight, this.posy + this.vely));
    }

    bounce(ball) {
        let bounce_dir = Math.sign(BOARD_WIDTH / 2 - this.posx);
        // try bounce ball
        if (ball.posy >= this.posy && ball.posy <= this.posy + this.height && // within y
            ((this.side == SIDE.LEFT && ball.posx - BALL_RADIUS <= this.posx + this.width) || (this.side == SIDE.RIGHT && ball.posx + BALL_RADIUS >= this.posx)) &&  // within x 
            ball.velx * bounce_dir < 0 // ball going into wall
        ) {
            ball.velx = bounce_dir * PADDLE_FORCE * Math.abs(ball.velx);
            ball.setAttackSide(this.side);
            return SIDE.NONE;
        }

        return SIDE.NONE;
    }

    refreshVel() {
        const top = this.ctrl.getKey();
        if (top == KEYS.UP)
            this.vely = -PADDLE_VELOCITY;
        else if (top == KEYS.DOWN)
            this.vely = PADDLE_VELOCITY;
        else 
            this.vely = 0;
    }
}

// function bounceRightPaddle(paddle) {
//     if (this.posx + BALL_RADIUS < paddle.posx) return SIDE.NONE;
//     if (this.posx + BALL_RADIUS > paddle.posx + paddle.width) return SIDE.LEFT; // Someone got a point...
//     if (this.posy < paddle.posy) return SIDE.NONE;
//     if (this.posy > paddle.posy + paddle.height) return SIDE.NONE;
//     if (this.velx > 0) {
//         this.velx = -PADDLE_FORCE * Math.abs(this.velx);
//         // add other spin, etc.
//         // add sound?
//     }
//     return SIDE.NONE;
// }