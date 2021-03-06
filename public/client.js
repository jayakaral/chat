const socket = io();

var username;
var chats = document.querySelector('.container');
var users_list = document.querySelector('.users-list');
var users_count = document.querySelector('.users-count');
var msg_send = document.querySelector('#send-btn');
var user_msg = document.querySelector('#messageInp');
var activeusers = document.querySelector('.activeusers');
var switchbtn = document.querySelector('.navbar button');

do {
    username = prompt('Please enter your name: ')
} while (!username);

user_msg.oninput = () => {
//    if (!user_msg.value.trim()) {
//        msg_send.style.display = "none";
//    } else {
//        msg_send.style.display = "block";
//    }
    msg_send.style.display = user_msg.value.trim() ? 'block' : 'none';
    user_msg.style.height = 'auto';
    user_msg.style.height = user_msg.scrollHeight + 'px';
};

switchbtn.addEventListener('click', () => {
    activeusers.classList.toggle('active');
});

//It will be called when user will join
socket.emit('new-user-joined', username);

//notifying that user is joined
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

// function to create joined/left status div
userJoinLeft = (name, status) => {
    const d = new Date();
    let lt = d.toLocaleTimeString();
    const div = document.createElement('div');
    div.innerHTML = `<b>${lt} | </b>${name} ${status} the chat`;
    div.classList.add('user-join', status);
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

//notifying that user is left
socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'left');
});

//for updating users list and user counts
socket.on('user-list', (users) => {
    users_list.innerHTML = '';
    users_arr = Object.values(users);
    for (let i = 0; i < users_arr.length; i++) {
        let p = document.createElement('li');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
});

// for sending messages
msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    };
    if (user_msg.value != '') {
        appendMessage(data, 'right');
        socket.emit('message', data)
        user_msg.value = '';
        user_msg.focus();
    };
    msg_send.style.display = "none";
    user_msg.style.height = 'auto';
});

appendMessage = (data, status) => {
    const d = new Date();
    let lt = d.toLocaleTimeString();
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `<h5>${data.user} | ${lt}</h5>
                    <p>${data.msg}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data, 'left');
})