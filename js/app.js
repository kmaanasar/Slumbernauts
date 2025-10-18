// Main Application Logic

// Show different views
function showView(viewName) {
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
    if (viewName === 'leaderboard') renderLeaderboards();
    if (viewName === 'history') renderHistory();
}

// Handle sleep log form submission
function logSleep(e) {
    e.preventDefault();
    
    const date = document.getElementById('sleepDate').value;
    const hours = parseFloat(document.getElementById('sleepHours').value);
    const quality = parseInt(document.getElementById('sleepQuality').value);
    
    // Add log to data
    const log = addSleepLog(date, hours, quality);
    
    // Animate stars
    animatePointsEarned(log.points);
    
    // Show success message
    showSuccessMessage(log.points);
    
    // Reset form
    e.target.reset();
    document.getElementById('sleepDate').valueAsDate = new Date();
    updateQuality(5);
}

// Create cohort
function createCohort() {
    const name = document.getElementById('cohortName').value;
    if (!name) {
        alert('Please enter a cohort name');
        return;
    }
    
    const code = createNewCohort(name);
    displayCohortCode(code);
}

// Join cohort
function joinCohort() {
    const code = document.getElementById('joinCode').value;
    const cohort = joinExistingCohort(code);
    
    if (cohort) {
        alert('Successfully joined ' + cohort.name + '!');
        document.getElementById('myCohort').classList.remove('hidden');
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
    
    // Update initial leaderboards
    renderLeaderboards();
});