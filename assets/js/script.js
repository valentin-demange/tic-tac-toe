'use strict'

const Player = (sign) => {

    this.sign = sign;

    const getSign = () => {return sign};

    return {getSign}
}

const gameBoard = (() => {
    let state = Array(9);

    const reset = () => {
        state = Array(9);
    }

    const getState = () => {
        return state
    }

    const setField = (fieldIndex, value) => {
        state[fieldIndex] = value;
    }

    const getField = (fieldIndex) => {
        return state[fieldIndex];
    }

    const isFieldEmpty = (fieldIndex) => {
        return (state[fieldIndex] == "" || state[fieldIndex] == undefined);
    }

    const getPlayerFields = (playerSign) => {
        return state == playerSign;
    }

    return {reset, setField, getField, isFieldEmpty, getPlayerFields, getState}
    
})()

const gameController = (() => {
    
    const player0 = Player("O");
    const playerX = Player("X");
    let isOver = false;
    let currentPlayerSign = "X";
    let round = 0;

    const reset = () => {
        // Reset
        gameBoard.reset();
        isOver = false;
        currentPlayerSign = "X";
        round = 0;
        displayController.setText(`Joueur ${currentPlayerSign}, à ton tour`);
    }

    const humanPlayRound = (fieldIndex) => {

        round += 1;

        // If cell is already taken or party is over, do nothing
        if (!gameBoard.isFieldEmpty(fieldIndex) || isOver) {
            return
        }
        
        // Play the round
        gameBoard.setField(fieldIndex, currentPlayerSign);
        displayController.setCell(fieldIndex, currentPlayerSign);

        // If round is over, we display the winner
        if (checkWinner(fieldIndex)) {
            displayController.setText(`Le joueur ${currentPlayerSign} remporte la partie !`)
            isOver = true;
            return
        }

        // If round = 9 and no winner, it is a draw
        if (round == 9) {
            displayController.setText("Egalité !")
            isOver = true;
            return
        }

        // Update of currentPlayerSign
        currentPlayerSign = (currentPlayerSign == "X" ? "O" : "X");
        displayController.setText(`Joueur ${currentPlayerSign}, à ton tour`);

    }

    const checkWinner = (fieldIndex) => {
        const winningPattern = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [0, 4, 8],
        ];

    return winningPattern
    .filter((combination) => combination.includes(fieldIndex))
    .some((possibleCombination) => 
    possibleCombination.every((fieldIndex) => 
    gameBoard.getField(fieldIndex) === currentPlayerSign
    ));

    }


    return {reset, humanPlayRound}
})();

const displayController = (() => {
    const textElement = document.querySelector("#main-text");
    const restartButton = document.querySelector(".button");
    const cellElements = document.querySelectorAll(".cell")

    restartButton.addEventListener("click", () => {
        gameController.reset();
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].textContent = "";
        }
    })

    cellElements.forEach((cell) => 
        cell.addEventListener("click", (e) => {
            let cellId = e.target.id;
            let fieldIndex = parseInt(cellId[cellId.length-1]);
            gameController.humanPlayRound(fieldIndex);
        }
        )
    )

    const setText = (stringToDisplay) => {
        textElement.textContent = stringToDisplay;
    }

    const setCell = (fieldIndex, string) => {
        cellElements[fieldIndex].textContent = string;
    }

    return {setText, setCell}
}
)();

