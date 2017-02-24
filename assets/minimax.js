// Minimax algorithm

// Recursive algorithm to traverse a binary tree (as the case with a game like tic-tac-toe)
// to give a value to outcomes at the bottom of the tree and return to the current split
// which move to make based on whether the final condition will be anything but a loss

// The Alpha Beta algorithm can be applied to ignore branches and leaf nodes that do not improve
// the score on a given branch (CURRENTLY NOT APPLIED)

//THE FOLLOWING CODE WAS ADAPTED FROM https://github.com/Mostafa-Samir/Tic-Tac-Toe-AI courtesy of
//an open source license.

//I have made modifications to the code to simplify reading winning states and allowing the user
//to choose whether or not to go first. Also, the AI, if going first, will choose a random square.

//set year
var d = new Date();
var year = d.getFullYear();
$("#year").text(year);

const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const winningBoards = [
		[0, 1, 2],
		[3, 4, 5], 
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8], 
		[2, 4, 6]
];

//initialize global variables
var humanPlayer, aiPlayer, gameOver = false, firstMove = true, game;

/*******************************************/
/***********    CONSTRUCTORS     ***********/
/*******************************************/

//Constructor for Current State of Game, or state of game during recursive minimax call
var State = function(old) {
    //https://mostafa-samir.github.io/Tic-Tac-Toe-AI/

    this.turn = "";
    
    //the number of moves of the AI player
    this.oMovesCount = 0;

    //the result of the game at this level
    this.result = "still running";

    this.board = [];

    this.winningIndices = [];

    if(typeof old !== "undefined") {
        // if the state is constructed using a copy of another state
        for(let i = 0 ; i < 9 ; i++) {
            this.board[i] = old.board[i];
        }

        this.oMovesCount = old.oMovesCount;
        this.result = old.result;
        this.turn = old.turn;
    }
    
    //will alternate turns between X and O
    this.advanceTurn = function() {
        this.turn = this.turn === "X" ? "O" : "X";
    }

    //@return [Array]: indices of all empty cells
    this.emptyCells = function() {
        let indices = [];
        let currentBoard = this.board;
        currentBoard.forEach((e, i)=>{
            if (e != "X" && e != "O") {
                indices.push(i);
            }
        });
        return indices;
    }
  
    //@return [Array]: indices of all cells with an "X"
    this.exes = function() {
        let indices = [];
        let currentBoard = this.board;
        currentBoard.forEach((e, i)=>{
            if (e == "X") {
                indices.push(i);
            }
        });
        return indices;
    }

    //return [Array]: indices of all cells with an "O"
    this.ohs = function() {
        let indices = [];
        let currentBoard = this.board
        currentBoard.forEach((e, i)=>{
            if (e == "O") {
                indices.push(i);
            }
        });
        return indices;
    }

    //@returns [Boolean]: true if it's terminal, false otherwise
    this.isTerminal = function() {

        //compares two arrays to see if the currentBoard for a given marker contains winning set
        //returns true or false
        function movesContainsWin (currentBoard, winningBoard) {
          return winningBoard.every(function (marker) {
            return (currentBoard.indexOf(marker) >= 0);
          });
        }

        //separate values of board into arrays, each array includes the indices of the marker type
        let X = this.exes();
        let O = this.ohs();
        let available = this.emptyCells();

        // cycles through the winningBoards array and checks if Xs or Os includes a winning set
        for (let i = 0; i < winningBoards.length; i++) {
            if (movesContainsWin(X, winningBoards[i])) {
                this.result = "X-won";
                winningBoards[i].forEach((e)=>{
                    this.winningIndices.push(e);
                });
            }

            if (movesContainsWin(O, winningBoards[i])) {
                this.result = "O-won";
                winningBoards[i].forEach((e)=>{
                    this.winningIndices.push(e);
                });
            }
        }

        //will only prove true if no wins are found and the board is full
        if(available.length == 0 && this.result=="still running") {
            //the game is draw
            this.result = "draw"; //update the state result
        }

        switch (this.result) {
            case "X-won" :
            case "O-won" :
            case "draw" :
                return true;
                break;
            default :
                return false;
        }  

    };

};

