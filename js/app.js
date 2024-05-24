class Settings {
    constructor() {
        this.opponent = ''
        this.word = ''
        this.gameState = false
        this.usedLetters = {}
        this.incorrect = 0
        this.revealedLetters = 0
        this.hold = false
        this.cleanUpDivs()
    }

    stickFigureLimbsInAnArray() {
        let rlDiv = document.getElementById('stick-right-leg')
        let llDiv = document.getElementById('stick-left-leg')
        let raDiv = document.getElementById('stick-right-arm')
        let laDiv = document.getElementById('stick-left-arm')
        let heDiv = document.getElementById('stick-head')
        let boDiv = document.getElementById('stick-body')
        let roDiv = document.getElementById('rope')
        return [rlDiv, llDiv, raDiv, laDiv, heDiv, boDiv, roDiv]
    }
    
    stickFigureInitialStyleValuesInAnArray() {
        let rlRotate = -25
        let rlLeft = 38;
        let raRotate = -25;
        let raLeft = 38;
        let llRotate = 25;
        let llLeft = 15;
        let laRotate = 25;
        let laLeft = 15;
        let heTop = 8;
        let heLeft = 18;
        let boTop = 30;
        return [rlRotate, rlLeft, raRotate, raLeft, llRotate, llLeft, laRotate, laLeft, heTop, heLeft, boTop]
    }

    stickFigureResetStyleValues() {
        let [rlDiv, llDiv, raDiv, laDiv, heDiv, boDiv] = this.stickFigureLimbsInAnArray()
        let [rlRotate, rlLeft, raRotate, raLeft, llRotate, llLeft, laRotate, laLeft, heTop, heLeft, boTop] = this.stickFigureInitialStyleValuesInAnArray()
   
        rlDiv.style.transform = `rotate(${rlRotate}deg)`; 
        rlDiv.style.left = `${rlLeft}px`;
 
        llDiv.style.transform = `rotate(${llRotate}deg)`; 
        llDiv.style.left = `${llLeft}px`;
  
        raDiv.style.transform = `rotate(${raRotate}deg)`; 
        raDiv.style.left = `${raLeft}px`;
 
        laDiv.style.transform = `rotate(${laRotate}deg)`; 
        laDiv.style.left = `${laLeft}px`;
   
        heDiv.style.top = `${heTop}px`; 
        heDiv.style.left = `${heLeft}px`;

        rlDiv.style.top = '70px'
        llDiv.style.top = '70px'
        raDiv.style.top = '40px'
        laDiv.style.top = '40px'
        heDiv.style.top = '8px'
        boDiv.style.top = `${boTop}px`; 
    }

    cleanUpDivs() {
        let emptyDivs = ['hidden-letters','failed-letters']
        emptyDivs.forEach(div => document.getElementById(div).innerHTML = '')
        document.getElementById('secret-word').value = ''
        document.getElementById('cover-settings').style.display = 'none'
    }
}

let settings = new Settings()

// Check keypresses
document.onkeypress = e => {
    let key = e.key || e.keyIdentifier || e.keyCode
    let letterDiv = document.getElementById('current-letter')

    // Alert if non alphanumeric character
    if (notProperLetter(key)) {
        let typedWord = document.getElementById('secret-word')
        alert('invalid character')
        console.log(typedWord.value)
        typedWord.value = typedWord.value.slice(0, typedWord.value.length - 1)   
        console.log(typedWord.value)     
    }

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
       revealLetters(letterLocations)

       letterDiv.innerText = ' '

       if (checkGameOver()) {
        //settings.gameState = false
        increaseWinsFor('p')
        turnLettersThisColor(everyLetterLocation(), 'lime')
        animateFreedom()
        setTimeout(() => {
            document.getElementById('computer').checked = false
            document.getElementById('human').checked = false
            settings.gameState = false
            settings = new Settings()
        }, 3000)
       }
    }
}

