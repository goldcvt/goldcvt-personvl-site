const upButton = document.querySelector('.up-button')
const downButton = document.querySelector('.down-button')

const sidebar = document.querySelector('.sidebar')
const numberOfSlides = sidebar.childElementCount

const mainSlide = document.querySelector('.main-slide')
const screenHeight = document.querySelector('.container').clientHeight
let currentSlideIndex = 0

const moveSlides = (direction) => {
    if (direction === 'up') {
        if (currentSlideIndex === 0) {
            currentSlideIndex = numberOfSlides - 1
        } else {
            currentSlideIndex--
        }
    } else if (direction === 'down') {
        if (currentSlideIndex >= numberOfSlides - 1) {
            currentSlideIndex = 0
        } else {
            currentSlideIndex++
        }
    }
    mainSlide.style.transform = `translateY(-${currentSlideIndex * screenHeight}px)`
    sidebar.style.transform = `translateY(${currentSlideIndex * screenHeight}px)`
}

sidebar.style.top = `${(1 - numberOfSlides) * 100}vh`

upButton.addEventListener('click', () => moveSlides('up'))
downButton.addEventListener('click', () => moveSlides('down'))

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        moveSlides('up')
    } else if (event.key === 'ArrowDown') {
        moveSlides('down')
    }
})
