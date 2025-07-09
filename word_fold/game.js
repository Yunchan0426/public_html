/*const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

function make_cell_list() {
    let cells = [...document.getElementById("cell-holder").children];
    let cell_board = [];
    for (let i = 0; i < 25; i += 5) {
        cell_board.push(cells.slice(i, i + 5))
    }
    return cell_board;
}

function setup_game(starting_cells) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = starting_cells[y][x];
        }
    }
}

const CELLS = make_cell_list();
let selected_x = -1;
let selected_y = -1;

setup_game(boards[0].cells)
document.getElementById("words").innerHTML = "Words to spell: " + boards[0].words.join(", ")


function move(x, y) {
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = ""
    select(x, y);
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;
}

function select(x, y) {
    if (CELLS[y][x].innerHTML.length > 0) {
        if (selected_x >= 0 && selected_y >= 0)
            CELLS[selected_y][selected_x].classList.remove("selected");
        CELLS[y][x].classList.add("selected");
        selected_y = y;
        selected_x = x;
    }
}

function is_close(a, b) {
    return Math.abs(a - b) <= 1
}

function can_move(x, y) {
    let can_move = is_close(selected_x, x) && selected_y == y || is_close(selected_y, y) && selected_x == x;

    return selected_x >= 0 && selected_y >= 0 && can_move && CELLS[y][x].innerHTML.length > 0
}

function on_click(x, y) {
    if (selected_x == x && selected_y == y) {
        unselect(x, y)
    }
    else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
}
*/// Game Constants
const COLS = 10; // Number of columns on the game board
const ROWS = 15; // Number of rows on the game board
const BLOCK_SIZE = 30; // Size of each block in pixels
const GAME_SPEED = 500; // Time in ms for block to fall one step (initial speed)
const FAST_FALL_SPEED = 50; // Time in ms for block to fall one step when fast falling
const NEW_BLOCK_INTERVAL = 1000; // Time in ms before a new block appears after one lands

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// Game state variables
let board = []; // The game board grid
let currentBlock = null; // The currently falling block
let score = 0; // Player's score
let gameOver = false; // Game over flag
let gameInterval = null; // Interval for block falling
let newBlockTimeout = null; // Timeout for new block generation
let isFastFalling = false; // Flag for fast falling

// DOM elements
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const startButton = document.getElementById('startButton');

// Simple dictionary for word validation (can be expanded)
const dictionary = new Set([
    "CAT", "DOG", "RUN", "JUMP", "WORD", "GAME", "PLAY", "CODE", "HTML", "CSS", "JS",
    "APPLE", "BANANA", "GRAPE", "LEMON", "ORANGE", "PEAR", "PLUM", "BERRY",
    "HOUSE", "BUILD", "DREAM", "LIGHT", "NIGHT", "STORY", "HAPPY", "FUNNY",
    "QUIET", "BRAVE", "CLEAN", "SMART", "GREAT", "SWEET", "TRUTH", "TRUST",
    "WATER", "RIVER", "OCEAN", "CLOUD", "EARTH", "PLANT", "FLOWER", "TREE",
    "MUSIC", "SONG", "DANCE", "RHYTHM", "SOUND", "VOICE", "HEART", "MIND",
    "WRITE", "READ", "LEARN", "TEACH", "THINK", "KNOW", "SEEK", "FIND",
    "BEGIN", "END", "START", "STOP", "GO", "COME", "LEAVE", "ARRIVE",
    "SMALL", "LARGE", "TINY", "HUGE", "SHORT", "TALL", "WIDE", "NARROW",
    "FAST", "SLOW", "QUICK", "RAPID", "SWIFT", "BRISK", "EASY", "HARD"
]);

// Function to initialize the game board
function initBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
}

// Function to generate a random uppercase letter
function getRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Function to create a new falling block
function createBlock() {
    // Random letter, starting at top center
    currentBlock = {
        letter: getRandomLetter(),
        x: Math.floor(COLS / 2),
        y: 0,
        color: `hsl(${Math.random() * 360}, 70%, 60%)` // Random vibrant color
    };

    // Check for immediate game over (block spawns on existing block)
    if (board[currentBlock.y][currentBlock.x] !== '') {
        endGame();
        return false;
    }
    return true;
}

