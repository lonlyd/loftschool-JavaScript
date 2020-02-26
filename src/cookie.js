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
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    const name = addNameInput.value;
    const value = addValueInput.value;
    const filterValue = filterNameInput.value;

    addTable(name, value);
    addCookie(name, value);
    if (filterValue) {
        if (isMatching(name, filterValue)) {
            addTable(name, value);
        }
    }

});

document.addEventListener('DOMContentLoad', function () {
    // действия после загрузки дом дерева. Нужно загрузить все имеющиеся куки и распарсить их в таблицу
    let cookies = cookieParcer();

    loadCookie(cookies);
    listTable.addEventListener('click', e => {
        if (e.target.classList.contains('BUTTON')) {
            deleteCookie(e.target.cookie.name);
        }
    })

})

function isMatching (string, filterValue) {
    return string.indexOf(filterValue) > -1;
}

function addCookie(name, value) {
    document.cookie = `${ name } = ${ value };`;
}

function loadCookie(cookies) {
    // загрузка имеющихся куки и добавление в таблицу
    listTable.innerHTML = '';
    for (let key in cookies) {
        if (cookies.hasOwnProperty(key)) {
            addTable(key, cookies[key]);
        }
    }
}

function addTable(name, value) {
    // создание таблицы с name и value, плюс создание кнопки удалить
    let table = document.createElement('TABLE');
    let tbody = document.createElement('TBODY');
    let tr = document.createElement('TR');
    let tdName = document.createElement('TD');
    let tdValue = document.createElement('TD');
    let tdDel = document.createElement('TD');
    let button = document.createElement('BUTTON');

    table.appendChild(tbody);
    tbody.appendChild(tr);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDel);
    tdDel.appendChild(button);
    tdName.innerText = name;
    tdValue.innerText = value;
    button.innerText = 'Delete';

    return table;
}

function deleteCookie(name) {
    document.cookie = `${name}=''`;
}

function cookieParcer() {
    // парсинг имеющихся куки
    let cookie = document.cookie;

    return cookie.split('; ').reduce((prev, current) => {
        let [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});

}

