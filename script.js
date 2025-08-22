document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const numberPalette = document.getElementById('number-palette');
    const newGameBtn = document.getElementById('new-game-btn');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');

    let board = [];
    let solution = [];
    let selectedCell = null;
    let difficulty = 'easy'; // Default difficulty

    const difficulties = {
        easy: 40,
        medium: 50,
        hard: 60
    };

    function generatePuzzle() {
        // Generate a full solution
        solution = generateSolution(createEmptyBoard());
        // Create a puzzle by removing cells
        board = createPuzzle(solution, difficulties[difficulty]);
        renderBoard();
    }

    function createEmptyBoard() {
        return Array(9).fill(0).map(() => Array(9).fill(0));
    }

    function generateSolution(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) {
            return board; // Solved
        }

        const [row, col] = emptyCell;
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (generateSolution(board)) {
                    return board;
                }
                board[row][col] = 0; // Backtrack
            }
        }
        return null;
    }

    function findEmptyCell(board) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) {
                    return [r, c];
                }
            }
        }
        return null;
    }

    function isValid(board, row, col, num, isCheckWin = false) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (isCheckWin && c === col) continue;
            if (board[row][c] === num) {
                return false;
            }
        }
        // Check column
        for (let r = 0; r < 9; r++) {
            if (isCheckWin && r === row) continue;
            if (board[r][col] === num) {
                return false;
            }
        }
        // Check 3x3 box
        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const a = boxRowStart + r;
                const b = boxColStart + c;
                if (isCheckWin && a === row && b === col) continue;
                if (board[a][b] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function createPuzzle(solution, cellsToRemove) {
        let puzzle = JSON.parse(JSON.stringify(solution)); // Deep copy
        let attempts = cellsToRemove;
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                attempts--;
            }
        }
        return puzzle;
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (board[r][c] !== 0) {
                    cell.textContent = board[r][c];
                    cell.classList.add('pre-filled');
                } else {
                    cell.addEventListener('click', () => {
                        if (selectedCell) {
                            selectedCell.classList.remove('selected');
                        }
                        selectedCell = cell;
                        selectedCell.classList.add('selected');
                    });
                }
                rowDiv.appendChild(cell);
            }
            boardElement.appendChild(rowDiv);
        }
    }

    function setupNumberPalette() {
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.addEventListener('click', () => {
                if (selectedCell && !selectedCell.classList.contains('pre-filled')) {
                    const row = selectedCell.dataset.row;
                    const col = selectedCell.dataset.col;
                    const num = parseInt(btn.textContent);

                    if (isValid(board, parseInt(row), parseInt(col), num)) {
                        board[row][col] = num;
                        selectedCell.textContent = num;
                        selectedCell.classList.remove('selected', 'incorrect');
                        selectedCell.classList.add('correct');
                        if(checkWin()) {
                            alert('You won!');
                        }
                    } else {
                        selectedCell.textContent = num;
                        selectedCell.classList.add('incorrect');
                    }
                }
            });
            numberPalette.appendChild(btn);
        }
    }

    function checkWin() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0 || !isValid(board, r, c, board[r][c], true)) {
                    return false;
                }
            }
        }
        return true;
    }


    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    newGameBtn.addEventListener('click', generatePuzzle);

    easyBtn.addEventListener('click', () => {
        difficulty = 'easy';
        setActiveDifficulty(easyBtn);
        generatePuzzle();
    });

    mediumBtn.addEventListener('click', () => {
        difficulty = 'medium';
        setActiveDifficulty(mediumBtn);
        generatePuzzle();
    });

    hardBtn.addEventListener('click', () => {
        difficulty = 'hard';
        setActiveDifficulty(hardBtn);
        generatePuzzle();
    });

    function setActiveDifficulty(activeButton) {
        [easyBtn, mediumBtn, hardBtn].forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }


    // Initial setup
    setActiveDifficulty(easyBtn);
    setupNumberPalette();
    generatePuzzle();
});
