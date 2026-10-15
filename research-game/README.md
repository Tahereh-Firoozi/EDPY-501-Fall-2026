# EDPY 501 Research Methods Live

A teacher-led, ten-question classroom game based on the course’s first seven sessions.

## Classroom links

- Teacher: https://taherehfiroozi.com/EDPY-501-Fall-2026/research-game/?host=1
- Students: https://taherehfiroozi.com/EDPY-501-Fall-2026/research-game/

## Running a game

1. Open the teacher link and choose **Create a new game**.
2. Choose **Open projector**. Put that browser window on the projector and use its full-screen button. Keep the teacher control tab on your own screen.
3. Students scan the displayed QR code, enter the six-digit code, and choose a nickname. No account or real name is needed. Copy join link supplies the game code automatically.
4. Choose **Start Question 1** when the class is ready.
5. Question 1 allows 2:30; Question 3 allows 5:00; the other eight allow 2:00. The timer appears above every question on both screens. Pause and +30 seconds are available to the teacher. Students cannot submit while paused.
6. After time expires, choose **Show class vote**. Counts and percentages appear before the answer. The display distinguishes a true majority (over 50%) from the most-selected option and tied votes.
7. Choose **Reveal correct answer** to show the explanation. Choose **Start Question …** when ready; the next question never starts automatically.
8. After Question 10, choose **Reveal the top five**. Download the class results as CSV if needed.

Each correct answer earns 1,000 points. Incorrect and unanswered questions earn zero. Equal scores are ranked by total active answering time on correct answers; exact ties use joining order. Answers are final after submission, and the server rejects late submissions. Refreshing the same browser restores the teacher or player session. Use a different browser or private window when testing a player alongside the teacher.

The room remains accessible for 24 hours after creation. Save the private teacher recovery link if you may change devices. Do not share that link with students. The normal student and projector links contain no teacher credentials.

## Projection and PowerPoint

The live display is a full-screen browser presentation. Open the teacher link from PowerPoint using a hyperlink, then put the projector browser window in full screen. A static PowerPoint file does not itself receive or display live votes. The browser presentation provides the live questions, vote charts, answer reveals, and leaderboard.

## Implementation

GitHub Pages hosts this static interface. A separately hosted Cloudflare Worker/D1 service runs the live game API at `https://edpy501-live-research-game.alight-chair-8348.chatgpt.site/api/game`. GitHub Pages alone cannot store shared live responses. The API uses short-lived game rooms, random per-room teacher keys, and per-player tokens; keys are not embedded in public source. Server time controls the deadline. Correct answers and scores for the current round are withheld until the teacher reveals them.

The interface polls approximately every 1.5 seconds while connected. Internet access is needed on the teacher computer and phones. The app shows a reconnecting indicator when requests fail. Up to 150 nicknames can join one game. Nicknames, choices, scores, and response timings are stored for the game; real names and institutional IDs are not requested.

Files: `index.html`, `game.css`, `game.js`, `icon.svg`, `join-qr.svg`.

## Verification

The API was tested with a complete ten-round, seven-player simulation, including timer values, pause/resume/extensions, late-answer rejection, duplicate submissions, answer secrecy, unauthorized teacher actions, optimistic version conflicts, ranking, CSV data, CORS, and room expiry. A real classroom phone/projector check is still recommended before teaching.
