// Initialize variables
var loginPage = document.querySelector('.modal'); // The login page
var usernameInput = document.querySelector('.usernameInput'); // Input for username
var loginInput = document.querySelector('.userNicknameInput'); // Input for username
var loginButton = document.getElementById('loginButton'); //Login button

var contactList = document.querySelector('.contact__list');//The contact list
var contact = document.querySelector('.contact'); // The contact in the contact list
var name = document.querySelectorAll('.name') // The name field

var chatList = document.querySelector('.chat__list'); // The chatroom page
var messages = document.querySelector('.messages'); // Messages area
var inputMessage = document.querySelector('.inputMessage'); // Input message input box
var sendButton = document.getElementById('sendButton'); //Send button

var burger = document.getElementById('burger');
var userpicmodal = document.querySelector('.userpic');
var userpicImg = document.getElementById('userpic');
var userpicInput = document.getElementById('userpicInput');
var loadPic = document.getElementById('loadPic');
var closePic = document.getElementById('closePic');
var contactData = {};
var date;

// Prompt for setting a username
var username;
var message;
var userlogin;
var connected = true;
var typing = false;
var lastTypingTime;
var userpicResult;

var socket = io();

const login = (usernameInput, loginInput) => {
    username = usernameInput.value;
    userlogin = loginInput.value;
    if (!username || !userlogin) {
        alert('Заполните все поля');
    } else {
        socket.emit('add user', username, userlogin);
        loginPage.style.display = "none";
        userpicmodal.style.display = "table";
    };
}
// const contactDataAdd = function (id, userpic) {
//     contactData = {
//         id: id,
//         userpic: userpic
//     };
    
//     return contactData;
// }

const addToLocalStorage = function (userlogin, userpic) {
    localStorage.setItem(userlogin, userpic);
}

const addContact = (username, userlogin) => {
    console.log('61 Add contact '+ username + ' login: ' + userlogin);
    
    let id = socket.id;
    let keys = Object.keys(localStorage);
    for(let key of keys) {
        if (userlogin == key) {
            let userpicture = localStorage.getItem(key);
            let li = document.createElement('li');
            li.classList.add('contact');
            li.innerHTML = `<div class="photo" style="background-image: url('${userpicture}')"></div>
            <div class="contact__data" id="${id}">
            <span class="name">${username}</span>
            <span class="last__message">${message}</span></div>`;
            contact.appendChild(li);
        }
    }
}
const removeContact = (id) => {
    let contactToRemove = document.getElementById(id);
    contactToRemove.parentNode.removeChild(contactToRemove.parentNode);
}

// Button events
loginButton.addEventListener('click', () => {
    login(usernameInput, loginInput);
    userpicForm();
    userpicSelect();

});

sendButton.addEventListener('click', () => {
    if (inputMessage.value != '') {
        sendMessage(inputMessage);
        inputMessage.value = '';
    }
})

// Press Enter
loginPage.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        loginButton.click();
    }
});

chatList.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        sendButton.click();
    }
});

const addChatMessage = (message) => {
    date = new Date().toLocaleString();
    console.log(message);
    let keys = Object.keys(localStorage);

    console.log('118 Имя пользователя: ' + username, 'Логин пользователя ' + userlogin + ' message: ' + message);

    for(let key of keys) {
        if (userlogin == key) {
            let userpicture = localStorage.getItem(key);
            let li = document.createElement('li');
            li.innerHTML = `<span class="photo" style="background-image: url('${userpicture}')"></span>
            <span class="messageBody">
                <span class="message">${message}</span> 
                <span class="message__date">${date}</span>
            </<span>`;
            messages.appendChild(li);
        } 
    }
}

const sendMessage = (inputMessage) => {
    message = inputMessage.value;
    addChatMessage(message);
    socket.emit('new message', message);
}

const replaceLastMessage = (message) => {
    console.log(message);
    let lastmessange = document.querySelector('.last__message')
    lastmessange.innerText = message;
}

// Socket events

// Whenever the server emits 'login', log the login message
socket.on('login', (data) => {
    connected = true;
    console.log('151 ' + Object.keys(data));
    addContact(data.username, data.userlogin);

});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', (data) => {
    console.log(154 + ' ' + Object.keys(data) + ' дата при join \n ' + userlogin + ' userlogin при join\n' + userpic);
    addParticipantsMessage(data);
    // addContact(data.username, data.userlogin);
    

});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', (data) => {
    addChatMessage(data.message);
    console.log(data);
    replaceLastMessage(data.message);
    if (!data.username) {
        socket.emit('add user', username);
        addContact(data.username, userlogin);
        addParticipantsMessage(data);
        console.log('дошёл сюда!');
    }

});



// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', (data) => {
    console.log(data.username + ' вышел из чата');
    addParticipantsMessage(data);
    console.log(socket.id);
    removeContact(socket.id);
});

socket.on('disconnect', () => {
    console.log('Вы вышли из чата');
    removeContact(socket.id);
});

socket.on('reconnect', () => {
    console.log('Вы переподключились');
    if (data.username) {
        socket.emit('add user', data.username);
        addContact(data.username, data.userlogin);
        addParticipantsMessage(data);
    }
});

socket.on('reconnect_error', () => {
    console.log('Попытка подключения не удалась');
});

const addParticipantsMessage = (data) => {
    var message = '';
    if (data.numUsers === 1) {
        message += "В сети: " + data.username;
    } else {
        message += "В сети " + data.numUsers + " пользователей";
    }
    console.log(message);
}

// Select photo
const userpicSelect = () => {
    var fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
        userpicImg.src = fileReader.result;
        userpic = userpicImg.src;

    });

    userpicInput.addEventListener('change', (e) => {
        let [file] = e.target.files;

        if (file) {
            if (file.size > 500 * 1024) {
                alert('Слишком большой файл')
            } else {
                fileReader.readAsDataURL(file);
            }
        }
    })
}

// Burger menu
burger.addEventListener('click', () => {
    userpicForm();
    userpicSelect();

});

loadPic.addEventListener('click', () => {
    userpicmodal.style.display = "none";
    contactList.style.display = "block";
    chatList.style.display = "block";

    addToLocalStorage(userlogin, userpic);
})

const userpicForm = () => {
    userpicmodal.style.display = "table";
}

closePic.addEventListener('click', () => {
    userpicmodal.style.display = "none";
    contactList.style.display = "block";
    chatList.style.display = "block";
})