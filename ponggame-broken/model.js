const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2 };

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const PADDLE_WIDTH = 25;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12.5;
const BALL_VELOCITY_INIT = 1;
let PADDLE_VELOCITY = 5;
const PADDLE_FORCE = 1.1; 

class Model {
    ball;
    paddleL = [];
    paddleR = [];
    scoreL = 0;
    scoreR = 0;
    winsL = 0;
    winsR = 0;
    livesLeftL = 0;
    livesLeftR = 0;
    splitL = false;
    splitR = false;
    loser = SIDE.NONE;
    is_cpu = false;
    state = STATE.STARTUP;
    intervalID = -1;

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.state = STATE.STARTUP;
        this.scoreL = 0; 
        this.scoreR = 0;
        updateScore(this);
        clearTimeout(this.intervalID);
        this.resetBall();
        this.paddleL.push(new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.LEFT, "red"));
        this.paddleR.push(new Paddle(BOARD_WIDTH - PADDLE_WIDTH, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.RIGHT, "green"));
    }

    resetBall() {
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, BALL_VELOCITY_INIT, -BALL_VELOCITY_INIT);
    }

}