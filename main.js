// alert("main.js linked");

gameBoard = (function createGameBoard (_rows, _columns) {
    /* 
        Abstraction: (rows) by (columns) game board. 
        Representation Invariant: 
            board is an Array with correct number of rows and columns
    */

    let _board = [];
    const _debug = true;

    for (let i = 0; i < _rows; i++){
        _board.push([]);
        for (let j = 0; j < _columns; j++){
            _board[i].push("");
        }
        
    }

    const checkRepInv = () => {
        // Checks if the representation invariant is held, and prints findings to the console.
        if (_rows < 0 || _columns < 0) {
            console.warn("rows or columns negative");
        }
        if (_board.length != _rows) {
            console.warn("board's number of rows does not match rows variable");
        }
        for(let i = 0; i < _rows; i++){
            if (_board[i].length != _columns) {
                console.warn(`the board's ${i+1}th row does not match with columns variable`);
            }
        }
        return console.log("Representation Invariant held");
    }

    const printBoard = () => {
        // Prints the board to the console
        for(let i = 0; i < _rows; i++){
            let rowStr = ""
            for(let j = 0; j < _columns; j++){
                rowStr += _board[i][j];
                if (debug) rowStr += ` (${i},${j})`;
                rowStr += "\t";
            }
            console.log(rowStr + "\n");
        }
    }

    return {printBoard, checkRepInv};
})(3, 3);