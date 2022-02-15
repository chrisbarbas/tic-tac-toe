//player factory function
const playerFactory = (name) => {
    const winMessage = () => `${name} has won!`;
    return {
        name,
        winMessage,
    };
};

const player = playerFactory('Player');
const computer = playerFactory('Computer');

//gameBoard module pattern
const gameBoard = (() => {
    let playerX = player;
    let playerO = computer;

    const gameSettings = (marker) => {
        if (marker === 'x' || marker == undefined) {
            playerX = player;
            playerO = computer;
            reset();
        } else {
            playerX = computer;
            playerO = player;
            reset();
        }
    }
    const xBtn = document.querySelector('.x-button');
    xBtn.addEventListener('click', () => gameSettings('x'));
    const oBtn = document.querySelector('.o-button');
    oBtn.addEventListener('click', () => gameSettings('o'));
    const easyBtn = document.querySelector('.easy');
    easyBtn.addEventListener('click', () => reset());
    const hardBtn = document.querySelector('.hard');
    hardBtn.addEventListener('click', () => reset());








    let array = ['', '', '', '', '', '', '', '', ''];
    let gameOver = false;
    const playerMove = (e) => {
        console.log(playerX.name);
        let item = e.target;
        let spanIndex = item.dataset.index;
        if (!gameOver && array[spanIndex] == '') {
            array.splice(spanIndex, 1, 'x');
            displayController.updatePlayerDisplay(item, 'x');
            checkWinner(winConditions);
            if (!gameOver) {
                computerMove();
            }
        }
    };
    const computerMove = () => {
        const filteredArray = array.map((e, i) => e === '' ? i : '').filter(String);
        const randomElement = filteredArray[Math.floor(Math.random() * filteredArray.length)];
        array.splice(randomElement, 1, 'o');
        displayController.updateCompDisplay(randomElement, 'o');
        checkWinner(winConditions);
    }
    const winConditions = [
        //rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //diagonal 
        [0, 4, 8],
        [2, 4, 6]
    ]

    function checkWinner(winArray) {
        winArray.forEach((sub) => {
            let p1Count = 0;
            let p2Count = 0;
            sub.forEach((elem) => {
                if (array[elem] === 'x') {
                    p1Count++;
                    if (p1Count == 3) {
                        gameOver = true;
                        displayController.updateWinner('Player has won!');
                    }
                } else if (array[elem] === 'o') {
                    p2Count++;
                    if (p2Count == 3) {
                        gameOver = true;
                        displayController.updateWinner('Computer has won!');
                    }
                }
            });
        });
        if (!array.includes('')) {
            gameOver = true;
            displayController.updateWinner('Draw!');
        }
    }
    const resetBtn = document.querySelector('.reset');
    resetBtn.addEventListener('click', () => reset());

    function reset() {
        array = ['', '', '', '', '', '', '', '', ''];
        displayController.clearDisplay();
        gameOver = false;
    }
    return {
        array,
        playerMove,
        reset
    };
})();

//displayController module pattern
const displayController = (() => {
    const board = document.querySelector('.game-board');
    const winnerText = document.querySelector('.winner-text');
    let idnumber = -1;
    const createDisplay = () => {
        gameBoard.array.forEach((item, index) => {
            const span = document.createElement('span');
            idnumber++;
            span.dataset.index = index;
            span.setAttribute('id', 'index' + idnumber)
            span.addEventListener('click', gameBoard.playerMove);
            span.className = 'game-square';
            span.textContent = item;
            board.appendChild(span);
        });
    }
    const updatePlayerDisplay = (index, marker) => {
        index.textContent = marker;
    }

    const updateCompDisplay = (index, marker) => {
        const user = document.querySelector("#index" + index)
        user.textContent = marker;
    }

    const clearDisplay = () => {
        const spans = document.querySelectorAll('span');
        for (i of spans) {
            i.textContent = '';
        }
        winnerText.textContent = '';
    }
    const updateWinner = (text) => {
        winnerText.textContent = text;
    }
    return {
        createDisplay,
        updatePlayerDisplay,
        updateCompDisplay,
        clearDisplay,
        updateWinner
    };
})();

displayController.createDisplay();