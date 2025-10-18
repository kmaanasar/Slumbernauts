// Data Management Module

// User data structure
let users = [
    { name: 'You', logs: [] },
    { name: 'Luna Explorer', logs: generateRandomLogs(15) },
    { name: 'Star Chaser', logs: generateRandomLogs(12) },
    { name: 'Moon Walker', logs: generateRandomLogs(18) },
    { name: 'Cosmic Dreamer', logs: generateRandomLogs(10) }
];

// Cohort storage
let cohorts = {};

// Generate random sleep logs for demo users
function generateRandomLogs(count) {
    const logs = [];
    for (let i = 0; i < count; i++) {
        logs.push({
            date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
            hours: 5 + Math.random() * 4,
            quality: Math.floor(Math.random() * 5) + 5,
            points: 0
        });
    }
    // Calculate points for each log
    logs.forEach(log => {
        log.points = calculatePoints(log.hours, log.quality);
    });
    return logs;
}

// Calculate points based on hours and quality
function calculatePoints(hours, quality) {
    const hourPoints = Math.min(hours * 10, 80);
    const qualityPoints = quality * 2;
    return Math.round(hourPoints + qualityPoints);
}

// Add sleep log for current user
function addSleepLog(date, hours, quality) {
    const points = calculatePoints(hours, quality);
    const log = { date, hours, quality, points };
    users[0].logs.push(log);
    return log;
}

// Get current user data
function getCurrentUser() {
    return users[0];
}

// Get all users
function getAllUsers() {
    return users;
}

// Get leaderboard by total points
function getPointsLeaderboard() {
    return users.map(u => ({
        name: u.name,
        points: u.logs.reduce((sum, log) => sum + log.points, 0)
    })).sort((a, b) => b.points - a.points);
}

// Get leaderboard by average hours
function getHoursLeaderboard() {
    return users.map(u => ({
        name: u.name,
        avgHours: u.logs.length ? (u.logs.reduce((sum, log) => sum + log.hours, 0) / u.logs.length).toFixed(1) : 0
    })).sort((a, b) => b.avgHours - a.avgHours);
}

// Get user statistics
function getUserStats() {
    const myLogs = users[0].logs;
    return {
        totalPoints: myLogs.reduce((sum, log) => sum + log.points, 0),
        avgHours: myLogs.length ? (myLogs.reduce((sum, log) => sum + log.hours, 0) / myLogs.length).toFixed(1) : 0,
        totalNights: myLogs.length
    };
}

// Create new cohort
function createNewCohort(name) {
    const code = 'SPACE-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    cohorts[code] = { name, members: ['You'] };
    return code;
}

// Join existing cohort
function joinExistingCohort(code) {
    if (cohorts[code]) {
        cohorts[code].members.push('You');
        return cohorts[code];
    }
    return null;
}

// Get cohort by code
function getCohort(code) {
    return cohorts[code];
}