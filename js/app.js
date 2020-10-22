class Settings {
    constructor() {
        this.opponent = ''
        this.word = ''
        this.gameState = false
        this.usedLetters = {}
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
        letterDiv.innerText = key.toUpperCase()
        // Make sure they typed a letter before pressing Enter
    } else if (letterDiv.innerText && key === 'Enter') {
       let [passedCheck, letterLocations] = checkLetters()
       settings.usedLetters[letterDiv.innerText] = letterDiv.innerText
       letterDiv.innerText = ''
       console.log(settings.usedLetters)
       console.log(passedCheck)
       console.log(letterLocations)
    }
}

// Reusable helper functions
const setSettings = (value, property) => settings[property] = value
const letter = ch => /[a-z]/.test(ch) && ch.length === 1
const compareLetters = (l1, l2) => l1.toLowerCase() === l2.toLowerCase()

const createElementWithIdAndClass = (type, clas, id) => {
    let el = document.createElement(type)
    if (clas) el.className = clas
    if (id || typeof id === 'number') el.id = id
    return el
}

// Player pressed start
const handleStart = () => {
    let value = document.getElementById('secret-word').value
    setSettings(value, 'word')
    setSettings(true, 'gameState')

    let hiddenLetters = document.getElementById('hidden-letters')

    // build hidden letter divs in DOM
    let div = createElementWithIdAndClass('div', 'word')

    for (let i = 0; i < settings.word.length; i++) {
        if (settings.word[i] !== ' ') {
            let span = createElementWithIdAndClass('span', 'letter', i)
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
    
    /*
    let words = settings.word.split(' ')
    let wordBank = {}
    let isThisLetterPresent = false

    words.forEach((currentWord, index) => {
        wordBank[index] = []
        let lettersInWord = currentWord.split('')

        lettersInWord.forEach((l,i) => {
            if (compareLetters(currentLetter, l)) {
                isThisLetterPresent = true
                wordBank[index].push(i)
            }
        })
    })
    */

    return [isThisLetterPresent, letterLocations]
}