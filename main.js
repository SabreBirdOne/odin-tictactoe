// alert("main.js linked");

gameBoard = (function createGameBoard (rows, columns) {
    /* 
        Abstraction: (rows) by (columns) game board. 
        Representation Invariant: 
            board is an Array with correct number of rows and columns
            each cell on the board must be a valid piece "", "X", or "O"
    */

    let board = [];
    const validPieces = ["", "X", "O"];
    const debug = true;

    for (let i = 0; i < rows; i++){
        board.push([]);
        for (let j = 0; j < columns; j++){
            board[i].push("");
        }
        
    }

    const checkRepInv = () => {
        // Checks if the representation invariant is held, and prints findings to the console.
        if (rows < 0 || columns < 0) {
            console.warn("rows or columns negative");
        }
        if (board.length != rows) {
            console.warn("board's number of rows does not match rows variable");
        }
        for(let i = 0; i < rows; i++){
            if (board[i].length != columns) {
                console.warn(`the board's ${i+1}th row does not match with columns variable`);
            }
            for(let j = 0; j < columns; j++){
                if (!validPieces.includes(board[i][j])) {
                    console.warn(`the cell at board[${i}][${j}] is not a valid piece: ${board[i][j]}`)
                }
            }
        }
        return console.log("Representation Invariant held");
    }

    const printBoard = () => {
        // Prints the board to the console
        for(let i = 0; i < rows; i++){
            let rowStr = ""
            for(let j = 0; j < columns; j++){
                rowStr += board[i][j];
                if (debug) rowStr += `(${i},${j})`;
                rowStr += "\t";
            }
            console.log(rowStr + "\n");
        }
    }

    return {printBoard, checkRepInv};
})(3, 3);