# 20. Aszinkron JavaScript

## 20.1 Szinkron futás

A JavaScript alapértelmezetten **szinkron** módon fut, azaz az utasítások **egymás után**, sorban hajtódnak végre. Amíg egy utasítás le nem fut, a következő nem kezdődik el.

**Példa:**
```javascript
console.log('Imre');
console.log('Helló');
```

Ez a kód mindig ugyanúgy fut le: először kiírja az "Imre"-t, majd a "Helló"-t.

**Függvényhívással:**
```javascript
const nevKi = () => {
  console.log('Imre');
}
nevKi();
console.log('Helló');
```

Itt is ugyanaz történik: először a függvény fut le ("Imre"), majd a következő sor ("Helló").

---

## 20.2 Aszinkron futtás

A JavaScript kódot egy **környezet** futtatja (pl. böngésző vagy Node.js). Ezek a környezetek biztosítanak olyan **aszinkron** műveleteket, amelyek **nem blokkolják** a többi utasítás futását.

### setTimeout() - időzített futtatás

A `setTimeout()` függvény lehetővé teszi, hogy egy függvényt **később** futtassunk le.

**Szintaxis:**
```javascript
setTimeout(callback_függvény, várakozási_idő_milliszekundumban)
```

**Példa:**
```javascript
const nevKi = () => {
  console.log('Imre');
}

setTimeout(nevKi, 1000);  // 1 másodperc (1000 ms) után fut le
console.log('Üdv');
```

**Mit látunk a konzolon?**
1. Először: "Üdv" (mert ez a sor azonnal lefut)
2. 1 másodperc múlva: "Imre" (mert a setTimeout késlelteti)

**Fontos:** Még **0 milliszekundum** késleltetéssel is aszinkron lesz a futás:
```javascript
const nevKi = () => {
  console.log('Imre');
}
setTimeout(nevKi, 0);  // Még 0 ms is elég!
console.log('Üdv');
```

Eredmény: először "Üdv", majd "Imre" (még akkor is, ha 0 ms a késleltetés).

---

## 20.3 Callback Hell (Callback Pokol)

### Mi a probléma?

Amikor több aszinkron műveletet kell **egymás után** futtatni, és mindegyik az előző eredményére vár, akkor **egymásba ágyazott** callback függvényeket kell használni. Ez a kód **nagyon nehezen olvasható** lesz.

### Példa: Receptek lekérdezése

Képzeljük el, hogy egy gasztroblogról szeretnénk leképezni recepteket. Az oldal lassú, ezért minden kérés **néhány másodpercet** vesz igénybe.

**Lépések:**
1. Lekérjük a recept azonosítókat (2 másodperc)
2. Egy konkrét receptet kérünk le az azonosító alapján (1,5 másodperc)
3. Kategória alapján további recepteket kérünk le (1,5 másodperc)

**Callback Hell megoldás:**
```javascript
function receptLekerdez() {
  setTimeout(() => {
    // 1. lépés: Recept azonosítók lekérése
    const receptID = [676, 102, 34, 1089, 321];
    console.log(receptID);
    
    setTimeout((id) => {
      // 2. lépés: Egy konkrét recept lekérése
      const recept = {
        cim: 'Gulyás leves',
        kategoria: 'Levesek'
      };
      console.log(`${id}: ${recept.cim}`);
      
      setTimeout(kategoria => {
        // 3. lépés: Kategória alapján további receptek
        const levesek = [
          { cim: 'Nyírségi gombócleves', kategoria: 'Levesek' },
          { cim: 'Borsóleves', kategoria: 'Levesek' }
        ];
        console.log(levesek);
      }, 1500, recept.kategoria);
      
    }, 1500, receptID[1]);
    
  }, 2000);
}

receptLekerdez();
```

**Problémák:**
- ❌ Nehezen olvasható
- ❌ Nehezen karbantartható
- ❌ Sok zárójel és behúzás
- ❌ Hibakezelés nehézkes

Ez a jelenség a **Callback Hell** (Callback Pokol).

---

## 20.4 Promise

A **Promise** egy olyan objektum, amely egy **aszinkron művelet eredményét** reprezentálja. Azt jelzi, hogy a művelet:
- ⏳ Még fut (**pending**)
- ✅ Sikeresen befejeződött (**fulfilled**)
- ❌ Sikertelen volt (**rejected**)

