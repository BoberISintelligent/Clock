<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Advanced Qlock</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

    :root {
      --bg-dark: radial-gradient(circle at center, #111 0%, #000 100%);
      --bg-light: radial-gradient(circle at center, #fff 0%, #ddd 100%);
      --text-dark: rgba(255, 255, 255, 0.1);
      --text-light: rgba(0, 0, 0, 0.1);
      --active-dark: #00ffcc;
      --active-light: #007777;
    }

    body {
      margin: 0;
      background: var(--bg-dark);
      color: var(--text-dark);
      font-family: 'Orbitron', monospace;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      overflow: hidden;
      transition: background 0.5s;
    }

    .controls {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
    }

    .theme-toggle, .color-select {
      background: none;
      border: 2px solid var(--active-dark);
      color: var(--active-dark);
      padding: 0.5rem 1rem;
      border-radius: 10px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
    }

    .color-select {
      font-size: 1rem;
    }

    .theme-light {
      background: var(--bg-light);
      color: var(--text-light);
    }

    .theme-light .letter {
      color: var(--text-light);
    }
    .theme-light .letter.on {
      color: var(--active-light);
      text-shadow: 0 0 10px var(--active-light);
    }

    .clock {
      display: grid;
      grid-template-columns: repeat(11, 1fr);
      grid-gap: 6px;
      max-width: 90vmin;
      width: 90vmin;
    }

    .letter {
      font-size: 3vmin;
      text-align: center;
      color: var(--text-dark);
      transition: color 0.4s, transform 0.4s;
      position: relative;
      cursor: pointer;
    }

    .letter.on {
      color: var(--active-dark);
      transform: scale(1.2);
      text-shadow: 0 0 10px var(--active-dark);
    }

    .letter:hover::after {
      content: attr(data-word);
      position: absolute;
      top: -2em;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 255, 251, 0.2);
      color: rgb(0, 255, 204);
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 1.5vmin;
      white-space: nowrap;
    }

    .theme-light .letter:hover::after {
      background: rgba(0, 119, 119, 0.2);
      color: #007777;
    }

    .glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(0,255,204,0.2) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: pulse 5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
      }
    }

    .digital-time {
      margin-top: 20px;
      font-size: 4vmin;
      color: var(--active-dark);
      text-shadow: 0 0 10px var(--active-dark);
    }

    .theme-light .digital-time {
      color: var(--active-light);
      text-shadow: 0 0 10px var(--active-light);
    }

    @media (max-width: 600px) {
      .letter {
        font-size: 5vw;
      }
      .digital-time {
        font-size: 6vw;
      }
    }
  </style>
