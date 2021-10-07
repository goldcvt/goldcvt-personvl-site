const mainSlide = document.querySelector('.main-slide')
const progressBar = document.querySelector('.progress-bar')
const pBarSections = progressBar.querySelectorAll('.progress-section')
const numberOfSlides = mainSlide.childElementCount
const slides = document.querySelectorAll('.slide')
const screenWidth = document.querySelector('.container').clientWidth
let currentSlideIndex = 0

const moveSlides = (direction) => {
    if (direction === 'left') {
        if (currentSlideIndex === 0) {
            currentSlideIndex = (numberOfSlides - 1)
        } else {
            currentSlideIndex--
        }
    } else if (direction === 'right') {
        if (currentSlideIndex >= numberOfSlides - 1) {
            currentSlideIndex = 0
        } else {
            currentSlideIndex++
        }
    }
    mainSlide.style.transform = `translateX(-${currentSlideIndex * screenWidth}px)`
}

const bleach = (progress, element) => {
    element.style.width = progress * 100 + '%'

}

const animate = ({duration, draw, timing, element}) => {
    let start = performance.now();
    const myHandle = requestAnimationFrame(function animate(time) {
        if (element != pBarSections[currentSlideIndex]) {
            cancelAnimationFrame(myHandle)
            // almost does the thing, but not quite
            // TODO fix behaviour with skips
        }
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction)

        draw(progress, element);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

        // if (timeFraction = 1) {
        //     nextSlide()
        // }
    });
}

const nextSlide = () => {
    let timeout = 6000
    let currentSection = pBarSections[currentSlideIndex]

    // TODO sync a video duration to timeout. Probably via custom prop "video-length" in a slide element
    if (slides[currentSlideIndex].classList.contains('video')) {
        timeout = 1000
    }

    animate({
        duration: timeout,
        draw: bleach,
        timing: (timeFraction) => timeFraction,
        element: currentSection.firstChild
    })

    if (currentSlideIndex < numberOfSlides - 1) {

        setTimeout(() => {
            moveSlides('right')
            nextSlide()
        }, timeout + 300)
    }
}

// Kinda sus, we're on mobile, there's no keys...
// TODO add section skip handler
document.addEventListener('keydown', (event) => {
    console.log(event)
    if (event.key === 'ArrowLeft') {
        moveSlides('left')
    } else if (event.key === 'ArrowRight') {
        moveSlides('right')
    }
})

// actually, should only wait for load this div's content
// TODO add such a behaviour
window.onload = nextSlide