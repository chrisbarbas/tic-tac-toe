//player factory function
const playerFactory = (name) => {
    const winMessage = () => `${name} has won!`;
    const marker = '';
    return {
        name,
        marker,
        winMessage
    };
};
const player = playerFactory('Player');
const computer = playerFactory('Computer');


let difficulty = '';
//settings module pattern - determines markers and difficulty
const settings = (() => {
    const xBtn = document.querySelector('.x-button');
    xBtn.addEventListener('click', () => setPlayers('x'));
    const oBtn = document.querySelector('.o-button');
    oBtn.addEventListener('click', () => setPlayers('o'));

    const setPlayers = (marker) => {
        if (marker == 'x' || marker == undefined) {
            player.marker = 'x';
            computer.marker = 'o';
            xBtn.id = 'selected';
            oBtn.id = '';
            gameBoard.reset();
        } else if (marker == 'o') {
            player.marker = 'o';
            computer.marker = 'x'
            xBtn.id = '';
            oBtn.id = 'selected';
            gameBoard.reset();
        }
    }
    const easyBtn = document.querySelector('.easy');
    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    const hardBtn = document.querySelector('.hard');
    hardBtn.addEventListener('click', () => setDifficulty('hard'));

    const setDifficulty = (dif) => {
        if (dif == 'easy' || dif == undefined) {
            difficulty = 'easy';
            easyBtn.id = 'selected';
            hardBtn.id = '';
            gameBoard.reset();
        } else {
            difficulty = 'hard';
            easyBtn.id = '';
            hardBtn.id = 'selected';
            gameBoard.reset();
        }
    }
    return {
        setPlayers,
        setDifficulty
    };
})();

//gameBoard module pattern
const gameBoard = (() => {
    let array = ['', '', '', '', '', '', '', '', ''];
    let gameOver = false;
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

    //when player clicks on any of the 9 spans
    const playerMove = (e) => {
        let item = e.target;
        let spanIndex = item.dataset.index;
        if (!gameOver && array[spanIndex] == '') {
            array.splice(spanIndex, 1, player.marker);
            displayController.updatePlayerDisplay(item, player.marker);
            checkWinner(winConditions);
            if (!gameOver) {
                computerMove();
                checkWinner(winConditions);
            }
        }
    }

    //fires after playerMove() or after reset()
    const computerMove = () => {
        //filter array for remaining spots available
        const a = array.map((e, i) => e === '' ? i : '').filter(String);
        //select an element out of filtered array
        let el = '';
        if (difficulty === '' || difficulty == 'easy') {
            //if 0 and 1 are taken by the same marker, and 2 is empty, take 2
            if (checkFor(a, 0, 1, 2)) el = 2;
            else if (checkFor(a, 1, 2, 0)) el = 0;
            else if (checkFor(a, 4, 5, 3)) el = 3;
            else if (checkFor(a, 3, 6, 0)) el = 0;
            else if (checkFor(a, 1, 7, 4)) el = 4;
            else if (checkFor(a, 2, 5, 8)) el = 8;
            else if (checkFor(a, 0, 4, 8)) el = 8;
            else if (checkFor(a, 2, 4, 6)) el = 6;
            else el = a[Math.floor(Math.random() * a.length)];

            array.splice(el, 1, computer.marker);
            displayController.updateCompDisplay(el, computer.marker);
        } else if (difficulty === 'hard') {
            if (checkFor(a, 0, 1, 2)) el = 2;
            else if (checkFor(a, 1, 2, 0)) el = 0;
            else if (checkFor(a, 3, 5, 4)) el = 4;
            else if (checkFor(a, 4, 5, 3)) el = 3;
            else if (checkFor(a, 7, 8, 6)) el = 6;
            else if (checkFor(a, 6, 8, 7)) el = 7;
            else if (checkFor(a, 3, 6, 0)) el = 0;
            else if (checkFor(a, 0, 6, 3)) el = 3;
            else if (checkFor(a, 1, 7, 4)) el = 4;
            else if (checkFor(a, 4, 7, 1)) el = 1;
            else if (checkFor(a, 2, 5, 8)) el = 8;
            else if (checkFor(a, 8, 5, 2)) el = 2;
            else if (checkFor(a, 0, 4, 8)) el = 8;
            else if (checkFor(a, 8, 4, 0)) el = 0;
            else if (checkFor(a, 2, 4, 6)) el = 6;
            else if (checkFor(a, 6, 4, 2)) el = 2;
            else el = a[Math.floor(Math.random() * a.length)];

            array.splice(el, 1, computer.marker);
            displayController.updateCompDisplay(el, computer.marker);
        }
    }

    function checkFor(a, x, y, z) {
        if ((array[x] == 'x' && array[y] == 'x') || (array[x] == 'o' && array[y] == 'o')) {
            if (a.includes(z)) {
                return true;
            }
        }
    }

    function checkWinner(winArray) {
        winArray.forEach((sub) => {
            let pCount = 0; //player wins if player gets to 3
            let cCount = 0; //computer wins if gets to 3
            sub.forEach((elem) => {
                if (array[elem] === player.marker) {
                    pCount++;
                    if (pCount == 3) {
                        gameOver = true;
                        displayController.updateWinner(player.winMessage());
                    }
                } else if (array[elem] === computer.marker) {
                    cCount++;
                    if (cCount == 3) {
                        gameOver = true;
                        displayController.updateWinner(computer.winMessage());
                    }
                }
            });
        });
        //draw
        if (!array.includes('') && (!gameOver)) {
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
        if (computer.marker === 'x') {
            computerMove();
        }
    }
    return {
        array,
        playerMove,
        checkFor,
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
        index.style.animation = "span 0.2s ease-in";
        index.textContent = marker;
    }

    const updateCompDisplay = (index, marker) => {
        setTimeout(function () {
            const user = document.querySelector("#index" + index)
            user.style.animation = "span 0.2s ease-in";
            user.textContent = marker;
        }, 700);
    }

    const clearDisplay = () => {
        const spans = document.querySelectorAll('span');
        for (i of spans) {
            i.textContent = '';
        }
        winnerText.textContent = '';
    }
    const updateWinner = (text) => {
        setTimeout(function () {
            winnerText.textContent = text;
        }, 800);
    }
    return {
        createDisplay,
        updatePlayerDisplay,
        updateCompDisplay,
        clearDisplay,
        updateWinner
    };
})();

settings.setPlayers();
settings.setDifficulty();
displayController.createDisplay();