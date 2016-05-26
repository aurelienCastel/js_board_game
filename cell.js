function Cell(isHole)
{
	this.y;
	this.x;
	this.isHole = isHole;
	this.isBorder;
	this.token = null;
	this.color = isHole ? HOLE_COLOR : EMPTY_COLOR;
	this.blinkColor;
}
Cell.prototype.isEmpty = function()
{
	return !this.isHole && !(this.token instanceof Player);
}
Cell.prototype.isOwnedByOpponentOf = function(player)
{
	return this.token instanceof Player && this.token != player;
}
