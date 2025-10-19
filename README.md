## Inspiration  
Among our daily conversations, sleep was always a recurring topic. How much we got, how it affected our energy, how hard it was to stay consistent... We realized that while we all cared about getting enough rest, none of us were holding ourselves accountable. That’s when we thought: what if sleep tracking could be social and fun?  
That idea became **Slumbernauts**, a way to make healthy sleep habits something you share with friends, not just your alarm clock.  

---

## What Slumbernauts Does  
**Slumbernauts** is a social sleep-tracking web app that turns better sleep into a friendly game. Users can form or join private “spaceships,” track their nightly sleep hours, and compete with friends on a real-time leaderboard.  

The app also integrates the **Google Gemini 2.5 model** to offer personalized sleep insights, encouraging healthier habits through AI-generated feedback and motivation.  

---

## How We Built the Project  
We built our frontend using **HTML, CSS, and JavaScript** to create an engaging and intuitive interface. For the backend, we used **Firebase** for authentication, real-time data storage, and hosting.  

To handle AI functionality, we deployed **Netlify functions** that securely call the **Google Gemini 2.5 API**, allowing us to generate personalized insights without exposing our API key.  

As a team of **freshmen**, this was our first time integrating a generative AI model. We learned a lot about API security, asynchronous data management, and connecting multiple backend services smoothly.  

---

## Challenges We Faced  
Some of our biggest technical challenges included implementing **real-time leaderboards**, creating **private cohorts** with unique access codes, and **synchronizing sleep data** across multiple users.  

We also struggled initially with keeping our API key safe and ensuring smooth communication between the frontend and backend. After researching Firebase’s real-time database structure and consulting open-source projects, we successfully built scalable solutions for data syncing and security.  

---

## Future Features  
Looking ahead, we plan to enhance **Slumbernauts** with features like:  
-  A **streak tracker** to reward consistent sleep habits  
- **AI-powered summaries** of weekly or monthly sleep trends  
-  **Push notifications** and **calendar integrations** to help users plan their rest  
- **Social badges and challenges** to make friendly competition even more engaging  
