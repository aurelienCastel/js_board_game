function shadeRGBColor(color, percent)
{
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function padWithZeros(number, length)
{
  number = number.toString();
  while(number.length < length)
	  number = "0" + number;
  return number;
}

function addNewElemToArray(array, elem)
{
	if(array.indexOf(elem) == -1)
		array.push(elem);
}

function addNewElemsToArray(array, elems)
{
	for(var i = 0; i < elems.length; i++)
		addNewElemToArray(array, elems[i]);
}
