var HOLE_COLOR = "rgb(255, 255, 255)";
var EMPTY_COLOR = "rgb(120, 110, 90)";
var RED = "rgb(230, 30, 20)";
var BLUE = "rgb(20, 30, 230)";

function Game(grid, players, turnDuration, pointsToWin)
{
	this.countdown = new Countdown(turnDuration);
	this.vfxHandler = new VFXHandler();
	this.grid = grid;
	this.players = players;
	this.currentPlayer;
	this.pointsToWin = pointsToWin;
}
Game.prototype.coordsAreCell = function(y, x)
{
	if(this.grid[y] != undefined && this.grid[y][x] != undefined)
		return true;
	return false;
}
Game.prototype.coordsAreBorder = function(y, x)
{
	return y == 0 || y == this.grid.length - 1 ||
		x == 0 || x == this.grid[y].length - 1 ||
		this.grid[y - 1][x].isHole || this.grid[y][x + 1].isHole ||
		this.grid[y + 1][x].isHole|| this.grid[y][x - 1].isHole;
}
Game.prototype.initGrid = function()
{
	for(var y = 0; y < this.grid.length; y++)
	{
		for(var x = 0; x < this.grid[y].length; x++)
		{
			this.grid[y][x].y = y;
			this.grid[y][x].x = x;

			this.grid[y][x].isBorder = this.coordsAreBorder(y, x);
		}
	}
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
Game.prototype.checkTime = function()
{
	if(this.countdown.timeLeft == 0)
		this.changeTurn();
}
Game.prototype.tryPlay = function(cell)
{
	this.vfxHandler.resetCellsColors(this.grid);

	if(cell.isEmpty())
	{
		var borderSiegingCells = this.getBorderSiegingCells(cell.y, cell.x);
		var alignSiegingCells = this.getAlignSiegingCells(cell.y, cell.x);

		if(borderSiegingCells.length == 0 && alignSiegingCells.length == 0)
		{
			cell.token = this.currentPlayer;
			cell.color = this.currentPlayer.colors.base;

			this.elimFrom(cell.y, cell.x);

			// check points, check if the grid is playable...

			this.changeTurn();
		}
		else
		{
			addNewElemsToArray(borderSiegingCells, alignSiegingCells);
			this.vfxHandler.blinkCells(borderSiegingCells,
					borderSiegingCells[0].color, borderSiegingCells[0].token.colors.light);
		}
	}
}
Game.prototype.getBorderSiegingCells = function(y, x)
{
	var siegingCells = [];

	if(this.grid[y][x].isBorder)
	{
		for(var i = 0; i < 8; i++)
		{
			// Change direction of y, x : top, top-right, right...
			switch(i)
			{
				case 0: y -= 1; break;
				case 1: x += 1; break;
				case 2: y += 1; break;
				case 3: y += 1; break;
				case 4: x -= 1; break;
				case 5: x -= 1; break;
				case 6: y -= 1; break;
				case 7: y -= 1; break;
			}
			if(this.coordsAreCell(y, x) && this.grid[y][x].isOwnedByOpponentOf(this.currentPlayer))
				siegingCells.push(this.grid[y][x]);
		}

		if(siegingCells.length >= 3)
		{
			return siegingCells;
		}
	}
	return [];
}
Game.prototype.getAlignSiegingCells = function(y, x)
{
	var siegingCells = [];

	addNewElemsToArray(siegingCells, this.getAlignSiegingCellsOnAxis(y, x, 1, 0)); // top-bottom
	addNewElemsToArray(siegingCells, this.getAlignSiegingCellsOnAxis(y, x, 0, 1)); // left-right
	addNewElemsToArray(siegingCells, this.getAlignSiegingCellsOnAxis(y, x, -1, 1)); // topLeft-bottomRight
	addNewElemsToArray(siegingCells, this.getAlignSiegingCellsOnAxis(y, x, 1, 1)); // topRight-bottomLeft
	
	return siegingCells;
}
Game.prototype.getAlignSiegingCellsOnAxis = function(y, x, yDir, xDir)
{
	var cellToSiege = this.grid[y][x];

	for(y += yDir, x += xDir;
		this.coordsAreCell(y, x) && !this.grid[y][x].isEmpty(); y += yDir, x += xDir)
	{
		if(!this.grid[y][x].isHole && this.grid[y][x].token != this.currentPlayer)
		{
			for(var y1 = cellToSiege.y - yDir, x1 = cellToSiege.x - xDir;
				this.coordsAreCell(y1, x1) && !this.grid[y1][x1].isEmpty(); y1 -= yDir, x1 -= xDir)
			{
				if(!this.grid[y1][x1].isHole && this.grid[y1][x1].token != this.currentPlayer)
				{
					return [this.grid[y][x], this.grid[y1][x1]];
				}
			}
			return [];
		}
	}
	return [];
}
Game.prototype.elimFrom = function(y, x)
{
	var eliminatingCells = [];

	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, -1, 0));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, -1, 1));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, 0, 1));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, 1, 1));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, 1, 0));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, 1, -1));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, 0, -1));
	addNewElemsToArray(eliminatingCells, this.elimByAlign(y, x, -1, -1));

	for(var i = 0; i < 8; i++)
	{
		// Change direction of y, x : top, top-right, right...
		switch(i)
		{
			case 0: y -= 1; break;
			case 1: x += 1; break;
			case 2: y += 1; break;
			case 3: y += 1; break;
			case 4: x -= 1; break;
			case 5: x -= 1; break;
			case 6: y -= 1; break;
			case 7: y -= 1; break;
		}
		addNewElemsToArray(eliminatingCells, this.elimByBorder(y, x));
	}

	if(eliminatingCells[0] != undefined)
		this.vfxHandler.blinkCells(eliminatingCells, eliminatingCells[0].color, eliminatingCells[0].token.colors.dark);
}
Game.prototype.elimByAlign = function(y, x, yDir, xDir)
{
	var start = this.grid[y][x];
	var cellsToElim = [];

	while(this.coordsAreCell(y, x))
	{
		if(!this.grid[y][x].isHole)
		{
			if(!(this.grid[y][x].token instanceof Player))
				return [];

			else if(this.grid[y][x].token == this.currentPlayer)
			{
				if(cellsToElim[0] != undefined)
				{
					this.elimCells(cellsToElim);
					return [start, this.grid[y][x]];
				}
			}
			else
				cellsToElim.push(this.grid[y][x]);
		}

		y += yDir;
		x += xDir;
	}
	return [];
}
Game.prototype.elimByBorder = function(y, x)
{
	var eliminatingCells = [];

	if(this.coordsAreCell(y, x) && this.grid[y][x].isBorder &&
		this.grid[y][x].isOwnedByOpponentOf(this.currentPlayer))
	{
		for(var i = 0; i < 8; i++)
		{
			// Change direction of y, x : top, top-right, right...
			switch(i)
			{
				case 0: y -= 1; break;
				case 1: x += 1; break;
				case 2: y += 1; break;
				case 3: y += 1; break;
				case 4: x -= 1; break;
				case 5: x -= 1; break;
				case 6: y -= 1; break;
				case 7: y -= 1; break;
			}

			if(this.coordsAreCell(y, x) && this.grid[y][x].token == this.currentPlayer)
				eliminatingCells.push(this.grid[y][x]);
		}

		if(eliminatingCells.length >= 3)
		{
			y += 1, x += 1; // Go back to initial position of cell.
			this.elimCell(this.grid[y][x]);
			return eliminatingCells;
		}
	}
	return [];
}
Game.prototype.elimCell = function(cell)
{
	cell.token = null;
	cell.color = EMPTY_COLOR;
}
Game.prototype.elimCells = function(cells)
{
	for(var i = 0; i < cells.length; i++)
		this.elimCell(cells[i]);
}
