function Player(name, color)
{
	this.name = name;
	this.colors =
	{
		base : color,
		light : shadeRGBColor(color, 0.5),
		dark : shadeRGBColor(color, -0.5)
	};
	this.points = 0;
}
