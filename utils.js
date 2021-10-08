const parseTime = (timeString) => {
    return timeString.split(':').reduce((prev, cur) => {
        return parseInt(prev) * 60 + parseInt(cur)
    })
}

// Shotouts to Tim Down from SO
class Timer {
    constructor(callback, delay) {
        this.callback = callback
        this.timerId = undefined
        this.start = undefined
        this.remaining = delay;

        this.resume();
    }

    pause() {
        //clearTimeout(this.timerId)
        this.clear()
        
        this.remaining -= Date.now() - this.start;
    }

    resume() {
        //console.log("Will resume timers:", Timer.timers)
        this.start = Date.now();

        // clearTimeout(this.timerId);
        this.clear()

        this.timerId = setTimeout(this.callback, this.remaining);
        Timer.timers.push(this.timerId)

        //console.log("Resumed, timers:", Timer.timers)
    }

    clearAll() {
        // console.log("Will clear all:", Timer.timers)
        Timer.timers.forEach(timerId => {
            clearTimeout(timerId)
        })
        Timer.timers = []
        // console.log("Cleared all", Timer.timers)
    }

    clear() {
        // console.log(`Will clear ${this.timerId}`, Timer.timers)
        clearTimeout(this.timerId)
        Timer.timers = Timer.timers.filter(id => id !== this.timerId)
        // console.log("Cleared one", Timer.timers)
    }
}
Timer.timers = []