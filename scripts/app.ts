import { generateAllCols } from './setup.js';
import * as game from './game.js';

generateAllCols()

const startGame = () => {
    const playerAmount = document.getElementById("spieler-zahl") as HTMLInputElement
    const num = Number.parseInt(playerAmount.value)
    game.startGame(num)
}

const roll = () => {
    const n = game.rolled()
    const el = document.getElementById("die1") as HTMLDivElement
    if (n === null) return
    const interval = setInterval(() => {
        const rn = Math.floor(Math.random() * 6) + 1
        el.textContent = rn.toString()
    }, 50)
    setTimeout(() => clearInterval(interval), 1000)
}

function move(this: HTMLElement) {
    let res: {from: string, to: string, color: string}[] | null
    if (this.id.includes("home")) {
        const parts = this.id.split("-")
        const field = Number.parseInt(parts[2])
        const color = parts[1]
        res = game.move(field, color)
    } else {
        const field = Number.parseInt(this.id.split("-")[1])
        res = game.move(field)
    }
    if (res !== null) {
        
    }
}

const execStatement = (obj: {from: string, to: string, color: string}) => {
    const d1 = document.getElementById(obj.from) as HTMLDivElement
    const d2 = document.getElementById(obj.to) as HTMLDivElement
    d1.innerHTML = ""
    const el = document.createElement("div")
    el.classList.add(obj.color)
    d2.appendChild(el)
}


document.getElementById("roll")?.addEventListener("click", roll)
document.getElementById("game-start")?.addEventListener("click", startGame)
document.querySelectorAll(".mv-field").forEach(
    (el) => (el as HTMLElement).addEventListener("click", move))