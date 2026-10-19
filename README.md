# Runway Rivals (VS Code project)

Files
- index.html      the dress-up game (open this first)
- ar-tryon.html   AR try-on prototype (webcam + MediaPipe Pose + DummyJSON dresses and shoes)

Run in VS Code
1. Install VS Code, then the "Live Server" extension (Ritwick Dey).
2. File > Open Folder > pick this folder.
3. Right-click index.html > Open with Live Server (opens http://127.0.0.1:5500).
4. For AR, open ar-tryon.html the same way. The camera only works on localhost or https.
No Live Server? In a terminal inside this folder run:  python3 -m http.server 5500
then open http://localhost:5500

Tech stack
- Plain HTML, CSS and JavaScript (no framework, no build step)
- Characters and outfits are inline SVG
- Progress saved in localStorage
- AR page: MediaPipe Pose Landmarker (tasks-vision) + DummyJSON API (womens-dresses, womens-shoes)

AI judges (optional)
- Needs Node 18+. In this folder run:  ANTHROPIC_API_KEY=your_key node server.js   (Windows PowerShell: $env:ANTHROPIC_API_KEY="your_key"; node server.js)
- Open http://localhost:3000. Judges then write their comments with Claude. Without the server the game uses built-in judges.
- Keep your key on the server only. Never paste it into index.html.
Boutique tab: loads dresses and shoes from the free DummyJSON API (needs internet).

.env option
Copy .env.example to .env, put your key inside, then just run: node server.js
.env is git-ignored, so it never gets pushed to GitHub.
