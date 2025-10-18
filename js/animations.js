// Animation Module

// Initialize background stars
function initStars() {
    const container = document.getElementById('starsContainer');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
}

// Add stars animation when logging sleep
function animatePointsEarned(points) {
    const starsContainer = document.getElementById('starsContainer');
    const starCount = Math.floor(points / 5);
    
    for (let i = 0; i < starCount; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = '4px';
            star.style.height = '4px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animation = 'twinkle 1s ease-in-out';
            starsContainer.appendChild(star);
        }, i * 50);
    }
}

// Show success message
function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.classList.remove('hidden');
    setTimeout(() => {
        message.classList.add('hidden');
    }, 3000);
}