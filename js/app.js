// Main Application Logic

// Show different views
async function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // View mapping
    const views = {
        'log': 'logView',
        'leaderboard': 'leaderboardView',
        'cohorts': 'cohortsView',
        'history': 'historyView'
    };
    
    // Show selected view
    document.getElementById(views[viewName]).classList.remove('hidden');
    event.target.classList.add('active');
    
    // Update data for specific views
    if (viewName === 'leaderboard') {
        document.getElementById('pointsLeaderboard').innerHTML = '<p style="text-align: center;">Loading...</p>';
        document.getElementById('hoursLeaderboard').innerHTML = '<p style="text-align: center;">Loading...</p>';
        await renderLeaderboards();
    }
    if (viewName === 'history') {
        document.getElementById('sleepHistory').innerHTML = '<p style="text-align: center;">Loading...</p>';
        await renderHistory();
    }
    if (viewName === 'cohorts') {
        await renderCohortLeaderboard();
    }
}

// Handle sleep log form submission
async function logSleep(e) {
    e.preventDefault();
    
    const date = document.getElementById('sleepDate').value;
    const hours = parseFloat(document.getElementById('sleepHours').value);
    const quality = parseInt(document.getElementById('sleepQuality').value);
    
    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    // Add log to Firebase
    const log = await addSleepLog(date, hours, quality);
    
    if (log) {
        // Animate stars
        animatePointsEarned(log.points);
        
        // Show success message
        showSuccessMessage(log.points);
        
        // Reset form
        e.target.reset();
        document.getElementById('sleepDate').valueAsDate = new Date();
        updateQuality(5);
    }
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log Sleep & Earn Stars ⭐';
}

// Create cohort
async function createCohort() {
    const name = document.getElementById('cohortName').value;
    if (!name) {
        alert('Please enter a cohort name');
        return;
    }
    
    const code = await createNewCohort(name);
    if (code) {
        displayCohortCode(code);
        await renderCohortLeaderboard();
    }
}

// Join cohort
async function joinCohort() {
    const code = document.getElementById('joinCode').value.toUpperCase();
    if (!code) {
        alert('Please enter a cohort code');
        return;
    }
    
    const cohort = await joinExistingCohort(code);
    
    if (cohort) {
        alert('Successfully joined ' + cohort.name + '!');
        await renderCohortLeaderboard();
    } else {
        alert('Invalid cohort code');
    }
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    document.getElementById('sleepDate').valueAsDate = new Date();
    
    // Initialize stars
    initStars();
    
    // Load initial data
    renderLeaderboards();
    renderCohortLeaderboard();
});