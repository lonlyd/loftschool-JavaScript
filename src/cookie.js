/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    const filterValue = filterNameInput.value;
    const cookies = cookieParcer();
    const filter = cookieFilter(filterValue, cookies);

    loadCookie(filter);
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    const name = addNameInput.value;
    const value = addValueInput.value;
    const filterValue = filterNameInput.value;
    const cookies = cookieParcer();

    addCookie(name, value);
    if (filterValue) {
        if (isMatching(name, filterValue) || isMatching(value, filterValue)) {
            addTable(name, value);
        } else if (cookies.hasOwnProperty(name) && !isMatching(value, filterValue)) {
            deleteTr(getTr(name));
        }
    } else {
        loadCookie(cookieParcer());
    }

});

document.addEventListener('DOMContentLoad', function () {
    // действия после загрузки дом дерева. Нужно загрузить все имеющиеся куки и распарсить их в таблицу
    let cookies = cookieParcer();

    loadCookie(cookies);


});

function isMatching (string, filterValue) {
    let regexp = new RegExp(filterValue, 'i');

    return string.search(regexp) > -1;
}

function addCookie(name, value) {
    if (name) {
        document.cookie = `${name} = ${value};`;
    }
}

function loadCookie(cookies) {
    // загрузка имеющихся куки и добавление в таблицу
    listTable.innerHTML = '';
    for (let cookie in cookies) {
        if (cookies.hasOwnProperty(cookie)) {
            addTable(cookie, cookies[cookie]);
        }
    }
}

function addTable(name, value) {
    // создание таблицы с name и value, плюс создание кнопки удалить
    let tr = document.createElement('TR');
    let tdName = document.createElement('TD');
    let tdValue = document.createElement('TD');
    let tdDel = document.createElement('TD');
    let button = document.createElement('BUTTON');

    tdName.innerText = name;
    tdValue.innerText = value;
    button.innerText = 'Удалить';

    button.dataset.name = name;
    button.classList.add('button');
    tdDel.appendChild(button);
    tr.classList.add(name);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDel);
    listTable.appendChild(tr);

    button.addEventListener('click', () => {
        deleteCookie(button.dataset.name);
        deleteTr(getTr(button.dataset.name));
    })
}

function getTr(name) {
    return document.getElementsByClassName(name)[0];
}

function deleteCookie(name) {
    document.cookie = `${name}='';expires=${new Date(0)}`;
}

function deleteTr(tr) {
    tr.parentNode.removeChild(tr);
}

function cookieParcer() {
    // парсинг имеющихся куки
    let cookie = document.cookie;

    return cookie.split('; ').reduce((prev, current) => {
        let [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {})

}

function cookieFilter(value, cookies) {
    let cookieList = {};

    for (let cookie in cookies) {
        if (isMatching(cookie, value) || isMatching(cookies[cookie], value)) {
            if (cookies.hasOwnProperty(cookie)) {
                cookieList[cookie] = cookies[cookie];
            }
        }
    }

    return cookieList;
}
