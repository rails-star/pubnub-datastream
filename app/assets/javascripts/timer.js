var Timer = function(duration, startTime) {
    this.lastTime = startTime || 0;
    this.duration = duration;
}

Timer.prototype.isOver = function(time) {
    var over = false;

    if((time - this.lastTime) > this.duration) {
        over = true;
        this.lastTime = time;
    }
    return over;
}

Timer.prototype.elapsedSec = function(time) {
    console.log(time, this.lastTime, time-this.lastTime)
    return (.5 + ((time - this.lastTime) / 1000 )) | 0;
}
