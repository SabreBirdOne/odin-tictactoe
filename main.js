// alert("main.js linked");

let LOGGING = false;

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
        if (!inBounds && LOGGING) console.warn(`${i}, ${j} are not in bounds of dimensions ${_rows} rows x ${_columns} columns`)
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
    const advancePlayerTurn = () => {
        // if player turn is not on the last player, advance player turn by 1. otherwise loop back to 0.
        if (_playerTurn < Math.max(0, _players.length) - 1) _playerTurn++;
        else _playerTurn = 0;
    };
    
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
    const isBoardFilled = () => {
        // returns true if the board has no "falsy" cells.
        const boardDims = _board.getDimensions();
        for (let i = 0; i < boardDims.rows; i++) {
            for (let j = 0; j < boardDims.columns; j++) {
                if (_board.getPiece(i, j)) {
                    return false;
                }
            }
        }
        return true;
    };

    const placePieceForCurrentPlayerAt = (i, j) => {
        /* 
            If given position (i, j) is an empty cell, place a piece of the current player onto it 
            and advance the turn.
        */
        if (!_board.getPiece(i, j) && _players.length > 0 && _isRun){
            _board.setPiece(i, j, _players[_playerTurn].getPlayerPiece());
            advancePlayerTurn();
        }
    };

    const getWinningPattern = () => {
        /* 
            RETURNS: an object containing a description of the winning pattern:
                winningPiece: the piece in the pattern
                winningX and winningY: the initial location on the board where the pattern starts
                direction: the direction of the winning pattern from winning X and Y.
                    example: "row" means enough of the same pieces in the row direction is on the board
                    directions checked: "row", "column", "diagonal down right", "diagonal down left"
                _piecesToWin: a copy of _piecesToWin
                
                if no winning pattern is found, all properties of the returned object is null.
        */

        let winningPiece = null;
        let winningX = null;
        let winningY = null;
        let direction = null;
        let piecesToWin = _piecesToWin;
        let {rows, columns} = _board.getDimensions();
        outer: for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                if (_board.getPiece(i,j)){
                    let pieces_in_row = []; 
                    let pieces_in_column = [];  
                    let pieces_in_backslash = []; // pieces in the \ direction
                    let pieces_in_slash = []; // pieces in the / direction
                    for (let k = 0; k < piecesToWin; k++){
                        if (_board.isInBounds(i, j + k)){
                            pieces_in_row.push(_board.getPiece(i, j + k));
                        }
                        if (_board.isInBounds(i + k, j)){
                            pieces_in_column.push(_board.getPiece(i + k, j));
                        }
                        if (_board.isInBounds(i + k, j + k)){
                            pieces_in_backslash.push(_board.getPiece(i + k, j + k));
                        }
                        if (_board.isInBounds(i + k, j - k)){
                            pieces_in_slash.push(_board.getPiece(i + k, j - k));
                        }
                    };
                    if (pieces_in_row.length === piecesToWin 
                        && pieces_in_row.every((element) => element === pieces_in_row[0])){
                        winningPiece = pieces_in_row[0];
                        winningX = i;
                        winningY = j;
                        direction = "row";
                    }
                    else if (pieces_in_column.length === piecesToWin 
                        && pieces_in_column.every((element) => element === pieces_in_column[0])){
                        winningPiece = pieces_in_column[0];
                        winningX = i;
                        winningY = j;
                        direction = "column";
                    }
                    else if (pieces_in_backslash.length === piecesToWin 
                        && pieces_in_backslash.every((element) => element === pieces_in_backslash[0])){
                        winningPiece = pieces_in_backslash[0];
                        winningX = i;
                        winningY = j;
                        direction = "diagonal down right";
                    }
                    else if (pieces_in_slash.length === piecesToWin 
                        && pieces_in_slash.every((element) => element === pieces_in_slash[0])){
                        winningPiece = pieces_in_slash[0];
                        winningX = i;
                        winningY = j;
                        direction = "diagonal down left";
                    }
                }
                if (winningPiece) break outer;
            }
        }
        
        return {winningPiece, winningX, winningY, direction, piecesToWin};
    };
    

    return {
        addPlayer, 
        resetPlayerTurn, 
        advancePlayerTurn,
        printPlayerLog, 
        isGameRunning, 
        toggleRunGame, 
        isBoardFilled, 
        placePieceForCurrentPlayerAt,
        getWinningPattern,
        checkRepInv
    };
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

console.log("\t## Player turn test")
gameEngine.resetPlayerTurn();
gameEngine.printPlayerLog();

gameEngine.advancePlayerTurn();
gameEngine.printPlayerLog();

gameEngine.advancePlayerTurn();
gameEngine.printPlayerLog();
gameEngine.checkRepInv();

console.log("isBoardFilled: " + gameEngine.isBoardFilled().toString());

console.log("\n\n\t#######################################\n\t## Test placing pieces with gameEngine");

gameBoard.printBoard();
if(!gameEngine.isGameRunning()) gameEngine.toggleRunGame();

moves = [
    [0,1], // X
    [0,0], // X
    [0,0], // O
    [0,2], // O
    [1,1], // X
    [1,2], // O
    [2,1], // X, wins
]
for (move of moves){
    gameEngine.printPlayerLog();
    console.log(`Placing piece for current player at ${move[0]},${move[1]}`);
    gameEngine.placePieceForCurrentPlayerAt(move[0], move[1]);
    gameBoard.printBoard();
}

console.log(gameEngine.getWinningPattern());