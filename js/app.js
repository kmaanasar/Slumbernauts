async function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const views = {
        'log': 'logView',
        'cohorts': 'cohortsView',
        'history': 'historyView'
    };
    
    document.getElementById(views[viewName]).classList.remove('hidden');
    event.target.classList.add('active');
    
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
    submitBtn.textContent = 'Log Sleep & Earn Stars ⭐';
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sleepDate').valueAsDate = new Date();
    
    initStars();
    
    document.getElementById('currentUser').textContent = currentUsername;
    
    renderCohortLeaderboards();
});
