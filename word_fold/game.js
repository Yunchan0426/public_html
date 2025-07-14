const countdown = 3;

const chars = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
const size = [15, 11];
const dropInterval = 500;
const d = {'down': [1, 0], 'left': [0, -1], 'right': [0, 1]};
let gameBoard = new Array(size[0]).fill().map(() => new Array(size[1]));
let score = 0;
// let highscore = 0;
let lastDropTime = 0;
let currLoc = [-1, -1];
let isGameGoing = false;
let paused = false;

function resetGame() {
    for(let row of gameBoard) {
        for(let cell of row) {
            cell.textContent = ' ';
            cell.setAttribute("status", "none");
            console.log("Initializing "+cell.id);
        }
    }
    score = 0;
    lastDropTime = 0;
    currLoc = [-1, -1];
    isGameGoing = false;
}

let init = () => {
    let gamezone = document.getElementById("gamezone");

    for (let i = 0; i < size[0]; i++) {
        let newRow = document.createElement('tr');
        newRow.classList.add("gameRow");
        gamezone.appendChild(newRow);
        for (let j = 0; j < size[1]; j++) {
            let newCell = document.createElement('td');
            newCell.id = 'cell' + i + ',' + j;
            newCell.classList.add('gameCell');
            newCell.setAttribute("status", "none");
            newCell.textContent = ' ';
            newRow.appendChild(newCell);
            gameBoard[i][j] = newCell;
        }
    }

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
            case 'ArrowDown':
                move('down');
                break;
        }
    });
}

// Some low-level functions

let isNoObject = () => {
    return (currLoc[0] === -1 && currLoc[1] === -1);
}

let isBlocked = (row, col) => {
    if (row < 0 || row >= size[0] || col < 0 || col >= size[1])
        return true;
    return gameBoard[row][col].textContent !== ' ';
}

let randomChar = () => {
    const randIdx = Math.floor(Math.random() * chars.length);
    return chars.charAt(randIdx);
}

let swapCell = (cell1, cell2) => {
    // const parent1 = cell1.parentNode;
    // const nextSibling1 = cell1.nextSibling;

    // const parent2 = cell2.parentNode;
    // const nextSibling2 = cell2.nextSibling;

    // parent1.insertBefore(cell2, nextSibling1);
    // parent2.insertBefore(cell1, nextSibling2);

    const cell1Status = cell1.getAttribute("status");
    const cell2Status = cell2.getAttribute("status");
    cell1.setAttribute("status", cell2Status); 
    cell2.setAttribute("status", cell1Status);

    [cell1.textContent, cell2.textContent] = [cell2.textContent, cell1.textContent];
}

// Now some high-level functions

let move = (key) => {
    if (isNoObject())
        return;

    [row, col] = currLoc;
    [newRow, newCol] = [row + d[key][0], col + d[key][1]];

    if (isBlocked(newRow, newCol))
        return;
    swapCell(gameBoard[newRow][newCol], gameBoard[row][col])
    currLoc = [newRow, newCol];
}

let onGameTick = (currentTime) => {
    if (isNoObject()) {
        currLoc = [0, 5];
        if (gameBoard[currLoc[0]][currLoc[1]].textContent != ' ') {
            currLoc = [-1, -1];
            console.log("Game Over!");
            onGameEnd();
            return false;
        }
        gameBoard[currLoc[0]][currLoc[1]].setAttribute("status", "active");
        gameBoard[currLoc[0]][currLoc[1]].textContent = randomChar();
        lastDropTime = currentTime;
    }

    const deltaTime = currentTime - lastDropTime;

    if (deltaTime > dropInterval) {
        if (isBlocked(currLoc[0] + 1, currLoc[1])) {
            gameBoard[currLoc[0]][currLoc[1]].setAttribute("status", "passive");
            currLoc[0] = -1; currLoc[1] = -1;
        }
        else {
            move('down');
            lastDropTime = currentTime;
        }
    }
    return true;
}

let mainLoop = (currentTime) => {
    if (currentTime == 0 && !isGameGoing) {
        // Reset Stuff
        isGameGoing = true;
        console.log("Starting Game...");
    }

    isGameGoing = onGameTick(currentTime);

    if (isGameGoing) 
        requestAnimationFrame(mainLoop);
}

// Some extra functions

function onStartGame(event) {
    resetGame();
    const overlayScreen = document.getElementsByClassName("info")[0];
    overlayScreen.setAttribute("status", "start")
    for(let i=0;i<countdown;i++)
        setTimeout(() => {
            overlayScreen.innerHTML = "<p>"+(countdown - i)+"</p>";
        }, i*1000);
    setTimeout(() => {
        mainLoop(0);
        overlayScreen.setAttribute("status", "no");
    }, countdown*1000);
}

function onGameEnd() {
    const overlayScreen = document.getElementsByClassName("info")[0];
    overlayScreen.innerHTML = "<p>Game Over!</p> <p style='font-size: 3em'>Your Score: </p>";
    overlayScreen.setAttribute("status", "end");
}

function pauseGame(event) {
    isGameGoing = false;
    paused = true;
}

function resumeGame(event) {
    console.log("paused: "+paused);
    if(paused)
        isGameGoing = true;
}

init();