// --- Configuration & State ---
const API_KEY = 'YOUR_OPENAI_API_KEY';
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const chatHistory = document.getElementById('chatHistory');
const themeIcon = document.getElementById('themeIcon');
const welcomeScreen = document.getElementById('welcomeScreen');

let history = JSON.parse(localStorage.getItem('chat_history')) || [];

// --- 1. Initialize App ---
window.onload = () => {
    renderHistory();
    
    // Auto-resize textarea logic
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
};

// --- 2. Theme Management ---
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeIcon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
}

// --- 3. Core Messaging Logic ---
async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // UI Updates
    welcomeScreen.style.display = 'none';
    addMessage(text, 'user');
    
    // Reset input
    userInput.value = '';
    userInput.style.height = 'auto';

    // Show AI "Thinking" state
    const aiMsgDiv = addMessage('<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>', 'ai');
    const textElement = aiMsgDiv.querySelector('.text-content');

    try {
        const response = await fetchOpenAIResponse(text);
        textElement.innerHTML = ""; // Clear the typing dots
        typeEffect(textElement, response);
        saveChatToHistory(text);
    } catch (error) {
        textElement.innerHTML = "<em>Error: Failed to fetch response. Please check your API key or connection.</em>";
    }
}

// --- 4. API Integration ---
async function fetchOpenAIResponse(userText) {
    const endpoint = "https://api.openai.com/v1/chat/completions";
    
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Switch to "gpt-4" if you have access
            messages: [
                { role: "system", content: "You are Nexus AI, a helpful, professional assistant." },
                { role: "user", content: userText }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) throw new Error("API call failed");

    const data = await response.json();
    return data.choices[0].message.content;
}

// --- 5. UI Component Builders ---
function addMessage(content, role) {
    const div = document.createElement('div');
    div.classList.add('message', role);
    
    const avatar = role === 'ai' 
        ? '<div class="avatar"><i class="ph ph-sparkle"></i></div>' 
        : '';
    
    div.innerHTML = `
        ${avatar}
        <div class="text-content">${content}</div>
        ${role === 'ai' ? '<button class="copy-btn" onclick="copyText(this)"><i class="ph ph-copy"></i></button>' : ''}
    `;
    
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return div;
}

// Typing animation for that professional feel
function typeEffect(element, text) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, 15); // Adjust speed here (lower is faster)
}

// --- 6. Sidebar & Persistence ---
function saveChatToHistory(firstMsg) {
    const id = Date.now();
    const title = firstMsg.length > 25 ? firstMsg.substring(0, 25) + "..." : firstMsg;
    
    // Prevent duplicate titles for the same session
    if (!history.find(h => h.title === title)) {
        history.unshift({ id, title });
        localStorage.setItem('chat_history', JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    chatHistory.innerHTML = history.length > 0 
        ? history.map(item => `
            <div class="history-item" onclick="createNewChat()">
                <i class="ph ph-chat-centered-text"></i>
                <span>${item.title}</span>
            </div>
        `).join('')
        : '<p style="padding:15px; font-size:0.8rem; color:var(--text-muted)">No history yet</p>';
}

function createNewChat() {
    chatContainer.innerHTML = '';
    welcomeScreen.style.display = 'block';
    chatContainer.appendChild(welcomeScreen);
}

function clearAllHistory() {
    if(confirm("Are you sure you want to delete all chats?")) {
        history = [];
        localStorage.removeItem('chat_history');
        renderHistory();
        createNewChat();
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// --- 7. Utilities ---
function copyText(btn) {
    const text = btn.previousElementSibling.innerText;
    navigator.clipboard.writeText(text);
    
    const icon = btn.querySelector('i');
    icon.className = 'ph ph-check';
    btn.style.color = 'var(--accent)';
    
    setTimeout(() => {
        icon.className = 'ph ph-copy';
        btn.style.color = '';
    }, 2000);
}

// Handle "Enter" key (but allow Shift+Enter for new lines)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});