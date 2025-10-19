async function showView(viewName, button) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const views = {
        'log': 'logView',
        'cohorts': 'cohortsView',
        'history': 'historyView',
        'ai': 'aiView'
    };
    
    document.getElementById(views[viewName]).classList.remove('hidden');
    if (button) button.classList.add('active');
    
    if (viewName === 'history') {
        document.getElementById('sleepHistory').innerHTML = '<p style="text-align: center;">Loading...</p>';
        await renderHistory();
    }
    if (viewName === 'cohorts') {
        await renderCohortLeaderboards();
    }
}

async function logSleep(e) {
    e.preventDefault();
    
    const date = document.getElementById('sleepDate').value;
    const hours = parseFloat(document.getElementById('sleepHours').value);
    const quality = parseInt(document.getElementById('sleepQuality').value);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    const log = await addSleepLog(date, hours, quality);
    
    if (log) {
        animatePointsEarned(log.points);

        showSuccessMessage(log.points);
        
        e.target.reset();
        document.getElementById('sleepDate').valueAsDate = new Date();
        updateQuality(5);
        
        if (!document.getElementById('historyView').classList.contains('hidden')) {
            await renderHistory();
        }
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = '✨ log sleep & earn stars';
}

async function createCohort() {
    const name = document.getElementById('cohortName').value;
    if (!name) {
        alert('Please enter a spaceship name');
        return;
    }
    
    const code = await createNewCohort(name);
    if (code) {
        displayCohortCode(code);
        await renderCohortLeaderboards();
    }
}

async function joinCohort() {
    const code = document.getElementById('joinCode').value.toUpperCase();
    if (!code) {
        alert('Please enter a spaceship code'); 
        return;
    }
    
    const cohort = await joinExistingCohort(code);
    
    if (cohort) {
        alert('Successfully joined ' + cohort.name + '!');
        await renderCohortLeaderboards();
    } else {
        alert('Invalid spaceship code. Please try again.');
    }
}

async function handleDeleteLog(logId) {
    if (!confirm('Are you sure you want to delete this sleep log?')) {
        return;
    }
    
    const success = await deleteSleepLog(logId);
    
    if (success) {
        await renderHistory();
        
        const cohort = await getUserCohort();
        if (cohort && !document.getElementById('cohortsView').classList.contains('hidden')) {
            await renderCohortLeaderboards();
        }
    }
}

// AI Functions

async function getAIAnalysis() {
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<span class="loading-dots">analyzing your sleep data</span>';
    
    const logs = await getCurrentUserLogs();
    const analysis = await analyzeSleepWithAI(logs);
    
    resultDiv.innerHTML = analysis;
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatDiv = document.getElementById('chatMessages');
    
    // Add user message
    chatDiv.innerHTML += `
        <div class="chat-message user">
            <strong>you:</strong>
            ${message}
        </div>
    `;
    
    // Add loading
    const loadingId = 'loading_' + Date.now();
    chatDiv.innerHTML += `
        <div class="chat-message ai" id="${loadingId}">
            <strong>ai coach:</strong>
            <span class="loading-dots">thinking</span>
        </div>
    `;
    
    chatDiv.scrollTop = chatDiv.scrollHeight;
    input.value = '';
    
    // Get AI response
    const logs = await getCurrentUserLogs();
    const response = await chatWithSleepAI(message, logs);
    
    // Remove loading and add response
    document.getElementById(loadingId).remove();
    chatDiv.innerHTML += `
        <div class="chat-message ai">
            <strong>ai coach:</strong>
            ${response}
        </div>
    `;
    
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function quickChat(message) {
    document.getElementById('chatInput').value = message;
    sendChatMessage();
}

async function getDailyTip() {
    const tipDiv = document.getElementById('dailyTip');
    tipDiv.classList.remove('hidden');
    tipDiv.innerHTML = '<span class="loading-dots">getting a tip for you</span>';
    
    const tip = await getQuickTip();
    tipDiv.innerHTML = '💡 ' + tip;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sleepDate').valueAsDate = new Date();
    
    initStars();
    
    document.getElementById('currentUser').textContent = currentUsername;
    
    renderCohortLeaderboards();
});