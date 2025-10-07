const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

addMessage('Olá! Sou uma IA de sentimentos. Analiso a emoção em suas palavras, mas meu entendimento é simples. Como você se sente?', 'ia');

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const userText = messageInput.value.trim();
    if (userText === '') return;

    addMessage(userText, 'user');
    messageInput.value = '';
    sendButton.disabled = true;

    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'ia-message');
    typingIndicator.textContent = '...';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetch('https://chatbot-backend-m7lg.onrender.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texto: userText })
    })
    .then(response => response.json())
    .then(data => {
        typingIndicator.remove();
        addMessage(data.resposta, 'ia');
    })
    .catch(error => {
        console.error('Erro:', error);
        typingIndicator.remove();
        addMessage('Desculpe, não consegui me conectar ao meu cérebro. Tente novamente mais tarde.', 'ia');
    })
    .finally(() => {
        sendButton.disabled = false;
        messageInput.focus();
    });
});
