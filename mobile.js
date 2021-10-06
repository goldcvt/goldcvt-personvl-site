const mainSlide = document.querySelector('.main-slide')
const progressBar = document.querySelector('.progress-bar')
const numberOfSlides = mainSlide.childElementCount
const screenWidth = document.querySelector('.container').clientWidth
let currentSlideIndex = 0

const moveSlides = (direction) => {
    if (direction === 'left') {
        if (currentSlideIndex === 0) {
            currentSlideIndex = (numberOfSlides-1)
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

const nextSlide = () => {
    if (currentSlideIndex < numberOfSlides - 1) {    
        moveSlides('right')
        setTimeout(() => nextSlide(), 6000)
    }
}

// Kinda sus, we're on mobile, there's no keys...
document.addEventListener('keydown', (event) => {
    console.log(event)
    if (event.key === 'ArrowLeft') {
        moveSlides('left')
    } else if (event.key === 'ArrowRight') {
        moveSlides('right')
    }
})

nextSlide()