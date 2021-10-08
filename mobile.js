const DEFAULT_ANIMATION_DURATION = 6000

const mainSlide = document.querySelector('.main-slide')
const progressBar = document.querySelector('.progress-bar')
const pBarSections = progressBar.querySelectorAll('.progress-section')
const pBarProgressMasks = progressBar.querySelectorAll('.progress-section_playmask')
const numberOfSlides = mainSlide.childElementCount
const slides = document.querySelectorAll('.slide')
const screenWidth = document.querySelector('.container').clientWidth
let currentSlideIndex = 0
let animationFrameIds = []
let tapsLeft = false
let tapsRight = false
let animationStopped = false
let stoppedAt
let startedAt

// TODO ANCHOR
let controllableTimer = null

const moveSlides = (direction) => {
    // clear all animations
    if (animationFrameIds.length !== 0) {
        // console.log(animationFrameIds)
        animationFrameIds.forEach(id => {
            cancelAnimationFrame(id)
            animationFrameIds = animationFrameIds.filter(idEl => idEl !== id)
        })
        // console.log(animationFrameIds)
    }
    
    if (controllableTimer) {
        // TODO ANCHOR
        // Use clearAll? Probable bug if restrain
        controllableTimer.clear(controllableTimer.timerId)
        controllableTimer = null
    }
    
    if (direction === 'left') {
        if (!tapsLeft) {
            tapsLeft = true
        } else {
            if (currentSlideIndex !== 0 && currentSlideIndex !== numberOfSlides - 1) {
                currentSlideIndex--
            } else if (currentSlideIndex === numberOfSlides - 1) {
                tapsRight = false
                currentSlideIndex--
            }
            tapsLeft = false
        }
    } else if (direction === 'right') {
        if (currentSlideIndex < numberOfSlides - 1) {
            currentSlideIndex++
        } else {
            tapsRight = true
        }
    }

    
    mainSlide.style.transform = `translateX(-${currentSlideIndex * screenWidth + 0.5}px)`
    
    animateCurrent()
    assureRestProgressSections(currentSlideIndex)
}

const pause = () => {
    controllableTimer ? controllableTimer.pause() : null
}

const resume = () => {
    controllableTimer ? controllableTimer.resume() : null
}

// twitchy as fuck for some reason, should deprecate tbh
const toggleAnimationActive = () => {
    animationStopped = !animationStopped
    
    
    if (!animationStopped) {
        let animationDuration
        if (slides[currentSlideIndex].classList.contains('video')) {
            animationDuration = parseTime(slides[currentSlideIndex].getAttribute('video-duration')) * 1000
        } else {
            animationDuration = DEFAULT_ANIMATION_DURATION
        }
        animate({
            duration: animationDuration - (stoppedAt - startedAt),
            draw: bleach,
            timing: timeFraction => {
                if (timeFraction >= (stoppedAt - startedAt) / animationDuration) {
                    return timeFraction
                } else {
                    return (stoppedAt - startedAt) / animationDuration
                }
            },
            element: pBarProgressMasks[currentSlideIndex]
        })
    }
}

const animateCurrent = () => {
    let element = pBarSections[currentSlideIndex].children[0]

    let animationDuration = DEFAULT_ANIMATION_DURATION
    
    if (slides[currentSlideIndex].classList.contains('video')) {
        animationDuration = parseTime(slides[currentSlideIndex].getAttribute('video-duration')) * 1000
    }
    
    
    animate({
        duration: animationDuration,
        draw: bleach,
        timing: (timeFraction) => timeFraction,
        element: element
    })
    

    // Timing trigger
    if (currentSlideIndex < numberOfSlides - 1 && !controllableTimer) {
        // TODO ANCHOR
        controllableTimer = new Timer(() => {
            moveSlides('right')
            animateCurrent()
        }, animationDuration)
    }
}


const darken = (progress, element) => {
    element.style.width = 0 + '%'
}

const bleach = (progress, element) => {
    element.style.width = progress * 100 + '%'
}

const assureRestProgressSections = (currentIndex) => {
    if (!tapsRight) {
        pBarProgressMasks.forEach((element, index) => {
            if (index < currentIndex) {
                bleach(1, element)
            // current index getting darkened too bc we want to clear it when moving to the left
            } else {
                darken(1, element)
            }
        })
    } else {
        pBarProgressMasks.forEach(element => bleach(1, element))
        animationFrameIds.forEach(id => {
            cancelAnimationFrame(id)
            animationFrameIds = animationFrameIds.filter(idEl => idEl !== id)
        })
        tapsRight = false
    }
}

const animate = ({duration, draw, timing, element}) => {
    let start = performance.now()
    
    function animate(time) {
        stoppedAt = time
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1

        let progress = timing(timeFraction)

        draw(progress, element);
        if (animationStopped) {
            startedAt = start
            return
        }
        if (timeFraction < 1) {
            animationFrameIds.push(requestAnimationFrame(animate))
        }
    }
    animationFrameIds.push(requestAnimationFrame(animate))
}

// Kinda sus, we're on mobile, there's no keys...
// TODO add section skip handler
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveSlides('left')
    } else if (event.key === 'ArrowRight') {
        moveSlides('right')
    }
})

document.addEventListener('keydown', (event) => {
    console.log('keydown')
    if (event.key !== 'ArrowLeft' || event.key !== 'ArrowRight') {
        if (!animationStopped) {
            pause()
            toggleAnimationActive()
            console.log(stoppedAt, startedAt)
        }
    }
})

document.addEventListener('keyup', (event) => {
    console.log('keyup')
    if (event.key !== 'ArrowLeft' || event.key !== 'ArrowRight') {
        if (animationStopped) {
            resume()
            toggleAnimationActive()
            console.log(stoppedAt, startedAt)
        }
    }
})

// actually, should wait for load this div's content
// TODO add such a behaviour
animateCurrent()