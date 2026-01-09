//Írj egy aszinkron függvényt, ami három különböző időzítéssel (1, 2, és 3 másodperc) ír ki egy-egy üzenetet a konzolra.

function időzítettÜzenetek() {
    setTimeout(() => {
        console.log('1 masodperc');
    }, 1000);
    setTimeout(() => {
        console.log('2 masodperc');
    }, 2000);
    setTimeout(() => {
        console.log('3 masodperc');
    }, 3000);
}
időzítettÜzenetek();
// 2. **promise alapú időzítés**

function időzítettPromise(idő){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Eltelt ${idő / 1000} masodperc`);
        }, idő);
    });
}

async function időzítettÜzenetek() {
    console.log(await időzítettPromise(1000));
    console.log(await időzítettPromise(2000));
    console.log(await időzítettPromise(3000));
}

