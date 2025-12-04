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
    const getPiece = () => _piece.slice(0);

    return {getName, setName, getPiece, checkRepInv};
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
            let logStr = "\t" + `${_players[i].getName()} (piece: ${_players[i].getPiece()})`;
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
console.log({isGameRunning: gameEngine.isGameRunning()});
gameBoard.checkRepInv();
gameBoard.printBoard();

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
