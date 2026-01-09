//Hozz létre egy egyszerű HTML oldalt gombbal, ahol a gombra kattintáskor aszinkron módon történik valami (pl. üzenet megjelenítése 1 másodperc késleltetéssel).

const gomb = document.createElement('button');
gomb.textContent = 'Kattintson!';
gomb.addEventListener('click', () => {
    setTimeout(() => {
        alert('Uzenet megjelenitve!');
    }, 1000);
});
document.body.appendChild(gomb);