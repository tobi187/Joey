const players = [];
let currentPlayer;
var States;
(function (States) {
    States[States["Wait"] = 0] = "Wait";
    States[States["Rolled"] = 1] = "Rolled";
    States[States["Choose"] = 2] = "Choose";
})(States || (States = {}));
let cState = States.Wait;
let roll = -1;
const colorOptions = { "red": 0, "blue": 10, "black": 21, "green": 31 };
const gameState = {};
const homes = {};
const toHome = (pl, ind) => pl + "-" + homes[pl][ind];
const cp = () => players[currentPlayer];
const changeRoundText = () => {
    const txt = document.getElementById("p-round");
    txt.innerText = "An der Reihe: " + players[currentPlayer];
};
const startGame = (playerNum) => {
    const playerOptions = Object.keys(colorOptions);
    for (let i = 0; i < playerNum; i++) {
        players.push(playerOptions[i]);
        homes[playerOptions[i]] = [true, true, true, true];
    }
    currentPlayer = 0;
    changeRoundText();
};
const rolled = () => {
    if (cState !== States.Wait)
        return { num: null, from: null, to: null };
    roll = Math.floor(Math.random() * 6) + 1;
    return roll;
};
const canMove = (index) => {
    if (gameState[cp()].indexOf(index) === -1)
        return false;
    const cc = gameState[cp()].some(x => index + roll === x);
    if (cc)
        return false;
    return true;
};
const canMoveFromHome = (color) => {
    if (roll !== 6)
        return false;
    const infront = gameState[color].some(p => p === colorOptions[color]);
    if (infront)
        return false;
    if (color !== cp())
        return false;
    return true;
};
const move = (index, color = "") => {
    let canContinue;
    if (color === "")
        canContinue = canMove(index);
    else
        canContinue = canMoveFromHome(color);
    if (!canContinue)
        return null;
    const np = index + roll;
    let rm;
    let home;
    for (const key in gameState) {
        if (key === cp())
            continue;
        for (let i = 0; i < gameState[key].length; i++) {
            if (gameState[key][i] === np) {
                rm = `field-${gameState[key][i]}`;
                gameState[key].splice(i, 1);
                const hp = homes[key].indexOf(false);
                homes[key][hp] = true;
                home = `home-${key}-${hp}`;
                break;
            }
        }
    }
    if (rm === null) {
        return [{ from: index, to: np, color: cp() }];
    }
    else {
        return [
            { from: rm, to: np, color: col },
            { from: index, to: np, color: cp() }
        ];
    }
};
export { startGame, rolled, move };
