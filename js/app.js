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
        'cohorts': 'cohortsView',
        'history': 'historyView'
    };
    
    // Show selected view
    document.getElementById(views[viewName]).classList.remove('hidden');
    event.target.classList.add('active');
    
    // Update data for specific views
    if (viewName === 'history') {
        document.getElementById('sleepHistory').innerHTML = '<p style="text-align: center;">Loading...</p>';
        await renderHistory();
    }
    if (viewName === 'cohorts') {
        await renderCohortLeaderboards();
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
        
        // Refresh history if user is on history view
        if (!document.getElementById('historyView').classList.contains('hidden')) {
            await renderHistory();
        }
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
        await renderCohortLeaderboards();
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
        await renderCohortLeaderboards();
    } else {
        alert('Invalid cohort code');
    }
}

// Handle delete log
async function handleDeleteLog(logId) {
    if (!confirm('Are you sure you want to delete this sleep log?')) {
        return;
    }
    
    const success = await deleteSleepLog(logId);
    
    if (success) {
        // Refresh history view
        await renderHistory();
        
        // Also refresh cohort leaderboards if user is in a cohort
        const cohort = await getUserCohort();
        if (cohort && !document.getElementById('cohortsView').classList.contains('hidden')) {
            await renderCohortLeaderboards();
        }
    }
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    document.getElementById('sleepDate').valueAsDate = new Date();
    
    // Initialize stars
    initStars();
    
    // Display username
    document.getElementById('currentUser').textContent = currentUsername;
    
    // Load cohort data
    renderCohortLeaderboards();
});
