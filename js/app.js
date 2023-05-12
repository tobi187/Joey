var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { generateAllCols } from './setup.js';
import * as game from './game.js';
import { getQuote } from './api.js';
generateAllCols();
const startFields = { "red": 0, "blue": 10, "black": 21, "green": 31 };
const insertQuote = () => __awaiter(void 0, void 0, void 0, function* () {
    const quote = yield getQuote();
    const el = document.getElementById("quote-container");
    el.textContent = `${quote.content}, by ${quote.author}`;
});
insertQuote();
setInterval(insertQuote, 1000 * 60);
const startGame = () => {
    const playerAmount = document.getElementById('spieler-zahl');
    const num = Number.parseInt(playerAmount.value);
    const commands = game.startGame(num);
    if (commands !== null) {
        commands.forEach(execStatement);
        for (let key in startFields) {
            const el = document.getElementById(`field-${startFields[key]}`);
            el.classList.add(`start-${key}`);
        }
    }
};
document.addEventListener("keydown", (ev) => {
    if (ev.altKey) {
        game.testState().forEach(execStatement);
    }
});
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
}
function move() {
    const field = Number.parseInt(this.id.split('-')[1]);
    const res = game.move(field);
    if (res !== null) {
        res.forEach(execStatement);
        game.changeRound();
    }
}
function moveGoal() {
    const parts = this.id.split("-");
    const field = Number.parseInt(parts[2]);
    const color = parts[1];
    const res = game.MoveFromGoal(field, color);
    if (res !== null) {
        res.forEach(execStatement);
    }
    if (game.checkWin()) {
        alert(`${color} Player won`);
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
document
    .querySelectorAll(".goal")
    .forEach((el) => el.addEventListener('click', moveGoal));
//# sourceMappingURL=app.js.map