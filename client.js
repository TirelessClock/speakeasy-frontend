const socket = io('https://speakeasy-backend.onrender.com/');

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".messages-region");
const messageIconTop = document.getElementById("icon_top");
const nameInput = document.getElementById("nickname");
const form2 = document.getElementById("name_input");
const side_bar = document.getElementById("online-bar")
var audio = new Audio('ting.mp3');
const default_butt = document.getElementById("default_button");
const list_nick = ["Frankenstein", "MJ", "Tolstoy", "Elsa", "Stark", "Sheldon", "Cleopatra", "Dio", "Dobby","Oppenheimer", "Heisenberg", "Aegon", "Batman", "Phil", "Alpha", "Grimes", "Jon", "Tyrion", "Bilbo", "Vader", "Lofi", "Stewie", "Sparrow", "House", "Albus"];

socket.on('ambadwithnames', users => {
    for(var key in users){
        const nameElement = document.createElement('div');
        nameElement.innerText = `${users[key]}`;
        if(key == socket.id){
            nameElement.style.color = "rgb(0,255,0)";
        }
        nameElement.classList.add("nicknames");
        side_bar.append(nameElement);
    }
})


const append_new_user = (name) => {
    const messageElement = document.createElement('div');
    const nameElement = document.createElement('div');
    nameElement.innerText = `${name}`;
    messageElement.innerText = `< ${name} has entered the chat >`;
    messageElement.classList.add("new-user");
    nameElement.classList.add("nicknames");
    audio.play();

    side_bar.append(nameElement);
    messageContainer.append(messageElement);

    messageIconTop.href = "icon-light.png";
    setTimeout(function(){
        messageIconTop.href = "icon-dark.png";
    },4000)
}

const typing_indicator = (name) => {
    const messageElement = document.getElementById("typing-indc");
    // messageElement.classList.add("istyping");
    messageElement.innerText = `${name} is typing...`;

}

const left_chat = (message) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add("new-user");

    audio.play();
    messageContainer.append(messageElement);
    messageIconTop.href = "icon-light.png";
    setTimeout(function(){
        messageIconTop.href = "icon-dark.png";
    },4000)
}

const append_new_message = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageElement.classList.add("addition");
    if(position=="left") audio.play();
    messageContainer.append(messageElement);
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
    
    if(position=='left'){
        messageIconTop.href = "icon-light.png";
        messageElement.style.borderColor = 'red';
        setTimeout(function(){
            messageElement.style.borderColor = 'white';
            messageIconTop.href = "icon-dark.png";
        },4000)
    }

}

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    if(message != ''){
        append_new_message(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
})

default_butt.addEventListener("click",(e)=>{
    e.preventDefault();
    name= list_nick[Math.floor(Math.random()*list_nick.length)];
    socket.emit('new-user-joined', name);
    socket.on('user-joined', name=>{
        append_new_user(name)
    })
    document.getElementById("front-page").remove();
})

form2.addEventListener("submit", (e)=>{
    e.preventDefault();
    var idx = 0; 
    var name = nameInput.value;

    if(name.length > 20){
        const b = document.getElementById("stoff");
        if(b != null){
            document.getElementById("stoff").remove();
        }
        const a = document.createElement('div');
        a.setAttribute("id","stoff");
        a.innerText = "*Please enter a nickname with less than 20 characters";
        a.style.color = "red";
        form2.append(a);
        nameInput.value = '';
        name = '';
    }
    if(name != ''){
        socket.emit('new-user-joined', name);
        socket.on('user-joined', name=>{
            append_new_user(name)
        })
        document.getElementById("front-page").remove();
    }
})

socket.on('receive', data=>{
    append_new_message(`${data.name}: ${data.message}`, 'left')
})

socket.on('leave', name =>{
    left_chat(`< ${name} has left the chat >`)
})

