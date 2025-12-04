// alert("main.js linked");

let gameBoard = (function createGameBoard (_rows, _columns) {
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
        let repInvHeld = true;
        if (_rows < 0 || _columns < 0) {
            console.warn("rows or columns negative");
            repInvHeld = false;
        }
        if (_board.length != _rows) {
            console.warn("board's number of rows does not match rows variable");
            repInvHeld = false;
        }
        for(let i = 0; i < _rows; i++){
            if (_board[i].length != _columns) {
                console.warn(`the board's ${i+1}th row does not match with columns variable`);
                repInvHeld = false;
            }
        }
        
        if (repInvHeld) console.log("Representation Invariant held");
    }

    const printBoard = () => {
        // Prints the board to the console
        for(let i = 0; i < _rows; i++){
            let rowStr = ""
            for(let j = 0; j < _columns; j++){
                rowStr += _board[i][j];
                if (_debug) rowStr += ` (${i},${j})`;
                rowStr += "\t";
            }
            console.log(rowStr + "\n");
        }
    }

    return {printBoard, checkRepInv};
})(3, 3);

let playerFactory = function createPlayer (_piece, _name = "anonymous") {
    /* 
        Abstraction:
            piece is the piece that the player will place on the board
            name is the player name
        Representation Invariant:
            name and piece are strings
    */

    const checkRepInv = () => {
        // Checks if the representation invariant is held, and prints findings to the console.
        let repInvHeld = true;
        if (!(typeof(_name) === "string" && typeof(_piece) === "string")){
            console.warn("player name or piece are not instances of strings");
            repInvHeld = false;
        }
        if (repInvHeld) console.log("Representation Invariant held");
    }

    const getName = () => _name.slice(0);
    const setName = (newName) => _name = newName;
    const getPiece = () => _piece.slice(0);

    return {getName, setName, getPiece, checkRepInv};
}

let playerX = playerFactory("X");
let playerO = playerFactory("O", "Omega");

gameBoard.checkRepInv();
gameBoard.printBoard();

for (player of [playerX, playerO]){
    player.checkRepInv();
    console.log(player.getName());
    console.log(player.getPiece());
}

playerX.setName("Xavier");
playerO.setName("Olivia");

for (player of [playerX, playerO]){
    player.checkRepInv();
    console.log(player.getName());
    console.log(player.getPiece());
}