### 20.4.1 Promise állapotok

1. **pending** - A művelet még fut, nincs eredmény
2. **fulfilled** - A művelet sikeresen befejeződött, van eredmény
3. **rejected** - A művelet hibával végződött

### 20.4.2 Promise létrehozása

```javascript
const azonositokLekerese = new Promise((resolve, reject) => {
  // Itt történik az aszinkron művelet
});
```

**Fontos:**
- A `new Promise()` egy új Promise objektumot hoz létre
- A paraméter egy **executor függvény**, ami **azonnal lefut**
- Az executor két paramétert kap: `resolve` és `reject`

### 20.4.3 Az executor függvény

Az executor függvény **két paramétert** kap:
- **`resolve`** - Ha a művelet **sikeres**, ezt hívjuk meg az eredménnyel
- **`reject`** - Ha a művelet **sikertelen**, ezt hívjuk meg a hibával

**Példa:**
```javascript
const azonositokLekerese = new Promise((resolve, reject) => {
  setTimeout(() => {
    // 2 másodperc után "visszaérkezik" az adat
    resolve([676, 102, 34, 1089, 321]);
  }, 2000);
});
```

### 20.4.4 Sikeres eredmény kezelése: `then()`

A `then()` metódussal kezeljük a **sikeres** esetet (fulfilled állapot).

```javascript
azonositokLekerese.then((azonositok) => {
  console.log(azonositok);  // [676, 102, 34, 1089, 321]
});
```

**Mit csinál?**
- Megvárja, amíg a Promise **fulfilled** lesz
- A `then()` callback-je megkapja a `resolve()` által átadott értéket
- 2 másodperc után kiírja az azonosítókat

### 20.4.5 Hibakezelés: `catch()`

A `catch()` metódussal kezeljük a **hibás** esetet (rejected állapot).

```javascript
const azonositokLekerese = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Valami hiba történt!");
  }, 2000);
});

azonositokLekerese
  .then((azonositok) => {
    console.log(azonositok);
  })
  .catch((hiba) => {
    console.log(hiba);  // "Valami hiba történt!"
  });
```

### 20.4.6 Promise láncolás

A Promise-ok **összeláncolhatók**, ami sokkal olvashatóbb, mint a Callback Hell.

**Példa: Recept lekérdezés Promise-okkal**

```javascript
// 1. Promise: Recept azonosítók lekérése
const azonositokLekerese = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve([676, 102, 34, 1089, 321]);
  }, 2000);
});

// 2. Promise: Egy konkrét recept lekérése
const receptLekeres = (receptID) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const recept = {
        cim: 'Gulyás leves',
        kategoria: 'Levesek'
      };
      resolve(`${receptID}: ${recept.cim}`);
    }, 1500);
  });
};

// 3. Promise: Kategória alapján receptek lekérése
const kategoriaLekeres = (kategoria) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const levesek = [
        { cim: 'Nyírségi gombócleves', kategoria: 'Levesek' },
        { cim: 'Borsóleves', kategoria: 'Levesek' }
      ];
      resolve(levesek);
    }, 1500);
  });
};

// Promise-ok láncolása
azonositokLekerese
  .then((azonositok) => {
    console.log(azonositok);
    return receptLekeres(azonositok[2]);  // Fontos: return!
  })
  .then((recept) => {
    console.log(recept);
    return kategoriaLekeres('Levesek');  // Fontos: return!
  })
  .then((levesek) => {
    console.log(levesek);
  })
  .catch((hiba) => {
    console.log(hiba);
  });
```

**Hogyan működik?**
1. 2 másodperc után megjönnek az azonosítók
2. 1,5 másodperc múlva megjön a gulyás leves
3. További 1,5 másodperc múlva megjönnek a további levesek

**Fontos szabály:**
- A `then()`-ben **mindig return**-öljük a következő Promise-t!
- Így tudjuk láncolni őket

**Előnyök a Callback Hell-hez képest:**
- ✅ Olvashatóbb
- ✅ Strukturáltabb
- ✅ Könnyebb hibakezelés

---

## 20.5 async és await

A `async/await` egy **még egyszerűbb** szintaxis a Promise-ok kezelésére. Olyan, mintha **szinkron** kódot írnánk, de aszinkron módon fut.

### Szintaxis

```javascript
async function fuggvenyNeve() {
  const eredmeny = await promiseObjektum;
  // Itt már megvan az eredmény
}
```

