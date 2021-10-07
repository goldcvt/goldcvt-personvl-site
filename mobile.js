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
let interval = null

const moveSlides = (direction) => {
    // TODO clear all animations
    if (animationFrameIds.length !== 0) {
        console.log(animationFrameIds)
        animationFrameIds.forEach(id => {
            cancelAnimationFrame(id)
            animationFrameIds = animationFrameIds.filter(idEl => idEl !== id)
        })
        console.log(animationFrameIds)
    }
    
    if (interval) {
        clearTimeout(interval)
        interval = null
    }
    
    if (direction === 'left') {
        if (currentSlideIndex !== 0) {
            currentSlideIndex--
        }
    } else if (direction === 'right') {
        if (currentSlideIndex < numberOfSlides - 1) {
            currentSlideIndex++
        }
    }
    
    mainSlide.style.transform = `translateX(-${currentSlideIndex * screenWidth + 0.5}px)`
    console.log(currentSlideIndex)
    // TODO set new animateCurrent
    animateCurrent()
    assureRestProgressSections(currentSlideIndex)
    
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
    if (currentSlideIndex < numberOfSlides - 1 && !interval) {
        interval = setTimeout(() => {
            moveSlides('right')
            animateCurrent()
        }, animationDuration)
    }
}

// LOGIC
// Если я на индексе Х, то этот индекс закрашивать понемногу (анимация только тут), предыдущие целиком мгновенно, 
// а следующие наоборот в черный

const darken = (progress, element) => {
    element.style.width = 0 + '%'
}

const bleach = (progress, element) => {
    element.style.width = progress * 100 + '%'
}

const assureRestProgressSections = (currentIndex) => {
    pBarProgressMasks.forEach((element, index) => {
        if (index < currentIndex) {
            bleach(1, element)
        // current index getting darkened too bc we want to clear it when moving to the left
        } else {
            darken(1, element)
        }
    })
}

const animate = ({duration, draw, timing, element}) => {
    let start = performance.now();
    function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1

        let progress = timing(timeFraction)

        draw(progress, element);

        // this thing's unstoppable...
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

// actually, should wait for load this div's content
// TODO add such a behaviour
animateCurrent()