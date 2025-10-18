// UI Update Module

// Update quality display
function updateQuality(value) {
    document.getElementById('qualityDisplay').textContent = value + ' ⭐';
}

// Render leaderboards
function renderLeaderboards() {
    renderPointsLeaderboard();
    renderHoursLeaderboard();
}

// Render points leaderboard
function renderPointsLeaderboard() {
    const pointsBoard = getPointsLeaderboard();
    const html = pointsBoard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.name}</span>
            </div>
            <span class="points-display">${user.points} ⭐</span>
        </div>
    `).join('');
    document.getElementById('pointsLeaderboard').innerHTML = html;
}

// Render hours leaderboard
function renderHoursLeaderboard() {
    const hoursBoard = getHoursLeaderboard();
    const html = hoursBoard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.name}</span>
            </div>
            <span class="points-display">${user.avgHours} hrs</span>
        </div>
    `).join('');
    document.getElementById('hoursLeaderboard').innerHTML = html;
}

// Render user history
function renderHistory() {
    const stats = getUserStats();
    document.getElementById('totalPoints').textContent = stats.totalPoints;
    document.getElementById('avgHours').textContent = stats.avgHours;
    document.getElementById('totalNights').textContent = stats.totalNights;
    
    const myLogs = getCurrentUser().logs;
    const historyHTML = myLogs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(log => `
            <div class="log-entry">
                <div class="log-date">${log.date}</div>
                <div class="log-stats">
                    <span>⏰ ${log.hours} hrs</span>
                    <span>⭐ ${log.quality}/10</span>
                    <span style="color: #ffd700;">✨ ${log.points} pts</span>
                </div>
            </div>
        `).join('');
    
    document.getElementById('sleepHistory').innerHTML = historyHTML || 
        '<p style="text-align: center; opacity: 0.6;">No sleep logs yet. Start tracking your sleep!</p>';
}

// Show cohort code after creation
function displayCohortCode(code) {
    document.getElementById('generatedCode').textContent = code;
    document.getElementById('cohortCode').classList.remove('hidden');
}