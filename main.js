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
    };

    const printBoard = () => {
        // Prints the board to the console
        for(let i = 0; i < _rows; i++){
            let rowStr = "";
            for(let j = 0; j < _columns; j++){
                rowStr += _board[i][j];
                if (_debug) rowStr += ` (${i},${j})`;
                rowStr += "\t";
            }
            console.log(rowStr + "\n");
        }
    };

    const getDimensions = () => {
        return {rows: _rows, columns: _columns};
    };

    const isInBounds = (i, j) => {
        // returns true if i and j are indices within rows and columns (start from 0)
        const inBounds = (0 <= i && i < _rows) && (0 <= j && j < _columns);
        if (!inBounds) console.warn(`${i}, ${j} are not in bounds of dimensions ${_rows} rows x ${_columns} columns`)
        return inBounds;
    }

    const getPiece = (i, j) => {
        // returns the piece string at the i-th row and j-th column (start from 0)
        if (isInBounds(i,j)) return _board[i][j].slice(0);
        else return "";
    }

    const setPiece = (i, j, newPiece) => {
        // if i and j are in the boundaries of the board, place the new piece at board[i][j]
        if (isInBounds(i,j)) _board[i][j] = newPiece.slice(0);
    }

    return {printBoard, getDimensions, isInBounds, getPiece, setPiece, checkRepInv};
})(3, 3);

let playerFactory = function createPlayer (_piece, _name = "anonymous") {
    /* 
        Abstraction:
            piece is the piece that the player will place on the board
            name is the player name. "anonymous" if not provided
        Representation Invariant:
            name and piece are strings
            piece cannot be a "falsy" value.
    */

    const checkRepInv = () => {
        // Checks if the representation invariant is held, and prints findings to the console.
        let repInvHeld = true;
        if (!(typeof(_name) === "string" && typeof(_piece) === "string")){
            console.warn(`player ${_name} with piece ${_piece}. These must be of type string`);
            repInvHeld = false;
        }
        if (!_piece) console.warn(`player piece (${_piece}). This cannot be a falsy value`);
        if (repInvHeld) console.log("Representation Invariant held");
    }

    const getName = () => _name.slice(0);
    const setName = (newName) => _name = newName;
    const getPlayerPiece = () => _piece.slice(0);

    return {getName, setName, getPlayerPiece, checkRepInv};
}

let gameEngine = (function createGame(_board, _piecesToWin) {
    /*
        Abstraction: 
            board refers to the singleton gameBoard
            players is a list of players in the game
            playerTurn marks the player turn of the game
            isRun indicates if the game is running or not.
                if the game is running, new players cannot be added.
            piecesToWin: number of pieces in a row or column to win.

        Representation Invariant:
            playerTurn must be in range [0, number of players - 1], like an array index.
            isRun is a boolean
            piecesToWin is a positive integer >= 2
    */
    let _players = [];
    let _playerTurn = 0;
    let _isRun = false;
    // _board, _piecesToWin passed in by IIFE

    const checkRepInv = () => {
        // Checks if the representation invariant is held, and prints findings to the console.
        let repInvHeld = true;
        if (!(0 <= _playerTurn && _playerTurn <= Math.max(0, _players.length))){
            console.log(`_playerTurn ${_playerTurn} not an index of players`);
            repInvHeld = false;
        }
        if (typeof(_isRun) != 'boolean'){
            console.log(`_isRun ${_isRun} is not a boolean`);
            repInvHeld = false;
        }
        if (!(_piecesToWin >= 2 && Number.isInteger(_piecesToWin))){
            console.log(`_piecesToWin ${_piecesToWin} is not positive integer >= 2`);
            repInvHeld = false;
        }

        if (repInvHeld) console.log("Representation Invariant held");
    }

    // player related functions
    const addPlayer = (player) => {
        if (!_isRun){
            _players.push(player);
        }
    }
    const resetPlayerTurn = () => _playerTurn = 0;
    
    const printPlayerLog = () => {
        console.log(`Current player turn: ${_playerTurn}`);
        console.log("Players:");
        for(let i = 0; i < _players.length; i++){
            let logStr = "\t" + `${_players[i].getName()} (piece: ${_players[i].getPlayerPiece()})`;
            if (i === _playerTurn) logStr += ' (current turn)';
            console.log(logStr);        
        }
    }   

    // game status related functions
    const isGameRunning = () => _isRun;
    const toggleRunGame = () => _isRun = !_isRun;

    // board related functions
    

    return {addPlayer, resetPlayerTurn, printPlayerLog, isGameRunning, toggleRunGame, checkRepInv};
}) (gameBoard, 3);

// TEST SUITE

console.log("\t## Testing gameBoard: getDimensions, getPiece, setPiece")
gameBoard.checkRepInv();
gameBoard.printBoard();
console.log(gameBoard.getDimensions());

let x = 0, y = 5;
console.log(`Piece at location ${x}, ${y}: ${gameBoard.getPiece(x,y)}`)

x = 0, y = 1;
console.log(`Piece at location ${x}, ${y}: ${gameBoard.getPiece(x,y)}`)

let newP = "X";
console.log(`Set new piece ${newP} at ${x}, ${y}`);
gameBoard.setPiece(x, y, newP);

console.log(`Piece at location ${x}, ${y}: ${gameBoard.getPiece(x,y)}`)
gameBoard.printBoard();

console.log("\t## Testing playerFactory");
let playerX = playerFactory("X");
let playerO = playerFactory("O", "Omega");

playerX.setName("Xavier");
playerO.setName("Olivia");

console.log("Testing isRun")
console.log({isGameRunning: gameEngine.isGameRunning()});
gameEngine.toggleRunGame();
console.log({isGameRunning: gameEngine.isGameRunning()});
gameEngine.checkRepInv();

console.log("\t## Adding a player while game is running. Should not be allowed by game engine");
gameEngine.addPlayer(playerX);
gameEngine.printPlayerLog();

console.log("\t## Stop the game from running and add 2 players.")
gameEngine.toggleRunGame();
gameEngine.addPlayer(playerX);
gameEngine.addPlayer(playerO);
gameEngine.printPlayerLog();
console.log({isGameRunning: gameEngine.isGameRunning()});

console.log("\t## Reset player turn test")
gameEngine.resetPlayerTurn();
gameEngine.printPlayerLog();
gameEngine.checkRepInv();
