const board = document.querySelector('#board')

const DELAYBETWEENCOLUMNS = 100
const TILES_COUNT = 40*20
const COLORS = ['#8e44ad', '#D39B23', '#3498db', 'teal', '#2ecc71']

for (let i = 0; i < TILES_COUNT; i++) {
    const tile = document.createElement('div')
    tile.classList.add('tile')
    tile.state = {plays: false, on: false}
    tile.addEventListener('click', () => toggleColor(tile))
    board.append(tile)
}

function toggleColor(tile) {
    if (!tile.state.on) {
        const color = getRandomColor()
        tile.style.backgroundColor = color
        tile.state.on = true
    } else {
        tile.state.on = false
        resetColor(tile)
    }
}

function resetColor(tile) {
    tile.style.backgroundColor = '#1d1d1d'
    resetGlow(tile)
}

function resetGlow(tile) {
    tile.style.boxShadow = '0 0 2px #000'
} 

function getRandomColor() {
    const index = Math.ceil(Math.random() * COLORS.length)
    return COLORS[index]
}

function glow(tile) {
    tile.style.boxShadow = `0 0 20px ${tile.style.backgroundColor}`
}

function getActiveTiles(markerPosition) {
    let tilesToPlay = [];
    board.querySelectorAll('.tile').forEach((node, index) => {
        if (index % 40 === markerPosition) tilesToPlay.push(node);
    })
    return tilesToPlay;
}

function playbackLoop(playbackMarkerPosition) {
    let newPlaybackMarkerPosition = movePlaybackMarker(playbackMarkerPosition)
    return setTimeout(() => {
            playbackLoop(newPlaybackMarkerPosition)
        }, DELAYBETWEENCOLUMNS)
    
}

function playSound(tiles) {
    
}

function displayMarker(tiles) {
    tiles.forEach(tile => {
        if (tile.state.plays) {
            //!tile.state.on ? tile.style.backgroundColor = 'white' : null
            if (!tile.state.on) {
                tile.style.backgroundColor = 'white'
            } else {
                glow(tile)
            }
        } else {
            tile.state.on ? resetGlow(tile) : resetColor(tile)
        }
    })
}

function movePlaybackMarker(markerPosition) {
    let prevMarkerPos;
    if (markerPosition - 1 < 0) {
        prevMarkerPos = 39
    } else {
        prevMarkerPos = markerPosition - 1
    }
    let tilesToUnplay = getActiveTiles(prevMarkerPos)
    tilesToUnplay.forEach((tile) => {
            tile.state.plays = false 
    })
    // display changes
    displayMarker(tilesToUnplay)

    // white background on all tile with same remainder from division by 40
    let tilesToPlay = getActiveTiles(markerPosition)
    tilesToPlay.forEach((tile) => {
        tile.state.plays = true
    })
    // display changes
    displayMarker(tilesToPlay)
    playSound(tilesToPlay)

    if (markerPosition === 39) {
        return 0;
    } else {
        return markerPosition + 1;
    }
}

function pulseOnPlay() {

}


playbackLoop(0)

alert(`Активируйте ячейки, чтобы белый макер извлекал из них звуки! Тыкайте мышкой на квадратики, чтобы поместить ноту. Звука пока нет)
Растяните окно пошире, чтобы маркер выглядел по-человечески
`)