**Fontos szabályok:**
- Az `await` **csak** `async` függvényen **belül** használható
- Az `await` megvárja, amíg a Promise **fulfilled** lesz
- A hibakezeléshez `try...catch`-et használunk

### Példa: Recept lekérdezés async/await-tel

**Promise láncolás (előző):**
```javascript
azonositokLekerese
  .then((azonositok) => {
    console.log(azonositok);
    return receptLekeres(azonositok[2]);
  })
  .then((recept) => {
    console.log(recept);
    return kategoriaLekeres(recept.kategoria);
  })
  .then((kategoria) => {
    console.log(kategoria);
  })
  .catch((hiba) => {
    console.log(hiba);
  });
```

**Ugyanez async/await-tel:**
```javascript
async function lekeres() {
  try {
    // 1. lépés: Azonosítók lekérése
    const azonositok = await azonositokLekerese;
    console.log(azonositok);
    
    // 2. lépés: Recept lekérése
    const recept = await receptLekeres(azonositok[2]);
    console.log(recept);
    
    // 3. lépés: Kategória alapján receptek
    const kategoria = await kategoriaLekeres(recept.kategoria);
    console.log(kategoria);
    
  } catch (error) {
    console.log(error);
  }
}

lekeres();
```

**Előnyök:**
- ✅ Még olvashatóbb, mint a Promise láncolás
- ✅ Olyan, mintha szinkron kód lenne
- ✅ Könnyebb hibakezelés (`try...catch`)

**Mit csinál az `await`?**
- Megvárja, amíg a Promise **fulfilled** lesz
- Visszaadja az eredményt (mintha a `.then()`-t használtuk volna)
- Ha **rejected** lesz, a `catch` blokk fut le

---

## 20.6 Összefoglalás

### Szinkron vs. Aszinkron

| Szinkron | Aszinkron |
|----------|-----------|
| Utasítások sorban futnak | Utasítások párhuzamosan is futhatnak |
| Blokkolja a többi utasítást | Nem blokkolja a többi utasítást |
| `console.log()`, változó deklaráció | `setTimeout()`, API hívások |

### Callback Hell → Promise → async/await

**Callback Hell:**
```javascript
setTimeout(() => {
  setTimeout(() => {
    setTimeout(() => {
      // Nehezen olvasható!
    }, 1000);
  }, 1000);
}, 1000);
```

**Promise:**
```javascript
promise1
  .then(() => promise2)
  .then(() => promise3)
  .catch((hiba) => console.log(hiba));
```

**async/await:**
```javascript
async function fuggveny() {
  try {
    await promise1;
    await promise2;
    await promise3;
  } catch (hiba) {
    console.log(hiba);
  }
}
```

---

## 20.7 Feladatok

1. **Időzített üzenetek**
   - Írj egy aszinkron függvényt, ami három különböző időzítéssel (1, 2, és 3 másodperc) ír ki egy-egy üzenetet a konzolra.

2. **Véletlenszerű szám generálás**
   - Írj egy aszinkron függvényt, ami egy véletlenszerű idő után (1-5 másodperc) generál egy véletlen számot (1-100) és jelenítse meg.

3. **Gomb események**
   - Hozz létre egy egyszerű HTML oldalt gombbal, ahol a gombra kattintáskor aszinkron módon történik valami (pl. üzenet megjelenítése 1 másodperc késleltetéssel).

4. **Promise láncolás**
   - Írj egy Promise-t használó függvényt, ami három aszinkron műveletet hajt végre egymás után, mindegyik lépés után egy üzenetet jelenít meg.

5. **Virtuális adatbázis**
   - Készíts egy alkalmazást, amely aszinkron módon kezeli és frissíti az adatokat egy virtuális adatbázisban (pl. tömb, objektum).

6. **Regisztrációs folyamat**
   - Készíts egy felhasználói regisztrációs folyamatot, amely aszinkron módon kezeli az adatok ellenőrzését és tárolását.

7. **Bejelentkezési rendszer**
   - Implementálj egy felhasználói bejelentkezési rendszert, amely aszinkron módon ellenőrzi a felhasználói azonosítókat.

8. **Kereső alkalmazás**
   - Hozz létre egy olyan alkalmazást, amely aszinkron módon keres egy adatforrásban, és jeleníti meg az eredményeket a felhasználónak.
