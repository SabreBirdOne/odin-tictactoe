// alert("main.js linked");

let LOGGING = false;

let gameBoard = (function createGameBoard (_rows, _columns) {
    /* 
        Abstraction: (rows) by (columns) game board. 
        Representation Invariant: 
            board is an Array with correct number of rows and columns
    */

    let _board = [];

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

    const getBoardAsString = () => {
        // Returns a string of the board
        let retStr = "\t";
        for (let j = 0; j < _columns; j++){
            retStr += j + "\t";
        }
        retStr += "\n";

        for (let i = 0; i < _rows; i++){
            let rowStr = `${i}\t`;
            for (let j = 0; j < _columns; j++){
                rowStr += _board[i][j];
                rowStr += "\t";
            }
            retStr += rowStr + "\n";
        }
        return retStr;
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

    const wipeBoard = () => {
        _board = [];

        for (let i = 0; i < _rows; i++){
            _board.push([]);
            for (let j = 0; j < _columns; j++){
                _board[i].push("");
            }  
        }
    }

    return {getBoardAsString, getDimensions, isInBounds, getPiece, setPiece, wipeBoard, checkRepInv};
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

            to restart game, gameBoard.wipeBoard and gameEngine.resetPlayerTurn

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
            console.warn(`_playerTurn ${_playerTurn} not an index of players`);
            repInvHeld = false;
        }
        if (typeof(_isRun) != 'boolean'){
            console.warn(`_isRun ${_isRun} is not a boolean`);
            repInvHeld = false;
        }
        if (!(_piecesToWin >= 2 && Number.isInteger(_piecesToWin))){
            console.warn(`_piecesToWin ${_piecesToWin} is not positive integer >= 2`);
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

    const getPlayerFromPiece = (piece) => {
        /* 
            PARAMETERS: piece: a string representing any piece on the board.
            RETURNS: an object describing the player
                player: a reference of the player (!!!)
                playerNumber: the position where the player was added (example: 2nd player is 2)
        */
        let playerIndex = _players.findIndex((player) => player.getPlayerPiece() === piece);
        let playerNumber = playerIndex + 1;
        let player = _players[playerIndex];
        return {player, playerNumber};
    }
    
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
                if (!_board.getPiece(i, j)) {
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
        getPlayerFromPiece,
        printPlayerLog, 
        
        isGameRunning, 
        toggleRunGame, 
        
        isBoardFilled, 
        placePieceForCurrentPlayerAt,
        getWinningPattern,

        checkRepInv
    };
}) (gameBoard, 3);

let displayController = (function createDisplayController (_body){
    /* 
    Abstraction: 
        body: a query selector referring to the HTML <body> element
        _gameBoardDiv: the div element on the webpage displaying the game board
        _boardDimensions: the rows x columns dimensions of the game board
        _resultsPanel: the div element on the webpage displaying game results
    */  

    _restartButton = document.createElement("button");
    _restartButton.id = "restartButton";
    _restartButton.textContent = "RESTART";

    _restartButton.addEventListener("click", (event) => {
        gameBoard.wipeBoard();
        updateGameBoardDiv();
        gameEngine.resetPlayerTurn();
    });

    _body.appendChild(_restartButton);

    // Initializing game board
    _boardDimensions = gameBoard.getDimensions();
    let _gameBoardDiv = document.createElement("div");
    _gameBoardDiv.id = "gameBoard";

    for (let i = 0; i < _boardDimensions.rows; i++){
        let boardRow = document.createElement("div");
        boardRow.classList = "boardRow";
        boardRow.dataset.row = i;

        for (let j = 0; j < _boardDimensions.columns; j++){
            let cell = document.createElement("button");
            cell.classList = "cell";
            cell.textContent = " ";
            cell.dataset.row = i;
            cell.dataset.column = j;

            // Event handling to update game board when each cell button is pressed.
            cell.addEventListener("click", (event) => {
                gameEngine.placePieceForCurrentPlayerAt(
                    cell.dataset.row,
                    cell.dataset.column
                );
                cell.textContent = gameBoard.getPiece(i, j);
                
                // Check for win condition
                addLineToResultsPanel(getResults());
            })

            boardRow.appendChild(cell);
        }

        _gameBoardDiv.appendChild(boardRow);
    }
    
    _body.appendChild(_gameBoardDiv);

    _resultsPanel = document.createElement("div");
    _resultsPanel.id = "resultsPanel";
    
    resultsPanelHeader = document.createElement("h2");
    resultsPanelHeader.textContent = "Results";
    _resultsPanel.appendChild(resultsPanelHeader);

    _body.appendChild(_resultsPanel);

    const updateGameBoardDiv = function (){
        // Updates the game board div by pulling data from the gameBoard.
        for (let i = 0; i < _boardDimensions.rows; i++){
            let boardRow = _gameBoardDiv.querySelector(`.boardRow[data-row="${i}"]`);
            for (let j = 0; j < _boardDimensions.columns; j++){
                let cell_ij = boardRow.querySelector(`.cell[data-row="${i}"][data-column="${j}"]`);
                cell_ij.textContent = gameBoard.getPiece(i, j);
            }
        }
    }

    const getResults = function () {
        // Checks the gameEngine and returns a string indicating a win, a tie, or else an empty string.
        let winningPattern = gameEngine.getWinningPattern();
        let winner = gameEngine.getPlayerFromPiece(winningPattern.winningPiece);

        if (!winningPattern.winningPiece && gameEngine.isBoardFilled()){
            return "Tie! The board is filled with no winner";
        } else if (winningPattern.winningPiece){
            let returnStr = `Player ${winner.playerNumber}: `
                            +`${winner.player.getName()} `
                            +`(${winningPattern.winningPiece}) wins!`;
            return returnStr;
        }
    }

    const addLineToResultsPanel = function (resultStr){
        // Add a given non-empty string to the results panel
        if (resultStr){
            let resultP = document.createElement("p");
            resultP.textContent = resultStr;
            _resultsPanel.appendChild(resultP);
        }    
    }

    return {updateGameBoardDiv, addLineToResultsPanel};

})(document.querySelector("body"));

let playerX = playerFactory("X", "Xavier");
let playerO = playerFactory("O", "Olivia");
gameEngine.addPlayer(playerX);
gameEngine.addPlayer(playerO);

if (!gameEngine.isGameRunning()) gameEngine.toggleRunGame();

