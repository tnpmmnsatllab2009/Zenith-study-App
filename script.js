// Intro screen handler
document.getElementById('enter-btn').addEventListener('click', () => {
    const intro = document.getElementById('intro-screen');
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    }, 500);
});

// Tab Navigation
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));

    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Timer Logic
let timerInterval;
function startTimer() {
    clearInterval(timerInterval);
    const minsInput = document.getElementById('study-time').value;
    let totalSeconds = parseInt(minsInput) * 60;
    const display = document.getElementById('timer-display');

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            display.textContent = "Time's up! Great job!";
            updateDashboardTime(parseInt(minsInput));
            return;
        }
        totalSeconds--;
        let m = Math.floor(totalSeconds / 60);
        let s = totalSeconds % 60;
        display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
}

// Voice Recognition (Speech to Text)
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser doesn't support voice recognition. Please type your query.");
        return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ta-IN'; // Tamil support, can be changed
    recognition.onstart = () => { document.getElementById('user-query').placeholder = "Listening... Speak now!"; };
    recognition.onresult = (event) => {
        const speechText = event.results[0][0].transcript;
        document.getElementById('user-query').value = speechText;
        document.getElementById('user-query').placeholder = "Type your topic here or click the mic to speak...";
    };
    recognition.start();
}

// AI Answer / Summary Generator Mockup
function generateAnswer() {
    const grade = document.getElementById('grade-select').value;
    const subject = document.getElementById('subject-select').value;
    const query = document.getElementById('user-query').value.trim();
    const length = document.getElementById('summary-length').value;
    const resultBox = document.getElementById('result-box');

    if (!query) {
        resultBox.innerHTML = `<span style="color: #f43f5e;">Please enter a topic or question first!</span>`;
        return;
    }

    resultBox.innerHTML = `Generating precise summary for Grade ${grade} - ${subject}...`;

    setTimeout(() => {
        let summary = `<strong>[Zenith AI Summary for ${subject} - Grade ${grade}]</strong><br>`;
        if (length === '1line') {
            summary += `• ${query} is a fundamental concept core to mastering ${subject} at standard ${grade}.`;
        } else if (length === '2-3lines') {
            summary += `1. ${query} deals with core principles in ${subject}.<br>2. It helps students understand real-world applications.<br>3. Essential for exams and practical knowledge.`;
        } else if (length === 'bullets') {
            summary += `<ul><li>Topic: ${query}</li><li>Level: Standard ${grade}</li><li>Key takeaway: High academic relevance.</li></ul>`;
        } else {
            summary += `Detailed explanation: ${query} is extensively covered in ${subject}. Students should focus on definitions, formulas/rules, and examples to score top marks in standard ${grade}.`;
        }
        resultBox.innerHTML = summary;
    }, 800);
}

// Notebook Storage
let savedNotesCount = 0;
function saveToNotebook() {
    const resultText = document.getElementById('result-box').innerHTML;
    if (resultText.includes('placeholder-text') || resultText.includes('Generating')) {
        alert('No valid generated content to save!');
        return;
    }

    const container = document.getElementById('notes-container');
    if (savedNotesCount === 0) container.innerHTML = '';

    savedNotesCount++;
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    noteDiv.innerHTML = `<strong>Note #${savedNotesCount}</strong><br>${resultText}`;
    container.appendChild(noteDiv);

    document.getElementById('stat-notes').textContent = savedNotesCount;
    alert('Successfully saved to your Digital Notebook!');
}

function updateDashboardTime(mins) {
    const timeEl = document.getElementById('stat-time');
    let current = parseInt(timeEl.textContent) || 0;
    timeEl.textContent = (current + mins) + " mins";
}
