//  countdown timer from
// https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript
// - countdown-timer //
function startTimer(duration) {
    var timer = duration,
        minutes,
        seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10
            ? "0" + minutes
            : minutes;
        seconds = seconds < 10
            ? "0" + seconds
            : seconds;

        console.log(minutes + ":" + seconds);

        if (--timer < 0) {
            console.log("TIMES Up");
            clearInterval(this)
        }
    }, 1000);
}

startTimer(10);