</head>
<body>
  <div class="controls">
    <button class="theme-toggle" onclick="toggleTheme()">Toggle Theme</button>
    <select class="color-select" onchange="changeColor(this.value)">
      <option value="#00ffcc">Neon Green</option>
      <option value="#007bff">Blue</option>
      <option value="#ff0066">Pink</option>
      <option value="#ffcc00">Amber</option>
      <option value="#00ffaa">Mint</option>
      <option value="#FF0000">Red</option>
      <option value="#FFC0CB">Pink</option>
      <option value="#FF6347">Tomato</option>
      <option value="#FFD700">Gold</option>
      <option value="#FFFF00">Yellow</option>
      <option value="#F0E68C">Khaki</option>
      <option value="#EE82EE">Violet</option>
      <option value="#00FF00">Lime</option>
      <option value="#00FFFF">Aqua</option>
      <option value="#0000FF">Blue</option>
      <option value="#F4A460">SandyBrown</option>
      <option value="#FFFFFF">White</option>
      <option value="#000000">Black</option>
    </select>
  </div>
  <div class="glow"></div>
  <div class="clock" id="clock"></div>
  <div class="digital-time" id="digitalTime"></div>
  <audio id="tickSound" src="https://freesound.org/data/previews/341/341695_6260500-lq.mp3" preload="auto"></audio>

  <div class="powered-by">CREATOR RS</div>
  
  <script>
  const grid = [
    'ITLISASTIME',
    'ACQUARTERDC',
    'TWENTYFIVEX',
    'HALFBTENFTO',
    'PASTERUNINE',
    'ONESIXTHREE',
    'FOURFIVETWO',
    'EIGHTELEVEN',
    'SEVENTWELVE',
    'TENSEOCLOCK'
  ];

  const wordsMap = {
    "IT": [0, 1],
    "IS": [3, 4],
    "A": [5],
    "QUARTER": [13, 14, 15, 16, 17, 18, 19],
    "TWENTY": [22, 23, 24, 25, 26, 27],
    "FIVE": [28, 29, 30, 31],
    "HALF": [33, 34, 35, 36],
    "TEN": [37, 38, 39],
    "TO": [40, 41],
    "PAST": [44, 45, 46, 47],
    "ONE": [55, 56, 57],
    "TWO": [66, 67, 68],
    "THREE": [58, 59, 60, 61, 62],
    "FOUR": [63, 64, 65, 66],
    "FIVE_H": [67, 68, 69, 70],
    "SIX": [53, 54, 55],
    "SEVEN": [88, 89, 90, 91, 92],
    "EIGHT": [71, 72, 73, 74, 75],
    "NINE": [50, 51, 52, 53],
    "TEN_H": [99, 100, 101],
    "ELEVEN": [76, 77, 78, 79, 80, 81],
    "TWELVE": [93, 94, 95, 96, 97, 98],
    "OCLOCK": [104, 105, 106, 107, 108, 109]
  };

  const clock = document.getElementById("clock");
  const digitalEl = document.getElementById("digitalTime");
  const sound = document.getElementById("tickSound");

  function createGrid() {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = grid[row][col];
        span.dataset.index = row * 11 + col;

        // Добавляем data-word для всплывающей подсказки
        for (const [word, indices] of Object.entries(wordsMap)) {
          if (indices.includes(row * 11 + col)) {
            span.dataset.word = word.replace('_H', '');
            break;
          }
        }

        clock.appendChild(span);
      }
    }
  }

  function highlight(indices) {
    document.querySelectorAll(".letter").forEach(el => el.classList.remove("on"));
    indices.forEach(i => {
      const letter = document.querySelector(`[data-index='${i}']`);
      if (letter) letter.classList.add("on");
    });
  }

  function getTimeIndices() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();

    const indices = [...wordsMap["IT"], ...wordsMap["IS"]];

    const minIndex = Math.floor(m / 5);
    if (minIndex > 0) {
      const minuteWords = [
        null, "FIVE", "TEN", "QUARTER", "TWENTY", ["TWENTY", "FIVE"], "HALF"
      ];

      const words = minuteWords[minIndex > 6 ? 12 - minIndex : minIndex];
      if (Array.isArray(words)) {
        words.forEach(w => indices.push(...wordsMap[w]));
      } else if (words) {
        indices.push(...wordsMap[words]);
      }

      if (minIndex <= 6) {
        indices.push(...wordsMap["PAST"]);
      } else {
        indices.push(...wordsMap["TO"]);
        h = (h + 1) % 12;
      }
    } else {
      indices.push(...wordsMap["OCLOCK"]);
    }

    const hourNames = [
      "TWELVE", "ONE", "TWO", "THREE", "FOUR", "FIVE_H",
      "SIX", "SEVEN", "EIGHT", "NINE", "TEN_H", "ELEVEN"
    ];
    indices.push(...wordsMap[hourNames[h % 12]]);

    return indices;
  }

  function tick() {
    highlight(getTimeIndices());
    if (sound && sound.readyState >= 2) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
    setTimeout(tick, 1000);
  }

  function updateDigital() {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    digitalEl.textContent = `${hh}:${mm}:${ss}`;
    setTimeout(updateDigital, 1000);
  }

  function toggleTheme() {
    document.body.classList.toggle("theme-light");
  }

  function changeColor(color) {
    document.documentElement.style.setProperty('--active-dark', color);
  }

  createGrid();
  updateDigital();
  tick();
</script>

</body>
</html>
