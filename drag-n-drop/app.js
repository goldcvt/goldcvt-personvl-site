let draggable;
let draggableFirstItem = document.querySelector('.item')
let placeholders = document.querySelectorAll('.placeholder')

const dragstart = (event) => {
    const item = event.target
    item.classList.add('hold')
    setTimeout(() => item.classList.add('hide'), 0)
    draggable = item
}

const dragend = (event) => {
    const item = event.target
    item.classList.remove('hide', 'hold')
    draggable = null
}

draggableFirstItem.addEventListener('dragstart', dragstart)
draggableFirstItem.addEventListener('dragend', dragend)

const onDragEnter = (event) => {
    let placeholder = event.target
    !placeholder.classList.contains('item') ? placeholder.append(draggable) : null
}

const onDragOver = (event) => {
    let placeholder = event.target
    !placeholder.classList.contains('item') && !placeholder.children[0].classList.contains('add_task') ? event.target.classList.add('hovered') : null
    event.preventDefault()
}

const onDragLeave = (event) => {
    event.target.classList.remove('hovered')
}

const onDrop = (event) => {
    let placeholder = event.target
    let elementOver = document.elementFromPoint(event.clientX, event.clientY)
    !placeholder.contains(draggable) && !elementOver.classList.contains('item') ? placeholder.append(draggable) : null
    placeholder.classList.remove('hovered')
}

placeholders.forEach(placeholder => {
    placeholder.addEventListener('dragover', onDragOver)
    placeholder.addEventListener('dragenter', onDragEnter)
    placeholder.addEventListener('dragleave', onDragLeave)
    placeholder.addEventListener('drop', onDrop)
})


const button = document.querySelector('button')
const addTask = () => {
    let inserted = document.createElement('div')
    inserted.className = 'row'
    inserted.innerHTML = `
    <div class="placeholder">
        <div class="item" draggable="true">Меня тоже можно тащить</div>
    </div>
    <div class="placeholder"></div>
    <div class="placeholder"></div>
    `

    let insertBeforeEl = button.parentElement.parentElement
    insertBeforeEl.parentElement.insertBefore(inserted, insertBeforeEl)

    const draggables = document.querySelectorAll('.item')

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragstart)
        draggable.addEventListener('dragend', dragend)
    })

    let placeholderrs = document.querySelectorAll('.placeholder')

    placeholderrs.forEach(placeholder => {
        placeholder.addEventListener('dragover', onDragOver)
        placeholder.addEventListener('dragenter', onDragEnter)
        placeholder.addEventListener('dragleave', onDragLeave)
        placeholder.addEventListener('drop', onDrop)
    })    
}

button.addEventListener('click', addTask)