// Function to draw a single cell on the canvas
function drawCell(x, y, letter, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#333'; // Border color
    ctx.lineWidth = 1;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

    ctx.fillStyle = 'white';
    ctx.font = `${BLOCK_SIZE * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x * BLOCK_SIZE + BLOCK_SIZE / 2, y * BLOCK_SIZE + BLOCK_SIZE / 2);
}

// Function to draw the entire game board
function drawBoard() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== '') {
                drawCell(c, r, board[r][c].letter, board[r][c].color);
            } else {
                // Draw empty cells (background)
                ctx.fillStyle = '#2d3748';
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Function to draw the current falling block
function drawCurrentBlock() {
    if (currentBlock) {
        drawCell(currentBlock.x, currentBlock.y, currentBlock.letter, currentBlock.color);
    }
}

// Function to clear the canvas and redraw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas
    drawBoard();
    drawCurrentBlock();
    scoreDisplay.textContent = score;
}

// Function to check if a move is valid
function isValidMove(x, y) {
    // Check boundaries
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
        return false;
    }
    // Check for collision with existing blocks
    if (board[y][x] !== '') {
        return false;
    }
    return true;
}

// Function to move the current block
function moveBlock(dx, dy) {
    if (gameOver || !currentBlock) return false;

    const newX = currentBlock.x + dx;
    const newY = currentBlock.y + dy;

    if (isValidMove(newX, newY)) {
        currentBlock.x = newX;
        currentBlock.y = newY;
        draw();
        return true;
    }
    return false;
}

// Function to land the current block
function landBlock() {
    if (!currentBlock) return;

    // Place the block on the board
    board[currentBlock.y][currentBlock.x] = {
        letter: currentBlock.letter,
        color: currentBlock.color
    };
    currentBlock = null; // No longer falling

    // Check for completed words
    checkWords();

    // Start timeout for next block
    if (!gameOver) {
        clearTimeout(newBlockTimeout); // Clear any existing timeout
        newBlockTimeout = setTimeout(() => {
            if (!createBlock()) { // Try to create a new block
                endGame(); // If creation fails (game over), end game
            }
            resetGameInterval(); // Reset falling interval for new block
            draw();
        }, NEW_BLOCK_INTERVAL);
    }
}

// Game loop update function
function update() {
    if (gameOver) return;

    if (!currentBlock) {
        // If no block, wait for newBlockTimeout to create one
        return;
    }

    // Move block down
    if (!moveBlock(0, 1)) {
        // If block cannot move down, it has landed
        landBlock();
    }
}

// Function to reset the game interval based on fast falling state
function resetGameInterval() {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, isFastFalling ? FAST_FALL_SPEED : GAME_SPEED);
}

// Event listener for keyboard input
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowLeft':
            moveBlock(-1, 0);
            break;
        case 'ArrowRight':
            moveBlock(1, 0);
            break;
        case 'ArrowDown':
            if (!isFastFalling) {
                isFastFalling = true;
                resetGameInterval(); // Speed up falling
                update(); // Immediately move down one step
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (gameOver) return;

    if (e.key === 'ArrowDown') {
        if (isFastFalling) {
            isFastFalling = false;
            resetGameInterval(); // Revert to normal speed
        }
    }
});

// Function to check for words horizontally and vertically
function checkWords() {
    let wordsFound = [];

    // Check horizontal words
    for (let r = 0; r < ROWS; r++) {
        let currentRowLetters = '';
        let currentWordCells = [];
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== '') {
                currentRowLetters += board[r][c].letter;
                currentWordCells.push({ r, c });
            } else {
                // Word break or empty cell
                if (currentRowLetters.length > 1 && dictionary.has(currentRowLetters)) {
                    wordsFound.push({ word: currentRowLetters, cells: [...currentWordCells] });
                }
                currentRowLetters = '';
                currentWordCells = [];
            }
        }
        // Check for word at the end of the row
        if (currentRowLetters.length > 1 && dictionary.has(currentRowLetters)) {
            wordsFound.push({ word: currentRowLetters, cells: [...currentWordCells] });
        }
    }

    // Check vertical words
    for (let c = 0; c < COLS; c++) {
        let currentColLetters = '';
        let currentWordCells = [];
        for (let r = 0; r < ROWS; r++) {
            if (board[r][c] !== '') {
                currentColLetters += board[r][c].letter;
                currentWordCells.push({ r, c });
            } else {
                // Word break or empty cell
                if (currentColLetters.length > 1 && dictionary.has(currentColLetters)) {
                    wordsFound.push({ word: currentColLetters, cells: [...currentWordCells] });
                }
                currentColLetters = '';
                currentWordCells = [];
            }
        }
        // Check for word at the end of the column
        if (currentColLetters.length > 1 && dictionary.has(currentColLetters)) {
            wordsFound.push({ word: currentColLetters, cells: [...currentWordCells] });
        }
    }

    if (wordsFound.length > 0) {
        processWords(wordsFound);
    }
}

// Function to process found words (clear cells, update score, apply gravity)
function processWords(words) {
    let cellsToClear = new Set();
    let totalScoreIncrease = 0;

    words.forEach(wordObj => {
        totalScoreIncrease += wordObj.word.length * 10; // Score proportional to word length
        wordObj.cells.forEach(cell => {
            cellsToClear.add(`${cell.r},${cell.c}`); // Use a string key for Set
        });
    });

    score += totalScoreIncrease;

    // Clear cells on the board
    cellsToClear.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        board[r][c] = '';
    });

    // Apply gravity to blocks above cleared cells
    applyGravity();

    draw(); // Redraw the board after changes
}

// Function to apply gravity (blocks fall down after a word is cleared)
function applyGravity() {
    for (let c = 0; c < COLS; c++) {
        let emptySpots = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][c] === '') {
                emptySpots++;
            } else if (emptySpots > 0) {
                // Move block down to the first empty spot
                board[r + emptySpots][c] = board[r][c];
                board[r][c] = '';
            }
        }
    }
}

// Function to end the game
function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    clearTimeout(newBlockTimeout);
    gameOverMessage.classList.remove('hidden');
    startButton.textContent = 'Play Again';
    startButton.classList.remove('bg-green-600', 'hover:bg-green-700');
    startButton.classList.add('bg-blue-600', 'hover:bg-blue-700'); // Change button color for replay
}

// Function to start or restart the game
function startGame() {
    initBoard();
    score = 0;
    gameOver = false;
    gameOverMessage.classList.add('hidden');
    startButton.textContent = 'Start Game';
    startButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    startButton.classList.add('bg-green-600', 'hover:bg-green-700');
    isFastFalling = false;

    if (gameInterval) clearInterval(gameInterval);
    if (newBlockTimeout) clearTimeout(newBlockTimeout);

    if (!createBlock()) { // Try to create the first block
        endGame(); // If creation fails (shouldn't happen at start), end game
    }
    resetGameInterval(); // Start the game loop
    draw(); // Initial draw
}

// Event listener for the start button
startButton.addEventListener('click', startGame);

// Initial draw when the page loads
draw();
