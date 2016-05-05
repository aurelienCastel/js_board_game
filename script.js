function padWithZeros(number, length)
{
  number = number.toString();
  while(number.length < length)
	  number = "0" + number;
  return number;
}

function Player(name, color)
{
	this.name = name; 
	this.color = color;
	this.points = 0;
}

// In 1/100 second
function Countdown(duration)
{
	this.duration = duration;
	this.timeLeft = duration;
	this.minutesLeft = Math.floor(duration / 60000);
	this.secondsLeft = Math.floor((duration % 6000) / 100);
	this.hundredthLeft = duration % 100;
}

function Cell(isHole)
{
	this.x;
	this.y;
	this.isHole = isHole;
	this.isBorder;
	this.player = isHole ? {color : "rgb(255, 255, 255)"} : {color : "rgb(120, 110, 90)"};

	this.besiegedByCells = [];
	this.besiegedAgainst = [];
}
Cell.prototype.isPlayableBy = function(player)
{
	for(var i = 0; i < this.besiegedAgainst.length; i++)
	{
		if(this.besiegedAgainst[i] === player)
			return 0;
	}
	return 1;
}

function Game(grid, players, turnDuration)
{
	this.grid = grid;
	this.players = players;
	this.currentPlayer;
	this.pointsToWin;
	this.countdown = new Countdown(turnDuration);
}
Game.prototype.initGrid = function()
{

}
Game.prototype.coinFlip = function()
{
	this.currentPlayer = this.players[Math.round(Math.random())];
}
Game.prototype.changeTurn = function()
{
	this.countdown.timeLeft = this.countdown.duration;
	this.currentPlayer === this.players[0] ? this.currentPlayer = this.players[1] : this.currentPlayer = this.players[0];
}
Game.prototype.updateTime = function()
{
	this.countdown.timeLeft -= 1;

	this.countdown.minutesLeft = Math.floor(this.countdown.timeLeft / 6000);
	this.countdown.secondsLeft = Math.floor((this.countdown.timeLeft % 6000) / 100);
	this.countdown.hundredthLeft = this.countdown.timeLeft % 100;

	this.countdown.minutesLeft = padWithZeros(this.countdown.minutesLeft, 2);
	this.countdown.secondsLeft = padWithZeros(this.countdown.secondsLeft, 2);
	this.countdown.hundredthLeft = padWithZeros(this.countdown.hundredthLeft, 2);

	if(this.countdown.timeLeft == 0)
		this.changeTurn();
}
Game.prototype.tryPlay = function(cell)
{
	if(!cell.isHole && cell.isPlayableBy(game.currentPlayer))
	{
		cell.player = this.currentPlayer;
		this.eliminateAlignments(cell);
		// Eliminate, besiege, check points, check if the grid is playable...
		this.changeTurn();
	}
	//else
		// Highlight besieging cells
}

var game = angular.module("game", []);
game.controller("gameCtrl", function($scope, $interval)
{
	var grid = [[new Cell(), new Cell(true), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(true), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell()]];
	var players = [new Player("Player 1", "blue"), new Player("Player 2", "red")];
	var turnDuration = 500;

	var game = new Game(grid, players, turnDuration);
	game.coinFlip();
	$interval(function(){game.updateTime();}, 10); // Start countdown.

	$scope.game = game;
	$scope.grid = game.grid;
	$scope.countdown = game.countdown;
});

