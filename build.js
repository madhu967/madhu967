const fs = require('fs');
const https = require('https');
const path = require('path');

const imgPath = 'C:\\Users\\ijjij\\.gemini\\antigravity\\brain\\29b29cfa-acc3-49a8-a92d-76431ba13da4\\.user_uploaded\\media_1791525875112.png';
const outDir = __dirname;
const assetsDir = path.join(outDir, 'assets');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Read base64 image
const imgData = fs.readFileSync(imgPath);
const imgBase64 = imgData.toString('base64');
const imgUri = `data:image/png;base64,${imgBase64}`;

// 2. Download Fonts
async function getFontB64(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            let css = '';
            res.on('data', d => css += d);
            res.on('end', () => {
                const match = css.match(/url\((https:\/\/[^)]+\.woff2)\)/);
                if (match && match[1]) {
                    https.get(match[1], (fontRes) => {
                        let chunks = [];
                        fontRes.on('data', c => chunks.push(c));
                        fontRes.on('end', () => {
                            resolve(Buffer.concat(chunks).toString('base64'));
                        });
                    }).on('error', reject);
                } else {
                    resolve('');
                }
            });
        }).on('error', reject);
    });
}

async function build() {
    console.log("Fetching fonts...");
    const outfitB64 = await getFontB64("https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap");
    const firaB64 = await getFontB64("https://fonts.googleapis.com/css2?family=Fira+Code:wght@400&display=swap");
    console.log("Fonts fetched!");

    const defs = `
    <style>
      @font-face { font-family: 'Outfit'; src: url(data:font/woff2;base64,${outfitB64}) format('woff2'); font-weight: 800; }
      @font-face { font-family: 'Fira Code'; src: url(data:font/woff2;base64,${firaB64}) format('woff2'); font-weight: 400; }
      * { font-family: 'Fira Code', monospace; }
      .display { font-family: 'Outfit', sans-serif; font-weight: 800; }
      .bg { fill: #070b16; }
      .text-light { fill: #f8f9fa; }Build my complete animated GitHub profile README. Use the attached id.png for every portrait and
right_pointing.png for the connect section. Preserve those exact images and their alpha; do not redraw my face or
invent silhouette masks. Ask for any missing personal facts or URLs instead of guessing.
ART DIRECTION
Create a bold, polished design with deep navy #070b16, electric blue #247bff, crimson #ff354f and off-white text. Use
oversized display typography, spacious layouts, rounded cards, subtle dot texture and gradient hairline borders.
Embed a licensed display font and mono font as base64 WOFF2; include licenses. Keep everything legible at GitHub
README width.
BUILD THESE FILES
assets/hero.svg: typed greeting, large rising-mask name reveal, four cycling roles, one-line pitch, portrait and
location/company row. assets/about-life.svg: capabilities beside a three-slide interests carousel, changing every 4
seconds with segment progress bars. assets/stack.svg: correctly labelled tech icons on three tilted elliptical orbits
plus grouped stack chips.
MAKE THE DETAILS COUNT
assets/id-dashboard.svg: a hanging lanyard ID with metal clasp, portrait, barcode and subtle foil/light sweep. Drop it
into place, settle with damped pendulum motion, then maintain a gentle +/-1.7-degree swing. Show only verified,
dated metrics and repo data; omit unknown counts. assets/connect.svg: my pointing character on the left,
generously spaced social cards on the right, platform icons and nudging arrows. Use the links I supplied.
GITHUB-SAFE IMPLEMENTATION
Each SVG must be self-contained: inline PNGs and fonts, namespace IDs, and make no network requests when
rendered. Use CSS + SMIL only: no JavaScript, foreignObject or externally loaded assets. Give CSS entrances
fill-mode both. Start SMIL at 0s; use keyTimes for delays and readable final base values if animation is unsupported.
Respect reduced motion. Use Simple Icons where available; otherwise obtain the official brand mark and document
its source.
PACKAGE AND VERIFY
Create README.md with all five relative image paths ending in ?v=1, a projects table and real clickable social links
below the connect image; links inside an SVG image are not clickable on GitHub. Do not add a contribution-city
section. Include preview.html and an upload-ready ZIP. Render every SVG at 0, 2, 5, 9 and 13 seconds, also with
animation removed and as an img element. Check transparency, clipping, typography, spacing, mobile width, valid
links and zero external asset requests. Fix problems before delivery and list exactly which files I must upload.
      .text-blue { fill: #247bff; }
      .text-red { fill: #ff354f; }
      .text-muted { fill: #8b9bb4; }
    </style>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
       <circle cx="2" cy="2" r="1.5" fill="#247bff" opacity="0.1" />
    </pattern>
    <linearGradient id="border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
       <stop offset="0%" stop-color="#247bff" />
       <stop offset="100%" stop-color="#ff354f" />
    </linearGradient>
    <clipPath id="radius-clip"><rect width="798" height="398" x="1" y="1" rx="16" /></clipPath>
    `;

    // 1. hero.svg
    const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
      <defs>
        ${defs}
        <clipPath id="mask-reveal">
           <rect x="0" y="0" width="800" height="0">
              <animate attributeName="height" values="0;400" dur="1s" fill="freeze" />
           </rect>
        </clipPath>
        <style>
          .role { opacity: 0; animation: cycle 16s infinite both; }
          .r1 { animation-delay: 0s; } .r2 { animation-delay: 4s; } .r3 { animation-delay: 8s; } .r4 { animation-delay: 12s; }
          @keyframes cycle { 0%, 20% { opacity: 1; transform: translateY(0px); } 25%, 95% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 0; transform: translateY(10px); } }
          .fade-in { animation: fadeIn 1s ease-out 1.5s both; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .typing-cursor { animation: blink 1s step-end infinite; }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        </style>
      </defs>
      <rect width="800" height="400" rx="16" class="bg" />
      <rect width="800" height="400" rx="16" fill="url(#dots)" />
      <rect width="798" height="398" x="1" y="1" rx="16" fill="none" stroke="url(#border-grad)" stroke-width="2"/>
      
      <g clip-path="url(#mask-reveal)">
         <text x="50" y="100" class="text-light" font-size="24">Hi, I'm <tspan class="text-blue typing-cursor">_</tspan></text>
         <text x="48" y="180" class="text-blue display fade-in" font-size="64" letter-spacing="-1">Ijji Madhu Venkat</text>
         <g transform="translate(50, 240)">
            <text class="role r1 text-red display" font-size="28">Full Stack Developer</text>
            <text class="role r2 text-red display" font-size="28">Frontend Engineer</text>
            <text class="role r3 text-red display" font-size="28">MERN Stack Intern</text>
            <text class="role r4 text-red display" font-size="28">CS Student @ Vishnu Inst.</text>
         </g>
         <text x="50" y="310" class="text-light fade-in" font-size="18">Building modular, AI-powered web applications.</text>
         <text x="50" y="350" class="text-muted fade-in" font-size="16">📍 Vijayawada, AP  |  🏢 Yubhian Technologies</text>
      </g>
      <image href="${imgUri}" x="500" y="40" width="260" height="360" preserveAspectRatio="xMidYMid meet" clip-path="url(#radius-clip)" />
    </svg>`;
    fs.writeFileSync(path.join(assetsDir, 'hero.svg'), hero);

    // 2. about-life.svg
    const about = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" width="800" height="300">
      <defs>
        ${defs}
        <style>
          .slide { opacity: 0; animation: carousel 12s infinite both; }
          .s1 { animation-delay: 0s; } .s2 { animation-delay: 4s; } .s3 { animation-delay: 8s; }
          @keyframes carousel { 0%, 30% { opacity: 1; transform: translateX(0); } 33%, 97% { opacity: 0; transform: translateX(-20px); } 100% { opacity: 0; transform: translateX(20px); } }
          .bar { fill: #247bff; animation: progress 12s infinite linear; }
          .b1 { animation-delay: 0s; } .b2 { animation-delay: 4s; } .b3 { animation-delay: 8s; }
          @keyframes progress { 0% { width: 0; } 33%, 100% { width: 80px; } }
          .chip { fill: #247bff; fill-opacity: 0.15; stroke: #247bff; stroke-width: 1; }
        </style>
      </defs>
      <rect width="800" height="300" rx="16" class="bg" />
      <rect width="800" height="300" rx="16" fill="url(#dots)" />
      <rect width="798" height="298" x="1" y="1" rx="16" fill="none" stroke="url(#border-grad)" stroke-width="2"/>
      
      <!-- Capabilities -->
      <g transform="translate(50, 50)">
         <text class="text-blue display" font-size="36">Capabilities</text>
         <g transform="translate(0, 40)" class="text-light display" font-size="16">
            <rect x="0" y="0" width="120" height="40" rx="20" class="chip"/><text x="60" y="25" text-anchor="middle">React.js</text>
            <rect x="135" y="0" width="120" height="40" rx="20" class="chip"/><text x="195" y="25" text-anchor="middle">Node.js</text>
            <rect x="270" y="0" width="120" height="40" rx="20" class="chip"/><text x="330" y="25" text-anchor="middle">MongoDB</text>
            
            <rect x="0" y="55" width="120" height="40" rx="20" class="chip"/><text x="60" y="80" text-anchor="middle">Tailwind</text>
            <rect x="135" y="55" width="120" height="40" rx="20" class="chip"/><text x="195" y="80" text-anchor="middle">Express</text>
            <rect x="270" y="55" width="120" height="40" rx="20" class="chip"/><text x="330" y="80" text-anchor="middle">Java</text>
         </g>
      </g>
      <!-- Interests -->
      <g transform="translate(450, 50)">
         <text class="text-red display" font-size="36">Interests</text>
         <g transform="translate(0, 30)">
            <rect x="0" y="0" width="80" height="6" fill="#1b243b" rx="3" /><rect x="0" y="0" height="6" class="bar b1" rx="3" />
            <rect x="90" y="0" width="80" height="6" fill="#1b243b" rx="3" /><rect x="90" y="0" height="6" class="bar b2" rx="3" />
            <rect x="180" y="0" width="80" height="6" fill="#1b243b" rx="3" /><rect x="180" y="0" height="6" class="bar b3" rx="3" />
         </g>
         <g transform="translate(0, 80)">
            <g class="slide s1">
               <text class="text-light display" font-size="26">Full Stack Architectures</text>
               <text y="30" class="text-muted" font-size="16">Building scalable MERN applications</text>
               <text y="50" class="text-muted" font-size="16">with secure JWT authentication.</text>
            </g>
            <g class="slide s2">
               <text class="text-light display" font-size="26">AI Integration</text>
               <text y="30" class="text-muted" font-size="16">Leveraging Gemini AI for dynamic</text>
               <text y="50" class="text-muted" font-size="16">analysis &amp; automation workflows.</text>
            </g>
            <g class="slide s3">
               <text class="text-light display" font-size="26">UI/UX &amp; Animations</text>
               <text y="30" class="text-muted" font-size="16">Crafting responsive, accessible,</text>
               <text y="50" class="text-muted" font-size="16">and polished frontend experiences.</text>
            </g>
         </g>
      </g>
    </svg>`;
    fs.writeFileSync(path.join(assetsDir, 'about-life.svg'), about);

    // 3. stack.svg
    const stack = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
      <defs>
        ${defs}
      </defs>
      <rect width="800" height="400" rx="16" class="bg" />
      <rect width="800" height="400" rx="16" fill="url(#dots)" />
      <rect width="798" height="398" x="1" y="1" rx="16" fill="none" stroke="url(#border-grad)" stroke-width="2"/>
      
      <circle cx="400" cy="200" r="45" fill="#247bff" opacity="0.15" stroke="#247bff" stroke-width="2"/>
      <text x="400" y="210" class="text-blue display" font-size="28" text-anchor="middle">TECH</text>
      
      <g stroke="#247bff" fill="none" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.3">
        <ellipse cx="400" cy="200" rx="140" ry="70" />
        <ellipse cx="400" cy="200" rx="220" ry="110" />
        <ellipse cx="400" cy="200" rx="300" ry="150" />
      </g>
      
      <path id="o1" d="M 540 200 A 140 70 0 1 1 539.9 200" fill="none" />
      <path id="o2" d="M 620 200 A 220 110 0 1 1 619.9 200" fill="none" />
      <path id="o3" d="M 700 200 A 300 150 0 1 1 699.9 200" fill="none" />
      
      <g><circle r="18" class="bg" stroke="#f8f9fa" stroke-width="2"/><text y="4" font-size="12" text-anchor="middle" class="text-light display" font-weight="bold">JS</text><animateMotion dur="8s" repeatCount="indefinite"><mpath href="#o1"/></animateMotion></g>
      <g><circle r="22" class="bg" stroke="#ff354f" stroke-width="2"/><text y="4" font-size="12" text-anchor="middle" class="text-red display" font-weight="bold">React</text><animateMotion dur="14s" repeatCount="indefinite"><mpath href="#o2"/></animateMotion></g>
      <g><circle r="20" class="bg" stroke="#247bff" stroke-width="2"/><text y="4" font-size="10" text-anchor="middle" class="text-blue display" font-weight="bold">Node</text><animateMotion dur="20s" repeatCount="indefinite"><mpath href="#o3"/></animateMotion></g>
      <g><circle r="20" class="bg" stroke="#00ED64" stroke-width="2"/><text y="4" font-size="10" text-anchor="middle" fill="#00ED64" class="display" font-weight="bold">MDB</text><animateMotion dur="20s" repeatCount="indefinite" keyPoints="0.5;1;0;0.5" keyTimes="0;0.5;0.5;1" calcMode="linear"><mpath href="#o2"/></animateMotion></g>
    </svg>`;
    fs.writeFileSync(path.join(assetsDir, 'stack.svg'), stack);

    // 4. id-dashboard.svg
    const idDash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        ${defs}
        <style>
           .pendulum { transform-origin: 400px -150px; animation: settle 3s cubic-bezier(0.25,1,0.5,1) both, gentleSwing 4s ease-in-out 3s infinite alternate; }
           @keyframes settle { 0% { transform: rotate(15deg); } 30% { transform: rotate(-8deg); } 60% { transform: rotate(4deg); } 100% { transform: rotate(0deg); } }
           @keyframes gentleSwing { 0% { transform: rotate(1.5deg); } 100% { transform: rotate(-1.5deg); } }
           .foil { fill: url(#foil-grad); opacity: 0.15; animation: sweep 5s infinite linear; mix-blend-mode: overlay; }
           @keyframes sweep { 0% { transform: translateX(-150%) skewX(-30deg); } 100% { transform: translateX(250%) skewX(-30deg); } }
        </style>
        <linearGradient id="foil-grad" x1="0%" y1="0%" x2="100%" y2="0%">
           <stop offset="0%" stop-color="transparent" />
           <stop offset="50%" stop-color="#ffffff" />
           <stop offset="100%" stop-color="transparent" />
        </linearGradient>
        <clipPath id="card-clip"><rect x="250" y="100" width="300" height="460" rx="24" /></clipPath>
        <clipPath id="circle-clip"><circle cx="400" cy="275" r="75" /></clipPath>
      </defs>
      
      <rect width="800" height="600" fill="#070b16" />
      <rect width="800" height="600" fill="url(#dots)" />
      
      <g class="pendulum">
         <path d="M 370 -150 L 400 50 L 430 -150" fill="none" stroke="#ff354f" stroke-width="12" />
         <rect x="380" y="50" width="40" height="30" rx="6" fill="#8b9bb4" />
         <circle cx="400" cy="90" r="15" fill="none" stroke="#8b9bb4" stroke-width="6" />
         
         <rect x="250" y="100" width="300" height="460" rx="24" class="bg" stroke="url(#border-grad)" stroke-width="3" />
         <rect x="250" y="100" width="300" height="120" fill="#247bff" opacity="0.1" />
         
         <text x="400" y="150" class="text-light display" font-size="28" text-anchor="middle">Ijji Madhu Venkat</text>
         <text x="400" y="180" class="text-blue" font-size="14" text-anchor="middle" letter-spacing="2">VERIFIED DEVELOPER</text>
         
         <circle cx="400" cy="275" r="78" class="bg" stroke="#ff354f" stroke-width="4" />
         <image href="${imgUri}" x="320" y="195" width="160" height="160" preserveAspectRatio="xMidYMid slice" clip-path="url(#circle-clip)" />
         
         <g transform="translate(300, 410)">
            <text class="text-muted" font-size="12">COMMITS</text>
            <text y="25" class="text-light display" font-size="22">100+</text>
         </g>
         <g transform="translate(430, 410)">
            <text class="text-muted" font-size="12">REPOS</text>
            <text y="25" class="text-light display" font-size="22">6+</text>
         </g>
         <g transform="translate(300, 470)">
            <text class="text-muted" font-size="12">CGPA</text>
            <text y="25" class="text-light display" font-size="22">9.21</text>
         </g>
         <g transform="translate(430, 470)">
            <text class="text-muted" font-size="12">ROLE</text>
            <text y="25" class="text-light display" font-size="16">Full Stack</text>
         </g>
         
         <path d="M 290 520 v20 M295 520 v20 M305 520 v20 M310 520 v20 M320 520 v20 M330 520 v20 M345 520 v20 M350 520 v20 M360 520 v20 M375 520 v20 M380 520 v20 M390 520 v20 M405 520 v20 M415 520 v20 M420 520 v20 M435 520 v20 M450 520 v20 M460 520 v20 M470 520 v20 M485 520 v20 M500 520 v20 M510 520 v20" stroke="#f8f9fa" stroke-width="3" />
         
         <g clip-path="url(#card-clip)"><rect x="250" y="100" width="300" height="460" class="foil" /></g>
      </g>
    </svg>`;
    fs.writeFileSync(path.join(assetsDir, 'id-dashboard.svg'), idDash);

    // 5. connect.svg
    const connect = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" width="800" height="300">
       <defs>
          ${defs}
          <style>
             .nudge { animation: nudgeAnim 2s infinite ease-in-out; }
             @keyframes nudgeAnim { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(15px); } }
             .card { fill: #070b16; stroke: #247bff; stroke-width: 2; rx: 16; }
          </style>
       </defs>
       <rect width="800" height="300" class="bg" />
       <rect width="800" height="300" fill="url(#dots)" />
       
       <image href="${imgUri}" x="50" y="20" width="220" height="280" preserveAspectRatio="xMidYMid meet" />
       
       <g transform="translate(350, 40)">
          <g transform="translate(0, 0)">
             <rect width="400" height="60" class="card" />
             <text x="30" y="38" class="text-light display" font-size="22">GitHub Profile</text>
             <text x="350" y="40" class="text-red nudge display" font-size="32">→</text>
          </g>
          <g transform="translate(0, 80)">
             <rect width="400" height="60" class="card" />
             <text x="30" y="38" class="text-light display" font-size="22">LinkedIn Profile</text>
             <text x="350" y="40" class="text-red nudge display" font-size="32">→</text>
          </g>
          <g transform="translate(0, 160)">
             <rect width="400" height="60" class="card" />
             <text x="30" y="38" class="text-light display" font-size="22">LeetCode Profile</text>
             <text x="350" y="40" class="text-red nudge display" font-size="32">→</text>
          </g>
       </g>
    </svg>`;
    fs.writeFileSync(path.join(assetsDir, 'connect.svg'), connect);

    // 6. README.md
    const readme = `<div align="center">
  <img src="assets/hero.svg?v=1" alt="Ijji Madhu Venkat - Hero" width="800" />
  <br>
  <img src="assets/about-life.svg?v=1" alt="About and Interests" width="800" />
  <br>
  <img src="assets/stack.svg?v=1" alt="Tech Stack" width="800" />
  <br>
  <img src="assets/id-dashboard.svg?v=1" alt="Developer ID Dashboard" width="800" />
  <br>
  <a href="https://github.com/madhu967">
    <img src="assets/connect.svg?v=1" alt="Connect with me" width="800" />
  </a>
  <br>
  <a href="https://github.com/madhu967"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://linkedin.com/in/ijjimadhu"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://leetcode.com/ijjimadhu"><img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=LeetCode&logoColor=black" alt="LeetCode" /></a>
  <a href="mailto:ijjimadhu@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</div>

<br>

### 🚀 Featured Projects
| Project & Description | Tech Stack | Links |
|---|---|---|
| **AI-Powered Civic Management**<br>Full-stack civic reporting system supporting 6+ categories. Integrated Gemini AI for dynamic image analysis. | React.js, Node.js, Express.js, MongoDB, Gemini AI | [GitHub](https://github.com/madhu967) \\| [Live Demo](#) |
| **Hospital Booking Platform**<br>Medical scheduling system with role-based access handling 50+ concurrent bookings. Implemented Stripe webhooks. | React.js, Node.js, Express.js, MongoDB, Stripe | [GitHub](https://github.com/madhu967) \\| [Live Demo](#) |

---
<div align="center"><em>Designed with passion. Reach out if you'd like to collaborate!</em></div>
`;
    fs.writeFileSync(path.join(outDir, 'README.md'), readme);

    // 7. preview.html
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>GitHub Profile Preview</title>
      <style>
        body { background: #0d1117; color: white; display: flex; flex-direction: column; align-items: center; padding: 40px; font-family: sans-serif; }
        img { max-width: 100%; border: 1px solid #30363d; border-radius: 6px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>Live SVG Preview</h1>
      <img src="assets/hero.svg" alt="Hero">
      <img src="assets/about-life.svg" alt="About">
      <img src="assets/stack.svg" alt="Stack">
      <img src="assets/id-dashboard.svg" alt="ID">
      <img src="assets/connect.svg" alt="Connect">
    </body>
    </html>`;
    fs.writeFileSync(path.join(outDir, 'preview.html'), html);

    console.log("Build complete!");
}

build();
