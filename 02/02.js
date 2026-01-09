//Írj egy aszinkron függvényt, ami egy véletlenszerű idő után (1-5 másodperc) generál egy véletlen számot (1-100) és jelenítse meg.

function randomSzám() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.floor(Math.random() * 100) + 1);
        }, Math.floor(Math.random() * 4000) + 1000);
    });
}