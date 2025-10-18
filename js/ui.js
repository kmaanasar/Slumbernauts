// UI Update Module

// Update quality display
function updateQuality(value) {
    document.getElementById('qualityDisplay').textContent = value + ' ⭐';
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

// Render cohort leaderboards (both points and hours)
async function renderCohortLeaderboards() {
    const cohort = await getUserCohort();
    
    if (!cohort) {
        document.getElementById('myCohort').style.display = 'block';
        document.getElementById('cohortTitle').textContent = '👥 Join or Create a Cohort';
        document.getElementById('cohortPointsLeaderboard').innerHTML = 
            '<p style="text-align: center; opacity: 0.6;">Join a cohort to compete with friends!</p>';
        document.getElementById('cohortHoursLeaderboard').innerHTML = 
            '<p style="text-align: center; opacity: 0.6;">Join a cohort to compete with friends!</p>';
        return;
    }
    
    document.getElementById('cohortTitle').textContent = `👥 ${cohort.name}`;
    
    // Render Points Leaderboard
    const pointsLeaderboard = await getCohortLeaderboard(cohort.code);
    const pointsHTML = pointsLeaderboard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.username}</span>
            </div>
            <span class="points-display">${user.points} ⭐</span>
        </div>
    `).join('');
    
    document.getElementById('cohortPointsLeaderboard').innerHTML = pointsHTML ||
        '<p style="text-align: center; opacity: 0.6;">No data yet. Start logging sleep!</p>';
    
    // Render Hours Leaderboard
    const hoursLeaderboard = await getCohortHoursLeaderboard(cohort.code);
    const hoursHTML = hoursLeaderboard.map((user, idx) => `
        <div class="leaderboard-entry ${idx === 0 ? 'first' : ''}">
            <div style="display: flex; align-items: center;">
                <span class="rank">#${idx + 1}</span>
                <span>${user.username}</span>
            </div>
            <span class="points-display">${user.avgHours} hrs</span>
        </div>
    `).join('');
    
    document.getElementById('cohortHoursLeaderboard').innerHTML = hoursHTML ||
        '<p style="text-align: center; opacity: 0.6;">No data yet. Start logging sleep!</p>';
}