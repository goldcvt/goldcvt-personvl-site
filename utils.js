const parseTime = (timeString) => {
    return timeString.split(':').reduce((prev, cur) => {
        return parseInt(prev) * 60 + parseInt(cur)
    })
}