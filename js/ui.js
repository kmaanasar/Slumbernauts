// UI Update Module

// Update quality display
function updateQuality(value) {
    document.getElementById('qualityDisplay').textContent = value + ' ⭐';
}

// Render user history
async function renderHistory() {
    try {
        // Show loading state
        document.getElementById('sleepHistory').innerHTML = '<p style="text-align: center;">Loading...</p>';
        
        // Fetch stats
        const stats = await getUserStats();
        console.log('Stats:', stats); // Debug log
        
        document.getElementById('totalPoints').textContent = stats.totalPoints;
        document.getElementById('avgHours').textContent = stats.avgHours;
        document.getElementById('totalNights').textContent = stats.totalNights;
        
        // Fetch logs
        const myLogs = await getCurrentUserLogs();
        console.log('My logs:', myLogs); // Debug log
        
        if (myLogs.length === 0) {
            document.getElementById('sleepHistory').innerHTML = 
                '<p style="text-align: center; opacity: 0.6;">No sleep logs yet. Start tracking your sleep!</p>';
            return;
        }
        
        const historyHTML = myLogs.map(log => `
            <div class="log-entry">
                <div>
                    <div class="log-date">${log.date || 'No date'}</div>
                    <div class="log-stats">
                        <span>⏰ ${log.hours || 0} hrs</span>
                        <span>⭐ ${log.quality || 0}/10</span>
                        <span style="color: #ffd700;">✨ ${log.points || 0} stars</span>
                    </div>
                </div>
                <button class="delete-btn" onclick="handleDeleteLog('${log.id}')" title="Delete entry">
                    🗑️
                </button>
            </div>
        `).join('');
        
        document.getElementById('sleepHistory').innerHTML = historyHTML;
    } catch (error) {
        console.error('Error rendering history:', error);
        document.getElementById('sleepHistory').innerHTML = 
            '<p style="text-align: center; color: #ff6b6b;">Error loading history. Check console for details.</p>';
    }
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