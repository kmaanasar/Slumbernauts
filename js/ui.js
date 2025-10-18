// UI Update Module

// Update quality display
function updateQuality(value) {
    document.getElementById('qualityDisplay').textContent = value + ' ⭐';
}

// Render leaderboards
async function renderLeaderboards() {
    await renderPointsLeaderboard();
    await renderHoursLeaderboard();
}

// Render points leaderboard
async function renderPointsLeaderboard() {
    const pointsBoard = await getPointsLeaderboard();
    
    const html = pointsBoard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.username}</span>
            </div>
            <span class="points-display">${user.points} ⭐</span>
        </div>
    `).join('');
    
    document.getElementById('pointsLeaderboard').innerHTML = html || 
        '<p style="text-align: center; opacity: 0.6;">No data yet</p>';
}

// Render hours leaderboard
async function renderHoursLeaderboard() {
    const hoursBoard = await getHoursLeaderboard();
    
    const html = hoursBoard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.username}</span>
            </div>
            <span class="points-display">${user.avgHours} hrs</span>
        </div>
    `).join('');
    
    document.getElementById('hoursLeaderboard').innerHTML = html ||
        '<p style="text-align: center; opacity: 0.6;">No data yet</p>';
}

// Render user history
async function renderHistory() {
    const stats = await getUserStats();
    document.getElementById('totalPoints').textContent = stats.totalPoints;
    document.getElementById('avgHours').textContent = stats.avgHours;
    document.getElementById('totalNights').textContent = stats.totalNights;
    
    const myLogs = await getCurrentUserLogs();
    
    const historyHTML = myLogs.map(log => `
        <div class="log-entry">
            <div class="log-date">${log.date}</div>
            <div class="log-stats">
                <span>⏰ ${log.hours} hrs</span>
                <span>⭐ ${log.quality}/10</span>
                <span style="color: #ffd700;">✨ ${log.points} stars</span>
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

// Render cohort leaderboard
async function renderCohortLeaderboard() {
    const cohort = await getUserCohort();
    
    if (!cohort) {
        document.getElementById('myCohort').classList.add('hidden');
        return;
    }
    
    document.getElementById('myCohort').classList.remove('hidden');
    document.querySelector('#myCohort h2').textContent = `👥 ${cohort.name}`;
    
    const leaderboard = await getCohortLeaderboard(cohort.code);
    
    const html = leaderboard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.username}</span>
            </div>
            <span class="points-display">${user.points} ⭐</span>
        </div>
    `).join('');
    
    document.getElementById('cohortLeaderboard').innerHTML = html ||
        '<p style="text-align: center; opacity: 0.6;">No members yet</p>';
}