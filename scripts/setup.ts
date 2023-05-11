const genCol = (index : number, start = false) => {
    const el = document.createElement("div")
    el.classList.add("playable", "mv-field")
    if (start) 
        el.classList.add("start")
    el.id = "field-" + index
    return el
}

const generatePlayCols = (x : number, y : number) => {
    // spielfeld startet oben rechts bei x = 7 & y = 0
    if (y==0 && x==6) return genCol(0, true)
    if (y==1 && x==6) return genCol(1)
    if (y==2 && x==6) return genCol(2)
    if (y==3 && x==6) return genCol(3)
    if (y==4 && x==6) return genCol(4)
    if (y==4 && x==7) return genCol(5)
    if (y==4 && x==8) return genCol(6)
    if (y==4 && x==9) return genCol(7)
    if (y==4 && x==10) return genCol(8)
    if (y==5 && x==10) return genCol(9)
    if (y==6 && x==10) return genCol(10, true)
    if (y==6 && x==9) return genCol(11)
    if (y==6 && x==8) return genCol(12)
    if (y==6 && x==7) return genCol(13)
    if (y==6 && x==6) return genCol(15)
    if (y==7 && x==6) return genCol(16)
    if (y==8 && x==6) return genCol(17)
    if (y==9 && x==6) return genCol(18)
    if (y==10 && x==6) return genCol(19)
    if (y==10 && x==5) return genCol(20)
    if (y==10 && x==4) return genCol(21, true)
    if (y==9 && x==4) return genCol(22)
    if (y==8 && x==4) return genCol(23)
    if (y==7 && x==4) return genCol(24)
    if (y==6 && x==4) return genCol(25)
    if (y==6 && x==3) return genCol(26)
    if (y==6 && x==2) return genCol(27)
    if (y==6 && x==1) return genCol(28)
    if (y==6 && x==0) return genCol(29)
    if (y==5 && x==0) return genCol(30)
    if (y==4 && x==0) return genCol(31, true)
    if (y==4 && x==1) return genCol(32)
    if (y==4 && x==2) return genCol(33)
    if (y==4 && x==3) return genCol(34)
    if (y==4 && x==4) return genCol(35)
    if (y==3 && x==4) return genCol(36)
    if (y==2 && x==4) return genCol(37)
    if (y==1 && x==4) return genCol(38)
    if (y==0 && x==4) return genCol(39)
    if (y==0 && x==5) return genCol(40)
    if (y<2 && x < 2) return genHomeCols("green")
    if (y<2 && x>8) return genHomeCols("red")
    if (y >8 && x < 2) return genHomeCols("black")
    if (y > 8 && x > 8) return genHomeCols("blue")

    return null
}

const generateAllCols = () => {
    const field = document.getElementById('container')
    for (var y = 0; y < 11; y++) {
        for (var x = 0; x < 11; x++) {
            const pDiv = generatePlayCols(x, y)
            if (pDiv == null) {
                const d = document.createElement("div")
                d.classList.add("irrelevant")
                field?.appendChild(d)
            } else {
                field?.appendChild(pDiv)
            }
        }
    }
}

const colors: Record<string, number> = {"red": 0, "blue": 0, "black": 0, "green": 0} 

const genHomeCols = (color : string) => {
    const el = document.createElement("div")
    el.classList.add("playable", "home")
    el.id = `home-${color}-${colors[color]}`
    colors[color]++
    return el
}


export {
    generateAllCols
}