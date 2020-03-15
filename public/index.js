// Initialize variables
var loginPage = document.querySelector('.modal'); // The login page
var usernameInput = document.querySelector('.usernameInput'); // Input for username
var userNicknameInput = document.querySelector('.userNicknameInput'); // Input for username
var loginButton = document.getElementById('loginButton'); //Login button

var contactList = document.querySelector('.contact__list');//The contact list
var contact = document.querySelector('.contact'); // The contact in the contact list
var name = document.querySelectorAll('.name') // The name field

var chatList = document.querySelector('.chat__list'); // The chatroom page
var messages = document.querySelector('.messages'); // Messages area
var inputMessage = document.querySelector('.inputMessage'); // Input message input box
var sendButton = document.getElementById('sendButton'); //Send button

var burger = document.getElementById('burger');
var userpic = document.querySelector('.userpic');
var userpicImg = document.getElementById('userpic');
var userpicInput = document.getElementById('userpicInput');
var loadPic = document.getElementById('loadPic');
var closePic = document.getElementById('closePic');

var date;

// Prompt for setting a username
var username;
var message;
var usernickname;
var connected = true;
var typing = false;
var lastTypingTime;
var userpicResult;

var socket = io();

const login = (usernameInput) => {
    username = usernameInput.value;

    if (!username) {
        alert('Заполните все поля');
    } else {
        socket.emit('add user', username);
        loginPage.style.display = "none";
        contactList.style.display = "block";
        chatList.style.display = "block";

    };
}
const addContact = (username) => {
    let li = document.createElement('li');
    li.classList.add('contact');
    li.innerHTML = `<div class="photo" style="background-image: url('${userpicResult}')"></div>
    <div class="contact__data" id="${socket.id}">
    <span class="name">${username}</span>
    <span class="last__message">${inputMessage}</span></div>`;
    contact.appendChild(li);
}

const removeContact = (id) => {
    let contactToRemove = document.getElementById(id);
    contactToRemove.parentNode.parentNode.removeChild(contactToRemove.parentNode);
}

// Button events
loginButton.addEventListener('click', () => {
    login(usernameInput);
});

sendButton.addEventListener('click', () => {
    sendMessage(inputMessage);
    inputMessage.value = '';
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
    let li = document.createElement('li');
    li.innerHTML = `<span class="photo" style="background-image: url('${userpicResult}')"></span>
    <span class="messageBody">
        <span class="message">${message}</span> 
        <span class="message__date">${date}</span>
    </<span>`;
    messages.appendChild(li);

}

const sendMessage = (inputMessage) => {
    message = inputMessage.value;
    addChatMessage(message);
    socket.emit('new message', message);
}

const replaceLastMessage = (message) => {

}
// Socket events

// Whenever the server emits 'login', log the login message
socket.on('login', () => {
    connected = true;
});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', (data) => {
    addChatMessage(data.message);
    console.log(data);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', (data) => {
    console.log(data.username + ' присоединился к чату');
    addContact(data.username);
    addParticipantsMessage(data);
    
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
    if (username) {
        socket.emit('add user', username);
        addContact(data.username);
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
        userpicResult = userpicImg.src;
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
    if (userpicImg.src = '') {
        userpicImg.style.display = "none";
    } else {
        userpic.style.display = "block";
    };
    userpicForm();
    userpicSelect();
    loadPic.addEventListener('click', () => {
        
        userpic.style.display = "none";
    })
});

const userpicForm = () => {
    userpic.style.display = "table";

}

closePic.addEventListener('click', () => {
    userpic.style.display = "none";
})