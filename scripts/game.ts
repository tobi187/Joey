const players: string[] = []
let currentPlayer: number

enum States {
    Wait, Rolled, Choose
}  

let cState = States.Wait
let roll = -1

// colors -> startfield nummer
const colorOptions: Record<string, number> = {"red": 0, "blue": 10, "black": 21, "green": 31}

// players  ->  current pos (home = 99)
const gameState : Record<string, number[]> = {}
const homes : Record<string, boolean[]> = {}

const toHome = (pl: string, ind: number) => pl + "-" + homes[pl][ind]

const cp = () => players[currentPlayer]

const changeRoundText = () => {
    const txt = document.getElementById("p-round") as HTMLHeadingElement
    txt.innerText = "An der Reihe: " + players[currentPlayer]
}

const startGame = (playerNum : number) => {
    const playerOptions = Object.keys(colorOptions)
    for (let i =0; i < playerNum; i++) {
        players.push(playerOptions[i])
        homes[playerOptions[i]] = [true, true, true, true]
    }

    currentPlayer = 0
    changeRoundText()
}

const rolled = () => {
    if (cState !== States.Wait) 
        return { num: null, from: null, to: null };
    
    roll = Math.floor(Math.random() * 6) + 1;
    return roll
}

const canMove = (index: number) => {
    if (gameState[cp()].indexOf(index) === -1) return false
    const cc = gameState[cp()].some(x => index + roll === x)
    if (cc) return false
    return true
}

const canMoveFromHome = (color: string) => {
    if (roll !== 6) return false
    const infront = gameState[color].some(p => p === colorOptions[color])
    if (infront) return false
    if (color !== cp()) return false
    return true
}

const move = (index : number, color = "") => {
    let canContinue : boolean
    if (color === "") canContinue = canMove(index)
    else canContinue = canMoveFromHome(color)

    if (!canContinue) return null

    const np = index + roll
    let rm: string | null = null
    let home: string | null = null
    let col: string | null = null

    for (const key in gameState) {
        if (key === cp()) continue
        for (let i = 0; i < gameState[key].length; i++) {
            if (gameState[key][i] === np) {
                rm = `field-${gameState[key][i]}`
                col = key
                gameState[key].splice(i, 1)
                const hp = homes[key].indexOf(false)
                homes[key][hp] = true
                home = `home-${key}-${hp}`
                break
            }
        }
    }

    if (rm === null) {
        return [{from: index, to: np, item: cp()}]
    } else {
        return [
            {from: np, to: home, item: col},
            {from: index, to: np, item: cp()}
        ]
    }
}

export {
    startGame,
    rolled,
    move
}