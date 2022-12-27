import JSConfetti from 'js-confetti'
const confetti = new JSConfetti();

interface ITile {
    content: "X" | "O" | "";
};

interface IRow {
    content: [ITile, ITile, ITile] | [];
};

interface IBoard {
    content: [IRow, IRow, IRow] | [];
};

interface IGame {
    board: IBoard;
    turn: "X" | "O";
};

const game: IGame = {
    board: {
        content: [],
    },
    turn: "X",
};

// fill the board with empty tiles using a nested loop
for (let i = 0; i < 3; i++) {
    game.board.content[i] = { content: [] };
    for (let j = 0; j < 3; j++) {
        game.board.content[i].content[j] = {
            content: "",
        }
    }
}

document.querySelectorAll(".item").forEach((item, index) => {
    item.addEventListener("click", () => {
        // get the row and column of the clicked tile
        const row = Math.floor(index / 3);
        const col = index % 3;

        // check if the tile is empty
        if (game.board.content[row].content[col].content === "") {
            // set the tile content to the current turn
            game.board.content[row].content[col].content = game.turn;

            // update the tile's text
            item.textContent = game.turn;

            // change the turn
            game.turn = game.turn === "X" ? "O" : "X";
            document.querySelector("#turn")!.textContent = game.turn + " turn";
            const winner = checkWin();
            if (winner) {
                document.querySelector("#turn")!.textContent = winner + " won!";
                setTimeout(() => {
                    reset();
                    confetti.addConfetti();
                }, 1000);
            } else {
                if (checkDraw()) {
                    document.querySelector("#turn")!.textContent = "Draw!";
                    setTimeout(() => {
                        reset();
                    }, 1000);
                }
            }
        }
    }, true);
});

function reset(): void {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            game.board.content[i].content[j].content = "";
        }
    }
    document.querySelectorAll(".item").forEach((item) => {
        // animate the tiles to fade out
        item.classList.add("fade-out");
        setTimeout(() => {
            // remove the fade out class
            item.classList.remove("fade-out");
            // set the text to empty
            item.textContent = "";
        }, 1000);
    });
    document.querySelector("#turn")!.textContent = game.turn + " turn";
}

/*
    0 1 2
    3 4 5
    6 7 8
*/
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const checkWin = (board: IBoard = game.board): ("X" | "O" | "") | null => {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (
            board.content[Math.floor(a / 3)].content[a % 3].content !== "" &&
            board.content[Math.floor(a / 3)].content[a % 3].content ===
            board.content[Math.floor(b / 3)].content[b % 3].content &&
            board.content[Math.floor(a / 3)].content[a % 3].content ===
            board.content[Math.floor(c / 3)].content[c % 3].content
        ) return board.content[Math.floor(a / 3)].content[a % 3].content;
    }
    return null;
}

// check if the game is a draw
const checkDraw = (board: IBoard = game.board): boolean => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.content[i].content[j].content === "") return false;
        }
    }
    return true;
}

export default game;
