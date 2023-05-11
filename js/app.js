var _a, _b;
import { generateAllCols } from './setup.js';
import * as game from './game.js';
generateAllCols();
const startGame = () => {
    const playerAmount = document.getElementById('spieler-zahl');
    const num = Number.parseInt(playerAmount.value);
    const commands = game.startGame(num);
    if (commands !== null) {
        commands.forEach(execStatement);
    }
};
const roll = () => {
    const n = game.rolled();
    const el = document.getElementById('die1');
    if (n === null)
        return;
    const interval = setInterval(() => {
        const rn = Math.floor(Math.random() * 6) + 1;
        el.textContent = rn.toString();
    }, 50);
    setTimeout(() => {
        clearInterval(interval);
        el.textContent = n.toString();
    }, 1000);
};
function moveHome() {
    const parts = this.id.split('-');
    const field = Number.parseInt(parts[2]);
    const color = parts[1];
    const res = game.MoveFromHome(field, color);
    if (res !== null) {
        res.forEach(execStatement);
        game.changeRound();
    }
    else {
        if (!game.canPlayerMove()) {
            game.changeRound();
        }
    }
}
function move() {
    const field = Number.parseInt(this.id.split('-')[1]);
    const res = game.move(field);
    if (res !== null) {
        res.forEach(execStatement);
        game.changeRound();
    }
    else {
        if (!game.canPlayerMove()) {
            game.changeRound();
        }
    }
}
const execStatement = (obj) => {
    const d1 = document.getElementById(obj.from);
    const d2 = document.getElementById(obj.to);
    d1.textContent = '';
    const el = document.createElement('div');
    el.classList.add(obj.item);
    d2.appendChild(el);
};
(_a = document.getElementById('roll')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', roll);
(_b = document.getElementById('game-start')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', startGame);
document
    .querySelectorAll('.mv-field')
    .forEach((el) => el.addEventListener('click', move));
document
    .querySelectorAll('.home')
    .forEach((el) => el.addEventListener('click', moveHome));
//# sourceMappingURL=app.js.map