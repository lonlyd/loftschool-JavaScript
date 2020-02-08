/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        fn(element, i, array);
    }
}
/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let newArr = [];

    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        newArr.push(fn(element, i, array));

    }

    return newArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let prev = 0;
    let i = 0;
    if (initial == undefined) {
        prev = array[0];
        i = 1;
    } else {
        prev = initial;
        i = 0;
    }
    for (i; i < array.length; i++) {
        const element = array[i];

        prev = fn(prev, element, i, array);
        
    }
    
    return prev;
}
/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let array = Object.keys(obj);
    let newArr = [];
    
    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        newArr.push(element.toUpperCase());
    }

    return newArr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    // let newArr = [];
    // if (from == undefined) {
    //     from = 0;
    // }
    // if (to == undefined) {
    //     to = array.length;
    // }
    // if (from >= 0) {
    //     while (from != (to+1)) {
            
    //         newArr.push(array[from]);
    //         from++;
    //     }
    // } else {
    //     let start = array.length + from; 

    //     while (start != (to-1)) {
            
    //         newArr.push(array[start]);
    //         from--;
    //     }
    // }

    // return newArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
