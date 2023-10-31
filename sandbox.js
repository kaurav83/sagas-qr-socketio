// Ітератор - об'єкт, за допомогою якого можна перебирати структури, не знаючи їхнього внутрішнього влаштування

/*

Ітератор має метод next() - повертає наступний елемент колекції
Ітератор має властивість done (чи завершили ми обхід об'єкту чи ні)
Ітератор має властивість value - значення елемента

*/

const numbers = [1, 2, 3, 4, 5];

const iterator = numbers[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: 4, done: false }
console.log(iterator.next()); // { value: 5, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

for(const num of numbers) {
    console.log(num);
}

// Задача: Реалізувати кастомний ітератор

const myIterator = {
    data: [10, 20, 30, 40, 50],
    currentIndex: 0,
    next() {
        if(this.currentIndex < this.data.length) {
            return {
                value: this.data[this.currentIndex++],
                done: false
            }
        } else {
            return {
                value: undefined,
                done: true
            }
        }
    }
};

console.log(myIterator.next()); // { value: 10, done: false }
console.log(myIterator.next()); // { value: 20, done: false }
console.log(myIterator.next()); // { value: 30, done: false }
console.log(myIterator.next()); // { value: 40, done: false }
console.log(myIterator.next()); // { value: 50, done: false }
console.log(myIterator.next()); // { value: undefined, done: true }


// Задача: створити об'єкт та перебрати його ітератором

const myObject = {
    name: 'John',
    lastName: 'Doe',
    age: 44,
    city: 'Kyiv'
};

// Створюємо кастомний ітератор під об'єкти

const myObjectIterator = {
    currentKey: Object.keys(myObject)[0],
    next() {
        const keys = Object.keys(myObject);
        const currentIndex = keys.indexOf(this.currentKey) === -1 ? keys.length + 1 : keys.indexOf(this.currentKey);
        if(currentIndex < keys.length) {
            const Key = keys[currentIndex];
            this.currentKey = keys[currentIndex + 1];
            return {
                value: myObject[Key],
                done: false
            }
        }
        return {
            value: undefined,
            done: true
        }
    }
};

console.log(myObjectIterator.next()); // { value: 'John', done: false }
console.log(myObjectIterator.next()); // { value: 'Doe', done: false }
console.log(myObjectIterator.next()); // { value: '44', done: false }
console.log(myObjectIterator.next()); // { value: 'Kyiv', done: false }
console.log(myObjectIterator.next()); // { value: undefined, done: true }


// Генератори

function* myGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const it = myGenerator();

console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: 3, done: false}
console.log(it.next()); // {value: undefined, done: true}

// Задача: написати функцію-генератор, яка приймає початок і кінець.
// Далі, в циклі, йде від початку і до кінця, через yield виводить поточне значення (проміжний результат)

function* mySecondGenerator(start, end) {
    for(let i = start; i <= end; i++) {
        yield i;
    }
}

const it2 = mySecondGenerator(1, 3);

console.log(it2.next()); // {value: 1, done: false}
console.log(it2.next()); // {value: 2, done: false}
console.log(it2.next()); // {value: 3, done: false}
console.log(it2.next()); // {value: undefined, done: true}



// Задача: написати функцію-генератор, яка буде вітатись з користувачем.
// При тому, імені користувача при запуску генератора у нас ще не буде
// Ім'я користувача з'являється ПІСЛЯ запуску генератора


function* myThirdGenerator() {
    let username = yield;
    console.log(`Hi ${username}`);
}

const it3 = myThirdGenerator();

it3.next(); // запуск генератора

it3.next('John Doe'); // передаємо значення генератору

// Асинхронна робота з використанням генераторів

function* fetchUrl(url) {
    try {
        const response = yield fetch(url);
        const data = yield response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const it4 = fetchUrl('https://randomuser.me/api/');

it4.next().value
.then(response => it4.next(response).value)
.then(data => console.log(data));


// Задача 1: написати функцію-генератор, яка генерує числа від 0 до 100
// З кожним викликом число інкрементується на одиниицю

// Задача 2: за допомогою написаного генератора - скласти числа від 0 до 100

function* numberGenerator() {
    let number = 0;
    while(number <= 100) {
        yield number++;
    }
}

let sum = 0;
for (let number of numberGenerator()) {
    sum += number;
}

console.log(sum);