// Reveal a letter to the DOM 
const revealLetters = (letterLocations) => {
    letterLocations.forEach(position => {
        let revealedLetter = document.getElementById(`l-${position}`)
        revealedLetter.innerText = settings.word[position]
    })
}

// To turn letters a certain color
const turnLettersThisColor = (letterLocations, color) => {
    letterLocations.forEach(position => {
        let revealedLetter = document.getElementById(`l-${position}`)
        revealedLetter.style.color = color
    })
}

// Retrieve all letter locations for quick reveal
const everyLetterLocation = (gameState) => {
    
    let letterLocations = []

    for (let i = 0; i < settings.word.length; i++) {
        if (settings.word[i] !== ' ') {
            if (!gameState) {
                letterLocations.push(i)
            } else {
                let letterDiv = document.getElementById(`l-${i}`)
                if (!letterDiv.innerText) {
                    letterLocations.push(i)
                }
            }
        }
            
    }

    return letterLocations
}

// Reveal a body part div
const revealTheVictim = () => {

    let [rlDiv, llDiv, raDiv, laDiv, heDiv, boDiv, roDiv] = settings.stickFigureLimbsInAnArray()

    switch (settings.incorrect) {
        case 1:
            roDiv.style.display = 'block'
            break;
        case 2:
            heDiv.style.display = 'block'
            break;
        case 3:
            boDiv.style.display = 'block'
            break;
        case 4:
            raDiv.style.display = 'block'
            break;
        case 5:
            llDiv.style.display = 'block'
            break;
        case 6: 
            laDiv.style.display = 'block'
            break;
        case 7:
            rlDiv.style.display = 'block'
            break;
        default:
            deathToVictim()
            break;
    }
}

const increaseWinsFor = (recipient) => {
    let el = document.getElementById(`${recipient}-win`)
    let newValue = Number(el.innerText)
    newValue++
    el.innerText = newValue
}

const deathToVictim = () => {
    animateHanging()
    turnLettersThisColor(everyLetterLocation('loss'), 'red')
    revealLetters(everyLetterLocation())
    increaseWinsFor('o')
    settings.gameState = false
    settings.hold = true
    setTimeout(() => {
        document.getElementById('computer').checked = false
        document.getElementById('human').checked = false
        settings = new Settings()
    }, 3000)
}

const animateHanging = () => {
    
    let [rlRotate, rlLeft, raRotate, raLeft, llRotate, llLeft, laRotate, laLeft, heTop, heLeft] = settings.stickFigureInitialStyleValuesInAnArray()
    let [rlDiv, llDiv, raDiv, laDiv, heDiv] = settings.stickFigureLimbsInAnArray()

    let interval = setInterval(() => {
        let clearThisInterval = true
        // right leg
        if (rlRotate < -5) {
            clearThisInterval = false
            rlRotate++
            rlDiv.style.transform = `rotate(${rlRotate}deg)`;
        }
        if (rlLeft > 30) {
            clearThisInterval = false
            rlLeft--
            rlDiv.style.left = `${rlLeft}px`
        }
        // left leg
        if (llRotate > 5) {
            clearThisInterval = false
            llRotate--
            llDiv.style.transform = `rotate(${llRotate}deg)`;
        }
        if (llLeft < 22) {
            clearThisInterval = false
            llLeft++
            llDiv.style.left = `${llLeft}px`
        }
        // right arm
        if (raRotate < -5) {
            clearThisInterval = false
            raRotate++
            raDiv.style.transform = `rotate(${raRotate}deg)`;
        }
        if (raLeft > 30) {
            clearThisInterval = false
            raLeft--
            raDiv.style.left = `${raLeft}px`
        }
        // left arm
        if (laRotate > 5) {
            clearThisInterval = false
            laRotate--
            laDiv.style.transform = `rotate(${laRotate}deg)`;
        }
        if (laLeft < 22) {
            clearThisInterval = false
            laLeft++
            laDiv.style.left = `${laLeft}px`
        }
        // head 
        if (heTop < 15) {
            clearThisInterval = false
            heTop++
            heDiv.style.top = `${heTop}px`
        }
        if (heLeft < 25) {
            clearThisInterval = false
            heLeft++
            heDiv.style.left = `${heLeft}px`
        }
        // clear animation interval
        if (clearThisInterval) {
            clearInterval(interval)
            setTimeout(() => animateDissappearance(), 500)
        }        
    }, 10)
}

