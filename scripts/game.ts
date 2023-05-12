import type { MoveCommand } from './types.js'

const players: string[] = []
let currentPlayer: number

enum States {
    Wait,
    Rolled,
    Choose,
    NotStarted,
}

let cState = States.NotStarted
let roll = -1
let rollAmount = 3
const lastNumber = 40

// colors -> startfield nummer
const colorOptions: Record<string, number> = {
    red: 0,
    blue: 10,
    black: 21,
    green: 31,
}

// players  ->  current pos
const gameState: Record<string, number[]> = {}
const homes: Record<string, boolean[]> = {}
const goals: Record<string, boolean[]> = {}

const toHome = (pl: string, ind: number) => `home-${pl}-${ind}`
const toField = (ind: number) => `field-${ind}`
const toGoal = (pl: string, ind: number) => `goal-${pl}-${ind}`

const cp = () => players[currentPlayer]

const changeRoundText = () => {
    const txt = document.getElementById('p-round') as HTMLHeadingElement
    txt.innerText = 'An der Reihe: ' + players[currentPlayer]
}

const resetDice = () => {
    const el = document.getElementById('die1') as HTMLDivElement
    el.textContent = '0'
}

const changeRound = () => {
    currentPlayer++
    if (currentPlayer >= players.length) currentPlayer = 0
    cState = States.Wait
    roll = -1
    const homies = homes[cp()].filter(x => x).length
    const goalies = goals[cp()].filter(x => x).length
    if (homies + goalies >= 4) rollAmount = 3
    else rollAmount = 1
    resetDice()
    changeRoundText()
}

const startGame = (playerNum: number) => {
    if (cState !== States.NotStarted) return null
    if (playerNum < 2 || playerNum > 4) return null
    const playerOptions = Object.keys(colorOptions)
    const setHomes: MoveCommand[] = []
    for (let i = 0; i < playerNum; i++) {
        const pCol = playerOptions[i]
        players.push(pCol)
        gameState[pCol] = []
        homes[pCol] = [true, true, true, true]
        goals[pCol] = [false, false, false, false]
        for (let j = 0; j < 4; j++) {
            setHomes.push({
                from: toHome(pCol, j),
                to: toHome(pCol, j),
                item: pCol,
            })
        }
    }
    cState = States.Wait
    currentPlayer = 0
    changeRoundText()
    return setHomes
}

const canPlayerMove = () => {
    const allHome = homes[cp()].filter(x => x).length
    const allGoal = goals[cp()].filter(x => x).length
    return allHome + allGoal !== 4 || roll === 6
}

const rolled = () => {
    if (cState !== States.Wait) return null
    rollAmount--
    roll = Math.floor(Math.random() * 6) + 1
    if (rollAmount === 0 || roll === 6) cState = States.Rolled
    if (rollAmount == 0 && !canPlayerMove()) {
        changeRound()
        return null
    }
    return roll
}

const canMove = (index: number) => {
    const cc = gameState[cp()].some((x) => index + roll === x)
    const hasOne = gameState[cp()].some((x) => index === x)
    if (cc) return false
    if (cState !== States.Rolled) return false
    if (!hasOne) return false
    return true
}

const testState = () : MoveCommand[] => {
    homes["red"][1] = false
    gameState["red"].push(39)
    return [
        {from: toHome("red", 1), to: toField(39), item: "red"}
    ]
}

const canMoveFromHome = (color: string, index: number) => {
    const infront = gameState[color].some((p) => p === colorOptions[color])
    if (cState !== States.Rolled) return false
    if (color !== cp()) return false
    if (roll !== 6) return false
    if (infront) return false
    if (!homes[color][index]) return false
    return true
}

const move = (index: number): MoveCommand[] | null => {
    const p = cp()
    if (index < colorOptions[p] && index + roll >= colorOptions[p]) 
        return MoveFromGoal(index, p)
    // for a
    if (p === "red" && index + roll > lastNumber)
        return MoveFromGoal(index, p)
    if (!canMove(index)) return null

    let np = index + roll
    if (np > 40) {
        np = np - 41 // 40 -> letztes Feld, wenn 41 spring auf 0 usw.
    }
    const oldIndex = gameState[p].indexOf(index)
    gameState[p][oldIndex] = np

    for (const key in gameState) {
        if (key === p) continue
        for (let i = 0; i < gameState[key].length; i++) {
            if (gameState[key][i] === np) {
                gameState[key].splice(i, 1)
                const hp = homes[key].indexOf(false)
                homes[key][hp] = true

                return [
                    { from: toField(np), to: toHome(key, hp), item: key },
                    { from: toField(index), to: toField(np), item: p },
                ]
            }
        }
    }

    return [{ from: toField(index), to: toField(np), item: p }]
}

const MoveFromHome = (index: number, color: string) => {
    if (!canMoveFromHome(color, index)) return null

    homes[color][index] = false
    const np = colorOptions[color]
    gameState[color].push(np)

    for (let key in gameState) {
        if (key === color) continue
        for (let i = 0; i < gameState[key].length; i++) {
            if (gameState[key][i] === np) {
                gameState[key].splice(i, 1)
                const hp = homes[key].indexOf(false)
                homes[key][hp] = true

                return [
                    { from: toField(np), to: toHome(key, hp), item: key },
                    {
                        from: toHome(color, index),
                        to: toField(np),
                        item: color,
                    },
                ]
            }
        }
    }

    return [{ from: toHome(color, index), to: toField(np), item: color }]
}

const canMoveInGoal = (index: number, color : string, nroll: number) => {
    let hasOne = false
    const p = cp()
    if (nroll !== roll) {
        hasOne = gameState[p].some((x) => index === x)
    } else {
        hasOne = goals[p][index]
    }
    if (index + nroll > 3 && index < 10) 
        return false
    if (!hasOne) return false
    if (cState !== States.Rolled) return false
    if (color !== p) return false
    for (let i = index + 1; i < index + nroll + 1; i++) {
        if (goals[i]) return false
    }
    return true
}

const MoveFromGoal = (index : number, color : string) => {
    let fixed_roll = -1
    let cc = colorOptions[color]-1
    if (cc < 0) cc = 40 // for a

    if (index < 10) fixed_roll = roll
    else fixed_roll = index + roll - cc

    if (!canMoveInGoal(index, color, fixed_roll)) return null
    goals[color][fixed_roll] = true
    if (index < 10) {
        goals[color][index] = false 
        return [{from: toGoal(color, index), to: toGoal(color, index + fixed_roll-1), item: color}]
    } else {
        const rmIndex = gameState[cp()].indexOf(index)
        gameState[cp()].splice(rmIndex, 1)
        return [{from: toField(index), to: toGoal(color, fixed_roll-1), item: color}]
    }
}

const checkWin = () => goals[cp()].every(x => x)

export { 
    startGame, 
    rolled, 
    move, 
    changeRound, 
    MoveFromHome, 
    canPlayerMove, 
    MoveFromGoal, 
    checkWin,
    testState
}
