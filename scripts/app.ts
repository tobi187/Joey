import { generateAllCols } from './setup.js'
import * as game from './game.js'
import type { MoveCommand } from './types.js'

generateAllCols()

const startGame = () => {
    const playerAmount = document.getElementById(
        'spieler-zahl'
    ) as HTMLInputElement
    const num = Number.parseInt(playerAmount.value)
    const commands = game.startGame(num)
    if (commands !== null) {
        commands.forEach(execStatement)
    }
}

const roll = () => {
    const n = game.rolled()
    const el = document.getElementById('die1') as HTMLDivElement
    if (n === null) return
    const interval = setInterval(() => {
        const rn = Math.floor(Math.random() * 6) + 1
        el.textContent = rn.toString()
    }, 50)
    setTimeout(() => {
        clearInterval(interval)
        el.textContent = n.toString()
    }, 1000)
}

function moveHome(this: HTMLElement) {
    const parts = this.id.split('-')
    const field = Number.parseInt(parts[2])
    const color = parts[1]
    const res = game.MoveFromHome(field, color)

    if (res !== null) {
        res.forEach(execStatement)
        game.changeRound()
    } else {
        // anders lösen
        if (!game.canPlayerMove()) {
            game.changeRound()
        }
    }
}

function move(this: HTMLElement) {
    const field = Number.parseInt(this.id.split('-')[1])
    const res = game.move(field)

    if (res !== null) {
        res.forEach(execStatement)
        game.changeRound()
    } else {
        if (!game.canPlayerMove()) {
            game.changeRound()
        }
    }
}

const execStatement = (obj: MoveCommand) => {
    const d1 = document.getElementById(obj.from) as HTMLDivElement
    const d2 = document.getElementById(obj.to) as HTMLDivElement
    d1.textContent = ''
    const el = document.createElement('div')
    el.classList.add(obj.item)
    d2.appendChild(el)
}

document.getElementById('roll')?.addEventListener('click', roll)
document.getElementById('game-start')?.addEventListener('click', startGame)
document
    .querySelectorAll('.mv-field')
    .forEach((el) => (el as HTMLElement).addEventListener('click', move))
document
    .querySelectorAll('.home')
    .forEach((el) => (el as HTMLElement).addEventListener('click', moveHome))
