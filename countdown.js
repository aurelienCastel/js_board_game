// In 1/100 second
function Countdown(duration)
{
	this.duration = duration;
	this.timeLeft = duration;
	this.minutesLeft = Math.floor(duration / 60000);
	this.secondsLeft = Math.floor((duration % 6000) / 100);
	this.hundredthLeft = duration % 100;
}
Countdown.prototype.tick = function()
{
	this.timeLeft -= 1;

	this.minutesLeft = Math.floor(this.timeLeft / 6000);
	this.secondsLeft = Math.floor((this.timeLeft % 6000) / 100);
	this.hundredthLeft = this.timeLeft % 100;

	this.minutesLeft = padWithZeros(this.minutesLeft, 2);
	this.secondsLeft = padWithZeros(this.secondsLeft, 2);
	this.hundredthLeft = padWithZeros(this.hundredthLeft, 2);
}
