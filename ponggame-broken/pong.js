let model = new Model();

function onTick() {
    switch (model.state) {
        case STATE.STARTUP:
            model.state = STATE.PLAYING;
            break;
        case STATE.PLAYING:
            model.state = play();
            break;
        case STATE.GAMEOVER:
            model.state = onGameOver();
            break;
    }
    draw_game(model);
    model.intervalID = setTimeout(onTick, 10);
}

function play() {
    for(let paddle of [...model.paddleL, ...model.paddleR])
        paddle.move(model.is_cpu, model.ball);
    let scoreSide = model.ball.bounce([...model.paddleL, ...model.paddleR]);
    if (scoreSide != SIDE.NONE) {
        modifyScore(scoreSide, 1);
        model.resetBall();
        if (model.scoreL > 10 || model.scoreR > 10) return STATE.GAMEOVER;
    }
    model.ball.move();
    // Add serving the ball?
    // If a player wins, stop the game...
    return STATE.PLAYING;
}

function modifyScore(side, points) {
    if (side == SIDE.LEFT) {
        if(model.livesLeftR > points) 
            model.livesLeftR -= points;
        else model.scoreL += points;
    } else if (side == SIDE.RIGHT) {
        if(model.livesLeftL >= points) 
            model.livesLeftL -= points;
        else model.scoreR += points;
    }
    updateScore(model);
}

function onGameOver() {
    if (model.scoreL > 10) {
        model.winsL++;
        model.loser = SIDE.RIGHT;
    }
    else if (model.scoreR > 10) {
        model.winsR++;
        model.loser = SIDE.LEFT;
    }
    updateScore(model);
    giveSkills();
}

function giveSkills() {
    let overlayScreen = document.getElementById("overlay");
    overlayScreen.setAttribute("status", "show");
    overlayScreen.innerHTML = `
        <h1>${model.loser == SIDE.LEFT ? "Left" : "Right"} Player Loses!</h1>
        <button id="biggerPaddle" onclick="biggerPaddle()">Bigger Paddle</button>
        <button id="fasterBall" onclick="fasterBall()">Faster Ball</button>
        <button id="moreLife" onclick="moreLife()">More Life</button>
        <button id="randomReflection" onclick="randomReflection()">Random Reflection</button>
        <button id="smallerPaddle" onclick="smallerPaddel()">Smaller Paddle</button>
        <button id="twoPointsZone">Two Points Zone</button>
        <button id="fasterPaddle">Faster Paddle</button>
        <button id="splitPaddle">Split Paddle</button>
    `;
}

// on First Lose

function biggerPaddle() {
    if(model.loser == SIDE.LEFT)
        model.paddleL[0].height *= 1.1;
    else if(model.loser == SIDE.RIGHT)
        model.paddleR[0].height *= 1.1;
}

function fasterBall() {
    document.addEventListener('attackSideChange', (event) => {
        if (event.detail.message == model.loser) {
            model.ball.velx *= 1.1;
            model.ball.vely *= 1.1;
        }
    });
}

function moreLife() {
    if (model.loser == SIDE.LEFT) {
        model.livesLeftL = 2;
    }
    else if (model.loser == SIDE.RIGHT) {
        model.livesLeftR = 2;
    }
}

function randomReflection() {
    document.addEventListener('attackSideChange', (event) => {
        if (event.detail.message == model.loser) {
            const theta = (Math.random() - 0.5) * Math.PI / 2; // Random angle between -45 and 45 degrees
            [model.ball.velx, model.ball.vely] = [
                model.ball.velx * Math.cos(theta) - model.ball.vely * Math.sin(theta)
                , model.ball.velx * Math.sin(theta) + model.ball.vely * Math.cos(theta)
            ];
        }
    });
}

function smallerPaddle() {
    if(model.loser == SIDE.LEFT)
        model.paddleR[0].height *= 10 / 11;
    else if(model.loser == SIDE.RIGHT)
        model.paddleL[0].height *= 10 / 11;
}

// on Second Lose

function twoPointsZone() {
    document.addEventListener('inBonusZone', (event) => {
        modifyScore(event.detail.message, 2);
    });
}

function fasterPaddle() {
    model.PADDEL_VELOCITY *= 1.5;
}

function splitPaddel() {
    if (model.loser == SIDE.LEFT) {
        // Split the left paddle into two
        model.paddleL.push(new Paddle(0, 0, PADDLE_WIDTH, model.paddleL[0][0].height / 2, SIDE.LEFT, "red"));
        model.paddleL[0].maxHeight = BOARD_HEIGHT / 2;
        model.paddleL[0].posy = BOARD_HEIGHT / 2 - model.paddleL[0][0].height / 2;
        model.paddleL[0].height /= 2;
        model.paddleL[1].posy = PADDLE_HEIGHT / 2;
        model.paddleL[1].minHeight = PADDLE_HEIGHT / 2;

        // Keybindings
        model.splitL = true;
    } else if (model.loser == SIDE.RIGHT) {
        // Split the right paddle into two
        model.paddleR.push(new Paddle(BOARD_WIDTH - PADDLE_WIDTH, 0, PADDLE_WIDTH, model.paddleR[0][0].height / 2, SIDE.RIGHT, "green"));
        model.paddleR[0].maxHeight = BOARD_HEIGHT / 2;
        model.paddleR[0].posy = BOARD_HEIGHT / 2 - model.paddleR[0][0].height / 2;
        model.paddleR[0].height /= 2;
        model.paddleR[1].posy = PADDLE_HEIGHT / 2;
        model.paddleR[1].minHeight = PADDLE_HEIGHT / 2;

        // Keybindings
        model.splitR = true;
    }
}