//constructor for new game
var Game = function() {

    this.currentState = new State();

    //board is a global variable assigning indices a value at each position
    this.currentState.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    this.currentState.turn = "X"; //X plays first

    this.status = "beginning";

    /*
     * public function that advances the game to a new state
     * @param _state [State]: the new state to advance the game to
     */
    this.advanceTo = function(_state) {
        this.currentState = _state;
        if(_state.isTerminal()) {
            _state.status = "ended";
            gameOver = true;
            var resultText;
            switch (_state.result) {
                               
                case "X-won":
                    if (humanPlayer=="X") {
                        resultText = `<p>Congrats you beat the computer, there must be an error.</p><p>Click Here to Play Again</p>`;
                    } else {
                        resultText= `<p>Who did you think was going to win? . . . Of course, the AI!</p><p>Click Here to Play Again</p>`;
                    }
                    ui.highlightWin(_state.winningIndices, "X");
                    break;             
                case "O-won":
                    if (humanPlayer=="O") {
                            resultText = `<p>Congrats you beat the computer, there must be an error.</p><p>Click Here to Play Again</p>`;
                    } else {
                        resultText= `<p>Who did you think was going to win? . . . Of course, the AI!</p><p>Click Here to Play Again</p>`;
                    }
                    ui.highlightWin(_state.winningIndices, "O");
                    break;
                case "draw" :
                    resultText = `<p>Congrats, this is the best you could have done against me! LOL!!! Well-done.</p><p>Click Here to Play Again</p>`;
                    break;
            }
            $("#results").show().html(resultText).children("p:last-child").css("text-decoration", "underline");
            $("#start-button").text("Play Again?");
        }
        else {
            //the game is still running

            if(this.currentState.turn !== humanPlayer) {
                
                if (firstMove) {
                    //call randome move if AI is the very first player to play
                    randomFirstMove(aiPlayer);
                } else {
                    //ai takes best move
                    calculatedMinimaxMove(aiPlayer);
                }
            }
        }
    };

    /*
     * starts the game
     */
    this.start = function() {

        // console.log("Game has begun");
        if(this.status == "beginning") {
            //invoke advanceTo with the intial state
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    }

};

//function to assign score if winning game is found on current state during recursion.
//this calculates depth so the ai will fight to the end if put into a losing state
Game.score = function(_state) {
    if(_state.result !== "still running") {
        // console.log(_state.result);
        if(_state.result === "X-won" && humanPlayer == "X") {
            // the human player won with X
            // console.log(10 - _state.oMovesCount);
            return 10 - _state.oMovesCount;
        }
        else if(_state.result === "O-won" && aiPlayer == "O") {
            //the human player lost with X
            // console.log(-10 + _state.oMovesCount);
            return -10 + _state.oMovesCount;
        }
        else if(_state.result === "X-won" && aiPlayer == "X") {
            //the human player lost with O
            // console.log(-10 + _state.oMovesCount);
            return -10 + _state.oMovesCount;
        } else if(_state.result == 'O-won' && humanPlayer == "O") {
            //the human player won with O
            // console.log(10 - _state.oMovesCount);
            return 10 - _state.oMovesCount;
        }
        else {
            //it's a draw
            return 0;
        }
    }
}

//constructor for ai to store positions and minimax values
var AIAction = function(pos) {

    // public : the position on the board that the action would put the letter on
    this.movePosition = pos;

    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;

    /*
     * public : applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function(state) {
        var next = new State(state);

        //put the letter on the board
        next.board[this.movePosition] = state.turn;

        if(state.turn === aiPlayer)
            next.oMovesCount++;

        next.advanceTurn();

        return next;
    }
};

AIAction.ASCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal < secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal > secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

AIAction.DESCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal > secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal < secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

var ui = {};

ui.insertAt = function(index, symbol) {
    let board = $('.cell');
    var targetCell = $(board[index]);

    if(!targetCell.hasClass('occupied')) {
        targetCell.text(symbol);
        targetCell.css({
            color : symbol == humanPlayer ? "green" : "red"
        });
        targetCell.addClass('occupied');
    }
}

ui.highlightWin = function(indices, symbol) {
    let board = $('.cell');
    for (let i = 0; i < indices.length; i++) {
        $(board[indices[i]]).addClass("winning");
    }
}

/**********************************************/
/**********      ALGORITHMS         ***********/
/**********************************************/

//this is the minimax algorithm optimized for this game
function minimaxValue(state) {
    if(state.isTerminal()) {
        //a terminal game state is the base case
        return Game.score(state);
    }
    else {
        var stateScore; // this stores the minimax value we'll compute

        if(state.turn === humanPlayer)
        // human maximizes --> initialize to a value smaller than any possible score
            stateScore = -1000;
        else
        // ai minimizes --> initialize to a value larger than any possible score
            stateScore = 1000;

        var availablePositions = state.emptyCells();

        //enumerate next available states using the info form available positions
        var availableNextStates = availablePositions.map(function(pos) {
            var action = new AIAction(pos);

            var nextState = action.applyTo(state);

            return nextState;
        });

        /* calculate the minimax value for all available next states
         * and evaluate the current state's value */
        availableNextStates.forEach(function(nextState) {

            var nextScore = minimaxValue(nextState); //recursive call

            if(state.turn === humanPlayer) {
                // human wants to maximize --> update stateScore iff nextScore is larger
                if(nextScore > stateScore)
                    stateScore = nextScore;
                }
            else {
                // ai wants to minimize --> update stateScore iff nextScore is smaller
                if(nextScore < stateScore)
                    stateScore = nextScore;
            }
        });

        //backup the minimax value
        return stateScore;
    }
}

//this calls minimax algorithm on the AI
function calculatedMinimaxMove(turn) {
    var available = game.currentState.emptyCells();

    //enumerate and calculate the score for each avaialable actions to the ai player
    var availableActions = available.map(function(pos) {
        var action =  new AIAction(pos); //create the action object

        //get next state by applying the action
        var next = action.applyTo(game.currentState);

        //calculate and set the action's minmax value
        action.minimaxVal = minimaxValue(next);

        return action;
    });

    // console.log(availableActions);
    //sort the enumerated actions list by score
    if(turn === humanPlayer)
        //X maximizes --> descend sort the actions to have the largest minimax at first
        availableActions.sort(AIAction.DESCENDING);

    else
        //O minimizes --> acend sort the actions to have the smallest minimax at first
        availableActions.sort(AIAction.ASCENDING);


    //take the first action as it's the optimal
    var chosenAction = availableActions[0];
    var next = chosenAction.applyTo(game.currentState);

    // console.log(next);

    // this just adds an X or an O at the chosen position on the board in the UI
    ui.insertAt(chosenAction.movePosition, turn);

    // take the game to the next state
    game.advanceTo(next);
}

//only will be called on the first move if the AI goes first
function randomFirstMove(turn) {
    firstMove = false;
    var available = game.currentState.emptyCells();
    var randomCell = available[Math.floor(Math.random() * available.length)];
    var action = new AIAction(randomCell);

    var next = action.applyTo(game.currentState);

    ui.insertAt(randomCell, turn);

    game.advanceTo(next);
}

/**********************************************/
/**********    EVENT LISTENERS      ***********/
/**********************************************/

$(document).ready(function(){

    //get human player
    $(".marker").click(function() {
        
        $("#chooseMarker").hide();

        //get data on human player/ai player
        humanPlayer = $(this).attr("data-marker");
        aiPlayer = $(this).attr("data-ai");

        //show player marker    
        $("#human").append($("<div>").text(humanPlayer).addClass("gameMarkers"));
        $("#ai").append($("<div>").text(aiPlayer).addClass("gameMarkers"));

        //start game
        game = new Game();
        game.start();
        $("#players").show();
    });


    $("#results").on("click", function() {

        //reset board
        gameOver = false; 
        firstMove = true;
        $("#results").hide();
        $(".gameMarkers").remove();
        $(".cell").text('').removeClass('occupied').removeClass("winning");
        $("#chooseMarker").show();
        game = {};

    });



    $(".cell").click(function() {
        var $this = $(this);
        if(game.status === "running" && game.currentState.turn === humanPlayer && !$this.hasClass('occupied')) {
            var index = parseInt($this.data("index"));

            var next = new State(game.currentState);
            next.board[index] = humanPlayer;

            ui.insertAt(index, humanPlayer);

            next.advanceTurn();

            game.advanceTo(next);
            firstMove = false;
        }
    });

    $("#hamburger").on("mouseenter", function() {
        $("#hamburger").hide('fast');
        $("#header").show('fast');
    });

    $("#header").on("mouseleave", function(){
        $("#header").hide('fast');
        $("#hamburger").show('fast');
    });

});