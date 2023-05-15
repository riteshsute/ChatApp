
function getUserInfoFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  const { name, userId } = JSON.parse(decodedPayload);
  return { name, userId };
}

function displayMessages(messages) {
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.innerHTML = '';

  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<p>${message.message}</p>`;
    chatMessages.appendChild(messageElement);
  });
}

function UserChats(event) {
  event.preventDefault();
  const message = event.target.chatIn.value;
  const { userId } = getUserInfoFromToken();
  const obj = {
    message,
    userId
  };

  axios
    .post('http://localhost:3000/ChatApp/sendMessage', obj)
    .then((response) => {
      console.log(response.data.messages);
    })
    .catch((error) => {
      console.log(error);
    });
}

const updateChatWindow = () => {
  axios
    .get('http://localhost:3000/ChatApp/getMessages')
    .then((response) => {
      const { allMessages } = response.data;
      displayMessages(allMessages);
    })
    .catch((error) => {
      console.log(error);
    });
};


window.addEventListener('DOMContentLoaded', updateChatWindow);

const users = [];


function updateUserList() {
  const userList = document.getElementById('user-list');
  const userCount = document.querySelector('.user-count');

  userList.innerHTML = '';

 
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user;
    userList.appendChild(li);
  });


  const countText =
    users.length === 1 ? '1 user online' : `${users.length} users online`;
  userCount.textContent = countText;
}


function addUser(username) {
  users.push(username);
  updateUserList();
}


function removeUser(username) {
  const index = users.indexOf(username);
  if (index !== -1) {
    users.splice(index, 1);
    updateUserList();
  }
}


const { name } = getUserInfoFromToken();

if (name) {
  addUser(name);
}


setTimeout(() => {
  addUser('Charlie');
}, 3000);

