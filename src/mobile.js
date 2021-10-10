import { Timer } from './utils.js'
Timer.timers = []

import { parseTime, onBackgroundLoad } from './utils.js'

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

let controllableTimer = null

const moveSlides = (direction) => {
    if (animationFrameIds.length !== 0) {
        animationFrameIds.forEach((id) => {
            cancelAnimationFrame(id)
            animationFrameIds = animationFrameIds.filter((idEl) => idEl !== id)
        })
    }

    if (controllableTimer) {
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
        tapsLeft = false
        if (currentSlideIndex < numberOfSlides - 1) {
            currentSlideIndex++
        } else {
            tapsRight = true
        }
    }

    mainSlide.style.transform = `translateX(-${currentSlideIndex * screenWidth + 0.5}px)`

    lazyAnimateCurrent()
    assureRestProgressSections(currentSlideIndex)
}

const pause = () => {
    controllableTimer ? controllableTimer.pause() : null
}

const resume = () => {
    controllableTimer ? controllableTimer.resume() : null
}

const animateCurrent = () => {
    let element = pBarSections[currentSlideIndex].children[0]

    let animationDuration = DEFAULT_ANIMATION_DURATION

    if (slides[currentSlideIndex].classList.contains('video')) {
        animationDuration =
            parseTime(slides[currentSlideIndex].getAttribute('video-duration')) * 1000
    }

    animate({
        duration: animationDuration,
        draw: bleach,
        timing: (timeFraction) => timeFraction,
        element: element,
    })

    // Timing trigger
    if (currentSlideIndex < numberOfSlides - 1 && !controllableTimer) {
        // TODO ANCHOR
        controllableTimer = new Timer(() => {
            moveSlides('right')
        }, animationDuration)
    }
}

const darken = (progress, element) => {
    element.style.width = 0 + '%'
}

const bleach = (progress, element) => {
    element.style.width = progress * 100 + '%'
}

const lazyAnimateCurrent = () => {
    const myElement = slides[currentSlideIndex]
    onBackgroundLoad(myElement, animateCurrent)
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
        pBarProgressMasks.forEach((element) => bleach(1, element))
        animationFrameIds.forEach((id) => {
            cancelAnimationFrame(id)
            animationFrameIds = animationFrameIds.filter((idEl) => idEl !== id)
        })
        tapsRight = false
    }
}

const animate = ({ duration, draw, timing, element }) => {
    let start = performance.now()
    function animate(time) {
        let timeFraction = (time - start) / duration
        if (timeFraction > 1) timeFraction = 1

        let progress = timing(timeFraction)

        draw(progress, element)

        if (timeFraction < 1) {
            animationFrameIds.push(requestAnimationFrame(animate))
        }
    }
    animationFrameIds.push(requestAnimationFrame(animate))
}

// if __name__ == "__main__"
if (screen && screen.width <= 600) {
    mainSlide.addEventListener('click', (event) => {
        if (2 * event.clientX >= screenWidth) {
            moveSlides('right')
        } else {
            moveSlides('left')
        }
    })

    // actually, should wait for load this div's content
    // TODO add such a behaviour
    lazyAnimateCurrent()
}

/* 
    Это, по лейзи лоаду: просто в animateCurrent жди загрузки элемента до всего. 
    Ну то есть мы сделаем функцию-обертку, lazyAnimateCurrent, 
    в которую animateCurrent будет прилетать и запускаться коллбэком функции onBackgroundLoaded, 
    и вызывать уже lazyAnimateCurrent везде где нужно)
*/
