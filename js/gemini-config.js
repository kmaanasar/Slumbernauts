// Gemini API Configuration
const GEMINI_API_KEY = "AIzaSyBgZeZv56Kl8kW8xTG64Ar2QzQWffchyfM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Call Gemini API
async function callGemini(prompt) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            console.error('Gemini API Error:', data.error);
            throw new Error(data.error.message);
        } else {
            throw new Error('no response from gemini');
        }
    } catch (error) {
        console.error('gemini api error:', error);
        return "sorry, i couldn't generate a response. please check your api key and try again. 🌙";
    }
}

// Generate personalized sleep analysis
async function analyzeSleepWithAI(logs) {
    if (logs.length === 0) {
        return "you haven't logged any sleep yet! start tracking to get personalized ai insights. 🌙";
    }

    // Calculate statistics
    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
    const avgHours = (totalHours / logs.length).toFixed(1);
    const avgQuality = (logs.reduce((sum, log) => sum + log.quality, 0) / logs.length).toFixed(1);
    const totalStars = logs.reduce((sum, log) => sum + log.points, 0);
    
    // Get recent week
    const recentLogs = logs.slice(0, Math.min(7, logs.length));
    const sleepData = recentLogs.map(log => 
        `${log.date}: ${log.hours}hrs (quality: ${log.quality}/10)`
    ).join('\n');

    // Find patterns
    const sleepAmounts = logs.map(l => l.hours);
    const minSleep = Math.min(...sleepAmounts);
    const maxSleep = Math.max(...sleepAmounts);
    
    const prompt = `you are a friendly sleep coach analyzing someone's sleep patterns. use lowercase, be casual and encouraging.

sleep data (last ${recentLogs.length} nights):
${sleepData}

overall stats:
- average: ${avgHours} hours/night
- quality: ${avgQuality}/10
- range: ${minSleep.toFixed(1)}-${maxSleep.toFixed(1)} hours
- total nights tracked: ${logs.length}
- stars earned: ${totalStars}

provide a brief analysis with:
1. one key insight about their sleep pattern
2. two specific, actionable recommendations
3. one encouraging comment

keep it under 150 words. be supportive and use emojis sparingly. write in lowercase.`;

    return await callGemini(prompt);
}

// Chat with AI about sleep
async function chatWithSleepAI(userMessage, logs) {
    const hasData = logs.length > 0;
    
    const context = hasData ? `
user's recent sleep data:
- average sleep: ${(logs.reduce((sum, log) => sum + log.hours, 0) / logs.length).toFixed(1)} hours
- average quality: ${(logs.reduce((sum, log) => sum + log.quality, 0) / logs.length).toFixed(1)}/10
- total nights: ${logs.length}
- most recent: ${logs[0].hours}hrs on ${logs[0].date}
` : "user hasn't logged any sleep yet.";

    const prompt = `you are a friendly sleep expert assistant. use lowercase and be casual. ${context}

user asks: "${userMessage}"

provide a helpful, concise response (2-3 sentences max). be encouraging and practical. use lowercase.`;

    return await callGemini(prompt);
}

// Quick sleep tips
async function getQuickTip() {
    const prompt = `give one quick, actionable sleep tip in 1-2 sentences. be casual, use lowercase, and make it practical. vary your tips between sleep hygiene, bedroom environment, routines, and lifestyle factors.`;
    
    return await callGemini(prompt);
}