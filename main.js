var game = angular.module("game", []);
game.controller("gameCtrl", function($scope, $interval)
{
	var grid = 		  [[new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
					   [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()]];
	var players = [new Player("Player 1", BLUE), new Player("Player 2", RED)];
	var turnDuration = 1000;

	var game = new Game(grid, players, turnDuration);
	game.initGrid();
	game.coinFlip();
	$interval(function(){game.countdown.tick(); game.checkTime();}, 10); // Start countdown.

	$scope.game = game;
	$scope.grid = game.grid;
	$scope.countdown = game.countdown;
});
