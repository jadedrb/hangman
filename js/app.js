class Settings {
    constructor() {
        this.opponent = ''
        this.word = ''
        this.gameState = false
        this.usedLetters = {}
        this.incorrect = 0
        this.revealedLetters = 0
        this.cleanUpDivs()
    }

    cleanUpDivs() {
        let bodyParts = ['rope','stick-head', 'stick-body','stick-right-arm','stick-right-leg','stick-left-arm','stick-left-leg','cover-settings'] 
        let emptyDivs = ['hidden-letters','failed-letters']
        bodyParts.forEach(part => document.getElementById(part).style.display = 'none')
        emptyDivs.forEach(div => document.getElementById(div).innerHTML = '')
        document.getElementById('secret-word').value = ''
    }
}

let settings = new Settings()

// Check keypresses
document.onkeypress = e => {
    let key = e.key || e.keyIdentifier || e.keyCode
    let letterDiv = document.getElementById('current-letter')

    // Exit function if game hasn't started or if letter was already tried
    if (!settings.gameState || settings.usedLetters.hasOwnProperty(key.toUpperCase())) return

    if (letter(key)) {
        // Print tentative letter choice to DOM
        letterDiv.innerText = key.toUpperCase()

        // Make sure they typed a letter before pressing Enter
    } else if (letterDiv.innerText && key === 'Enter') {
       let [passedCheck, letterLocations] = checkLetters()
       settings.usedLetters[letterDiv.innerText] = letterDiv.innerText
       settings.revealedLetters += letterLocations.length

       // Print incorrect letter choice to DOM
       if (!passedCheck) {
           let incorrectLetters = document.getElementById('failed-letters')
           let span = createElementWithIdAndClass('span', 'inc')
           span.innerText = letterDiv.innerText
           settings.incorrect += 1
           incorrectLetters.appendChild(span)
           revealTheVictim()
       }

       // Reveal letters if correct
       letterLocations.forEach(position => {
           let revealedLetter = document.getElementById(`l-${position}`)
           revealedLetter.innerText = settings.word[position]
       })

       letterDiv.innerText = ' '

       if (checkGameOver()) alert('win')
    }
}

// Reveal a body part div
const revealTheVictim = () => {
    switch (settings.incorrect) {
        case 1:
            document.getElementById('rope').style.display = 'block'
            break;
        case 2:
            document.getElementById('stick-head').style.display = 'block'
            break;
        case 3:
            document.getElementById('stick-body').style.display = 'block'
            break;
        case 4:
            document.getElementById('stick-right-arm').style.display = 'block'
            break;
        case 5:
            document.getElementById('stick-left-leg').style.display = 'block'
            break;
        case 6: 
            document.getElementById('stick-left-arm').style.display = 'block'
            break;
        case 7:
            document.getElementById('stick-right-leg').style.display = 'block'
            break;
        default:
            deathToVictim()
            break;
    }
}

const deathToVictim = () => {
    alert('loss')
    settings.gameState = false
    setTimeout(() => settings = new Settings(), 3000)
}

// Reusable helper functions
const setSettings = (value, property) => settings[property] = value
const letter = ch => /[a-z]/.test(ch) && ch.length === 1
const compareLetters = (l1, l2) => l1.toLowerCase() === l2.toLowerCase()
const checkGameOver = () => settings.word.length && settings.revealedLetters === settings.word.split(' ').join('').length

const createElementWithIdAndClass = (type, clas, id) => {
    let el = document.createElement(type)
    if (clas) el.className = clas
    if (id || typeof id === 'number') el.id = id
    return el
}

// Player pressed start
const handleStart = () => {
 
    if (settings.gameState) return

    let secretWord = document.getElementById('secret-word')
    let value = secretWord.value
    secretWord.blur()
    document.getElementById('cover-settings').style.display = 'block';
    setSettings(value, 'word')
    setSettings(true, 'gameState')

    let hiddenLetters = document.getElementById('hidden-letters')

    // build hidden letter divs in DOM
    let div = createElementWithIdAndClass('div', 'word')

    for (let i = 0; i < settings.word.length; i++) {
        if (settings.word[i] !== ' ') {
            let span = createElementWithIdAndClass('span', 'letter', `l-${i}`)
            div.appendChild(span)
        } else {
            hiddenLetters.appendChild(div)
            div = createElementWithIdAndClass('div', 'word')
        }

        if (i === settings.word.length - 1) hiddenLetters.appendChild(div)
    }
}

// Check if letter is present anywhere in word or phrase
const checkLetters = () => {
    let currentLetter = document.getElementById('current-letter').innerText
    let everyLetterSeperated = settings.word.split('')
    let letterLocations = []
    let isThisLetterPresent = false

    everyLetterSeperated.forEach((l,i) => {
        if (compareLetters(currentLetter, l)) {
            isThisLetterPresent = true
            letterLocations.push(i)
        }
    })

    return [isThisLetterPresent, letterLocations]
}