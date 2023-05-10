var _a, _b;
import { generateAllCols } from './setup.js';
import * as game from './game.js';
generateAllCols();
const startGame = () => {
    const playerAmount = document.getElementById("spieler-zahl");
    const num = Number.parseInt(playerAmount.value);
    game.startGame(num);
};
const roll = () => {
    const n = game.rolled();
    const el = document.getElementById("die1");
    if (n === null)
        return;
    const interval = setInterval(() => {
        const rn = Math.floor(Math.random() * 6) + 1;
        el.textContent = rn.toString();
    }, 50);
    setTimeout(() => clearInterval(interval), 1000);
};
function move() {
    let res;
    if (this.id.includes("home")) {
        const parts = this.id.split("-");
        const field = Number.parseInt(parts[2]);
        const color = parts[1];
        res = game.move(field, color);
    }
    else {
        const field = Number.parseInt(this.id.split("-")[1]);
        res = game.move(field);
    }
    if (res !== null) {
    }
}
const execStatement = (obj) => {
    const d1 = document.getElementById(obj.from);
    const d2 = document.getElementById(obj.to);
    d1.innerHTML = "";
    const el = document.createElement("div");
    el.classList.add(obj.color);
    d2.appendChild(el);
};
(_a = document.getElementById("roll")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", roll);
(_b = document.getElementById("game-start")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", startGame);
document.querySelectorAll(".mv-field").forEach((el) => el.addEventListener("click", move));
