function VFXHandler()
{
	this.blink;
	this.clear;
}
VFXHandler.prototype.blinkCells = function(cells, color, color2)
{
	this.blink = setInterval(
		function()
		{
			for(var i = 0; i < cells.length; i++)
			{
				if(cells[i].color == color)
					cells[i].color = color2;
				else
					cells[i].color = color;
			}
		}, 100);

	this.clear = setTimeout(
			function()
			{
				clearInterval(blink);
				for(var i = 0; i < cells.length; i++)
				{
					if(cells[i].color == color2)
						cells[i].color = color;
				}
			}
			, 600, blink = this.blink);
}
VFXHandler.prototype.resetCellsColors = function(cells)
{
	clearInterval(this.blink);
	clearTimeout(this.clear);
	for(var y = 0; y < cells.length; y++)
	{
		for(var x = 0; x < cells[y].length; x++)
		{
			if(cells[y][x].token instanceof Player)
				cells[y][x].color = cells[y][x].token.colors.base;
		}
	}
}
