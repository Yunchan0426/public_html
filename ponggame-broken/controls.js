class Stack {
    constructor() {
        this.items = [];
    }

    // Add a number to the stack
    push(string) {
        this.items.push(string);
    }

    // Take the top number off the stack
    pop() {
        if (this.items.length === 0) 
            return false;
        return this.items.pop();
    }

    // See what the top number is
    peek() {
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Find out how many items are in the stack
    size() {
        this.items.length;
    }
}

const stack = new Stack();
let k = [];

window.addEventListener("keydown", keyDown);
function keyDown(event) {
    const key = event.code;
    // console.log(`KEYDOWN: ${key}`);

    if (stack.isEmpty() === false) {
        stack.pop();
    }
    stack.push(key);
    switch (stack.peek()) {
        case "ArrowUp":
            model.paddleR.vely = -PADDLE_VELOCITY;
            break;
        case "KeyW":
            model.paddleL.vely = -PADDLE_VELOCITY;
            break;
        case "ArrowDown":
            model.paddleR.vely = PADDLE_VELOCITY;
            break;
        case "KeyS":
            model.paddleL.vely = PADDLE_VELOCITY;
            break;
        case "End":
            model.resetGame();
            break;
    }
}

window.addEventListener("keyup", keyUp);
function keyUp(event) {
    const key = event.code;
    k.appendChild(key);
    // console.log(`KEYUP: ${key}`);
    for (i in k) {
        if (stack.peek() === i) {
            stack.pop();
            k.removechild()
        }
    }
    if (stack.isEmpty()) {
        switch (key) {
            case "ArrowUp":
                model.paddleR.vely = 0;
                break;
            case "ArrowDown":
                model.paddleR.vely = 0;
                break;
            case "KeyW":
                model.paddleL.vely = 0;
                break;
            case "KeyS":
                model.paddleL.vely = 0;
                break;
        }
    }
}

function resetGame() {
    model.scoreL = 0;
    model.scoreR = 0;
    model.resetGame();
    onTick();
}

function set_cpu(event) {
    model.is_cpu = event.target.checked;
}
