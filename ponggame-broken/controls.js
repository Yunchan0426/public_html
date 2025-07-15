window.addEventListener("keydown", keyDown);
function keyDown(event) {
    const key = event.code;
    // console.log(`KEYDOWN: ${key}`);

    switch (key) {
        case "KeyW": 
            model.paddleL[0].ctrl.addKey(KEYS.UP);
            if (model.splitL) 
                model.paddleL[1].ctrl.addKey(KEYS.DOWN);
            break;
        case "KeyS":
            model.paddleL[0].ctrl.addKey(KEYS.DOWN);
            if (model.splitL) 
                model.paddleL[1].ctrl.addKey(KEYS.UP);
            break;
        case "ArrowUp":
            model.paddleR[0].ctrl.addKey(KEYS.UP);
            if(model.splitR) 
                model.paddleR[1].ctrl.addKey(KEYS.DOWN);
            break;
        case "ArrowDown":
            model.paddleR[0].ctrl.addKey(KEYS.DOWN);
            if(model.splitR) 
                model.paddleR[1].ctrl.addKey(KEYS.UP);
            break;
        case "End":
            model.resetGame();
            break;
    }
    model.paddleL[0].refreshVel();
    model.paddleR[0].refreshVel();
}

window.addEventListener("keyup", keyUp);
function keyUp(event) {
    const key = event.code;
    // console.log(`KEYUP: ${key}`);

    switch (key) {
        case "KeyW": 
            model.paddleL[0].ctrl.removeKey(KEYS.UP);
            if (model.splitL) 
                model.paddleL[1].ctrl.removeKey(KEYS.DOWN);
            break;
        case "KeyS":
            model.paddleL[0].ctrl.removeKey(KEYS.DOWN);
            if (model.splitL) 
                model.paddleL[1].ctrl.removeKey(KEYS.UP);
            break;
        case "ArrowUp":
            model.paddleR[0].ctrl.removeKey(KEYS.UP);
            if(model.splitR) 
                model.paddleR[1].ctrl.removeKey(KEYS.DOWN);
            break;
        case "ArrowDown":
            model.paddleR[0].ctrl.removeKey(KEYS.DOWN);
            if(model.splitR) 
                model.paddleR[1].ctrl.removeKey(KEYS.UP);
            break;
    }
    model.paddleL[0].refreshVel();
    model.paddleR[0].refreshVel();
}

function resetGame() {
    model.resetGame();
    onTick();
}

function set_cpu(event) {
    model.is_cpu = event.target.checked;
    model.paddleL[0].refreshVel();
    model.paddleR[0].refreshVel();    
}