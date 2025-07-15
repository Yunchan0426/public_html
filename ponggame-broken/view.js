const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");

function updateScore(model) {
    scoreboard.innerHTML = `${model.winsL} | ${model.scoreL} : ${model.scoreR} | ${model.winsR}`;
}

function draw_game(model) {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    ctx.beginPath();
    ctx.arc(ball.posx - ball.velx*2, ball.posy - ball.vely*2, BALL_RADIUS, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.posx, ball.posy, BALL_RADIUS, 0, 2*Math.PI);
    ctx.fillStyle = "pink";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

}

function resestCtxShadow(ctx) {
    ctx.shadowColor = 'rgba(0 0 0 0)';
    ctx.shadowOffsetX = 0;
    ctx.shadowBlur = 0;
}

function draw_paddle(ctx, paddle) {
    ctx.save();

    ctx.fillStyle = "black"; 
    ctx.fillRect(paddle.posx, paddle.posy - paddle.vely, paddle.width, paddle.height);

    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.posx, paddle.posy, paddle.width, paddle.height);

    ctx.strokeStyle = "black";
    ctx.strokeRect(paddle.posx, paddle.posy, paddle.width, paddle.height);

    ctx.restore();
}