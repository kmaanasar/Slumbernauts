// Data Management with Firebase

// Save sleep log to Firebase
async function addSleepLog(date, hours, quality) {
    const points = calculatePoints(hours, quality);
    const log = {
        userId: currentUserId,
        username: currentUsername,
        date: date,
        hours: hours,
        quality: quality,
        points: points,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('sleepLogs').add(log);
        return log;
    } catch (error) {
        console.error('Error adding sleep log:', error);
        alert('Failed to save sleep log. Please try again.');
        return null;
    }
}

// Get current user's sleep logs
async function getCurrentUserLogs() {
    try {
        const snapshot = await db.collection('sleepLogs')
            .where('userId', '==', currentUserId)
            .orderBy('date', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
}

// Calculate points based on hours only
function calculatePoints(hours, quality) {
    return Math.min(Math.round(hours), 10);
}

// Get points leaderboard
async function getPointsLeaderboard() {
    try {
        const snapshot = await db.collection('sleepLogs').get();
        const userPoints = {};
        
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (!userPoints[data.userId]) {
                userPoints[data.userId] = {
                    username: data.username,
                    points: 0
                };
            }
            userPoints[data.userId].points += data.points;
        });
        
        return Object.values(userPoints)
            .sort((a, b) => b.points - a.points)
            .slice(0, 10); // Top 10
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

// Get average hours leaderboard
async function getHoursLeaderboard() {
    try {
        const snapshot = await db.collection('sleepLogs').get();
        const userHours = {};
        
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (!userHours[data.userId]) {
                userHours[data.userId] = {
                    username: data.username,
                    totalHours: 0,
                    count: 0
                };
            }
            userHours[data.userId].totalHours += data.hours;
            userHours[data.userId].count += 1;
        });
        
        return Object.entries(userHours)
            .map(([userId, data]) => ({
                username: data.username,
                avgHours: (data.totalHours / data.count).toFixed(1)
            }))
            .sort((a, b) => b.avgHours - a.avgHours)
            .slice(0, 10);
    } catch (error) {
        console.error('Error fetching hours leaderboard:', error);
        return [];
    }
}

// Get user statistics
async function getUserStats() {
    const logs = await getCurrentUserLogs();
    
    if (logs.length === 0) {
        return { totalPoints: 0, avgHours: 0, totalNights: 0 };
    }
    
    const totalPoints = logs.reduce((sum, log) => sum + log.points, 0);
    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
    
    return {
        totalPoints: totalPoints,
        avgHours: (totalHours / logs.length).toFixed(1),
        totalNights: logs.length
    };
}

// Create new cohort
async function createNewCohort(name) {
    const code = 'SPACE-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    try {
        await db.collection('cohorts').doc(code).set({
            name: name,
            createdBy: currentUserId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            members: [currentUserId]
        });
        
        // Add user to cohort in their profile
        await db.collection('userCohorts').doc(currentUserId).set({
            cohortCode: code
        }, { merge: true });
        
        return code;
    } catch (error) {
        console.error('Error creating cohort:', error);
        alert('Failed to create cohort. Please try again.');
        return null;
    }
}

// Join existing cohort
async function joinExistingCohort(code) {
    try {
        const cohortDoc = await db.collection('cohorts').doc(code).get();
        
        if (!cohortDoc.exists) {
            return null;
        }
        
        // Add user to cohort members
        await db.collection('cohorts').doc(code).update({
            members: firebase.firestore.FieldValue.arrayUnion(currentUserId)
        });
        
        // Save cohort to user profile
        await db.collection('userCohorts').doc(currentUserId).set({
            cohortCode: code
        }, { merge: true });
        
        return cohortDoc.data();
    } catch (error) {
        console.error('Error joining cohort:', error);
        return null;
    }
}

// Get cohort leaderboard
async function getCohortLeaderboard(cohortCode) {
    try {
        const cohortDoc = await db.collection('cohorts').doc(cohortCode).get();
        
        if (!cohortDoc.exists) {
            return [];
        }
        
        const members = cohortDoc.data().members;
        
        // Get all logs for cohort members
        const logsSnapshot = await db.collection('sleepLogs')
            .where('userId', 'in', members)
            .get();
        
        const userPoints = {};
        
        logsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (!userPoints[data.userId]) {
                userPoints[data.userId] = {
                    username: data.username,
                    points: 0
                };
            }
            userPoints[data.userId].points += data.points;
        });
        
        return Object.values(userPoints)
            .sort((a, b) => b.points - a.points);
    } catch (error) {
        console.error('Error fetching cohort leaderboard:', error);
        return [];
    }
}

// Get user's cohort
async function getUserCohort() {
    try {
        const userCohortDoc = await db.collection('userCohorts').doc(currentUserId).get();
        
        if (!userCohortDoc.exists) {
            return null;
        }
        
        const cohortCode = userCohortDoc.data().cohortCode;
        const cohortDoc = await db.collection('cohorts').doc(cohortCode).get();
        
        if (!cohortDoc.exists) {
            return null;
        }
        
        return {
            code: cohortCode,
            ...cohortDoc.data()
        };
    } catch (error) {
        console.error('Error fetching user cohort:', error);
        return null;
    }
}