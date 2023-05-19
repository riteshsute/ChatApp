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

    const senderElement = document.createElement('div');
    senderElement.classList.add('message-sender');
    senderElement.textContent = message.senderName;

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    contentElement.textContent = message.message;

    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);

    chatMessages.appendChild(messageElement);

    addMessageToStorage(message); // Store message in local storage
  });
}

function addMessageToStorage(message) {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];

  // Remove the oldest chat if the limit is reached
  if (messages.length >= 10) {
    messages.shift(); // Remove the first (oldest) chat
  }

  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
}

function getMessagesFromStorage() {
  const messages = localStorage.getItem('messages');
  return messages ? JSON.parse(messages) : [];
}

function UserChats(event) {
  event.preventDefault();
  const message = event.target.chatIn.value;
  const userInfo = getUserInfoFromToken();
  if (!userInfo) {
    console.log('User info is not available');
    return;
  }
  const { userId } = userInfo;
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
  const userInfo = getUserInfoFromToken();
  if (!userInfo || !userInfo.userId || !userInfo.name) {
    console.log('User info is not available');
    return;
  }
  const { userId, name } = userInfo;
  const obj = {
    userId
  };
  axios
    .get('http://localhost:3000/ChatApp/getMessages', { params: obj })
    .then((response) => {
      console.log(response, "LLLLLL")
      const { allMessages } = response.data;
      console.log(response.data)
      console.log(allMessages)
      displayMessages(allMessages); // Display messages from the server
      displayMessages(getMessagesFromStorage()); // Display messages from local storage
      if (!users.includes(name)) {
        addUser(name); // Add user to the user list if not already present
      }
      updateUserList();
    })
    .catch((error) => {
      console.log(error);
    });
};

function getLastReceivedMessageId() {
  const lastMessageId = localStorage.getItem('lastMessageId');
  return lastMessageId ? parseInt(lastMessageId) : 0;
}

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

const userInfo = getUserInfoFromToken();
if (userInfo && userInfo.name) {
  addUser(userInfo.name);
}

function startMessageUpdate() {
    setInterval(() => {
      updateChatWindow();
    }, 1000);
  }

window.addEventListener('DOMContentLoaded', () => {
  updateChatWindow();
  // startMessageUpdate();
});