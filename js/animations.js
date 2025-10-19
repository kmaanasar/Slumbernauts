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

function animatePointsEarned(points) {
    const starsContainer = document.getElementById('starsContainer');
    
    for (let i = 0; i < points; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = '5px';
            star.style.height = '5px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animation = 'twinkle 1s ease-in-out';
            starsContainer.appendChild(star);
        }, i * 100);
    }
}

function showSuccessMessage(points) {
    const message = document.getElementById('successMessage');
    document.getElementById('starsEarned').textContent = points;
    message.classList.remove('hidden');
    setTimeout(() => {
        message.classList.add('hidden');
    }, 3000);
}