const animateDissappearance = () => {
    let divArr = settings.stickFigureLimbsInAnArray()

    let opacity = 100;

    let interval = setInterval(() => {
        let { gameState } = settings
        opacity--
        if (!gameState) divArr.forEach(div => div.style.opacity = `${opacity}%`)
        if (!opacity || gameState) clearInterval(interval)
    }, 100)
}

// Reusable helper functions
const setSettings = (value, property) => settings[property] = value
const letter = ch => /[a-z]/.test(ch) && ch.length === 1
const compareLetters = (l1, l2) => l1.toLowerCase() === l2.toLowerCase()
const checkGameOver = () => settings.word.length && settings.revealedLetters === settings.word.split(' ').join('').length
const notProperLetter = ch => !settings.gameState && !letter(ch) && ch !== 'Enter' && ch !== ' '

const createElementWithIdAndClass = (type, clas, id) => {
    let el = document.createElement(type)
    if (clas) el.className = clas
    if (id || typeof id === 'number') el.id = id
    return el
}

const computerWord = async () => {
    let api = 'https://random-word.ryanrk.com/api/en/word/random'
    try {
        let response = await fetch(api)
        let [ word ] = await response.json()
        return word
    } catch(e) {
        console.log('Word API probably stopped working: ' + api, e)
    }
}

// Player pressed start
const handleStart = async () => {
 

    if (settings.gameState || settings.hold) return

    // Game settings initialization
    let secretWord = document.getElementById('secret-word')
    let value = secretWord.value

    try {
        // Player chose computer, so give them a word
        if (settings.opponent === 'computer') value = await computerWord()

        setSettings(value, 'word')
        setSettings(true, 'gameState')
        let divArr = settings.stickFigureLimbsInAnArray()
        divArr.forEach(div => div.style.display = 'none')
        divArr.forEach(div => div.style.opacity = '100%')
        settings.stickFigureResetStyleValues()
        secretWord.blur()
        document.getElementById('cover-settings').style.display = 'block';

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
    } catch (err) {}
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


// jQuery animation portion

const animateFreedom = () => {
    let vitality = settings.incorrect
    console.log(vitality)
    let [rlDiv, llDiv] = settings.stickFigureLimbsInAnArray()
    let [rlRotate, rlLeft, , , llRotate, llLeft] = settings.stickFigureInitialStyleValuesInAnArray()
    llDiv = document.getElementById('stick-left-leg')
    rlDiv = document.getElementById('stick-right-leg')

    switch(vitality) {
        case 2:
            $("#stick-head").animate({ top: '150px'}, 600)
            break;
        default:
            $("#stick-head").animate({ top: '100px'}, 600)
            $("#stick-body").animate({ top: '110px'}, 700)
            $("#stick-right-arm").animate({ top: '110px'}, 700)
            $("#stick-left-arm").animate({ top: '110px'}, 700)
            $("#stick-right-leg").animate({ top: '150px'}, 700)
            $("#stick-left-leg").animate({ top: '150px'}, 700)

            $("#stick-head").animate({ top: '90px'}, 700)
            $("#stick-right-arm").animate({ top: '120px'}, 700)
            $("#stick-left-arm").animate({ top: '120px'}, 700)

  
            break;
    }
}


// Computer random word generator

// https://stackoverflow.com/questions/26622708/how-to-get-random-word-using-wordnik-api-in-javascript

/*
fetch('https://random-words-api.herokuapp.com/w?n=1')
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
*/
