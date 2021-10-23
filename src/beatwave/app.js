import * as Tone from 'tone'

let synth

const board = document.querySelector('#board')
const startButton = document.querySelector('.modal button')
const modal = document.querySelector('.container-modal')
const clearFieldButton = document.querySelector('.clear-field')
const muteButton = document.querySelector('.mute')

const volume = new Tone.Volume(-12).toDestination()

const DELAYBETWEENCOLUMNS = 100
const TILES_COUNT = 40 * 20
const COLORS = ['#8e44ad', '#D39B23', '#3498db', 'teal', '#2ecc71']
const NOTES = [
    'Ab3',
    'A#3',
    'C3',
    'Eb3',
    'F3',
    'Ab4',
    'A#4',
    'C4',
    'Eb4',
    'F4',
    'Ab5',
    'A#5',
    'C5',
    'Eb5',
    'F5',
    'Ab6',
    'A#6',
    'C6',
    'Eb6',
    'F6',
]

for (let i = 0; i < TILES_COUNT; i++) {
    const tile = document.createElement('div')
    tile.classList.add('tile')

    tile.state = { plays: false, on: false, note: NOTES[NOTES.length - Math.floor(i / 40) - 1] }
    tile.addEventListener('click', () => toggleColor(tile))
    board.append(tile)
}

const startApp = () => {
    synth = new Tone.PolySynth(Tone.Synth).connect(volume)
    Tone.start()
    modal.classList.add('hide')
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
    let tilesToPlay = []
    board.querySelectorAll('.tile').forEach((node, index) => {
        if (index % 40 === markerPosition) tilesToPlay.push(node)
    })
    return tilesToPlay
}

function playbackLoop(playbackMarkerPosition) {
    let newPlaybackMarkerPosition = movePlaybackMarker(playbackMarkerPosition)
    return setTimeout(() => {
        playbackLoop(newPlaybackMarkerPosition)
    }, DELAYBETWEENCOLUMNS)
}

function getNotes(tiles) {
    return tiles
        .map((tile) => {
            if (tile.state.plays && tile.state.on) {
                return tile.state.note
            }
        })
        .filter((val) => val !== undefined)
}

function playSound(tiles) {
    const notes = getNotes(tiles)
    notes.length !== 0 ? synth.triggerAttackRelease(notes, 1) : null
}

function displayMarker(tiles) {
    tiles.forEach((tile) => {
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
    let prevMarkerPos
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
        return 0
    } else {
        return markerPosition + 1
    }
}

function pulseOnPlay() {}

playbackLoop(0)

startButton.addEventListener('click', startApp)
clearFieldButton.addEventListener('click', (e) => {
    document.querySelectorAll('.tile').forEach((tile) => {
        tile.state.on ? toggleColor(tile) : null
    })
})
muteButton.addEventListener('click', (e) => {
    if (muteButton.textContent === 'Выключить звук') {
        volume.mute = true
        muteButton.textContent = 'Включить звук'
    } else {
        volume.mute = false
        muteButton.textContent = 'Выключить звук'
    }
})
