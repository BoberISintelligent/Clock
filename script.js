const cleanGrid = [
  'ITLISASATIM',
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
  "QUARTER": [13, 14, 15, 16, 17, 18, 19],
  "TWENTY": [22, 23, 24, 25, 26, 27],
  "FIVE_M": [28, 29, 30, 31],
  "HALF": [33, 34, 35, 36],
  "TEN_M": [38, 39, 40],
  "TO": [42, 43],
  "PAST": [44, 45, 46, 47],
  "NINE": [50, 51, 52, 53],
  "ONE": [55, 56, 57],
  "SIX": [58, 59, 60],
  "THREE": [61, 62, 63, 64, 65],
  "FOUR": [66, 67, 68, 69],
  "FIVE_H": [70, 71, 72, 73],
  "TWO": [74, 75, 76],
  "EIGHT": [77, 78, 79, 80, 81],
  "ELEVEN": [82, 83, 84, 85, 86, 87],
  "SEVEN": [88, 89, 90, 91, 92],
  "TWELVE": [93, 94, 95, 96, 97, 98],
  "TEN_H": [99, 100, 101],
  "OCLOCK": [104, 105, 106, 107, 108, 109]
};

const clock = document.getElementById("clock");
const digitalEl = document.getElementById("digitalTime");
let lastIndices = [];

function createGrid() {
  clock.innerHTML = "";
  cleanGrid.forEach((rowStr, row) => {
    for (let col = 0; col < rowStr.length; col++) {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = rowStr[col];
      const index = row * 11 + col;
      span.dataset.index = index;

      // Привязываем группу букв (слово) для подсветки при наведении
      for (const [word, indices] of Object.entries(wordsMap)) {
        if (indices.includes(index)) {
          span.dataset.wordGroup = indices.join(',');
          break;
        }
      }

      // Интерактив при наведении мышки на слово
      span.addEventListener("mouseenter", () => {
        if (span.dataset.wordGroup) {
          span.dataset.wordGroup.split(',').forEach(i => {
            const el = document.querySelector(`[data-index='${i}']`);
            if (el) el.classList.add("hover-on");
          });
        }
      });

      span.addEventListener("mouseleave", () => {
        if (span.dataset.wordGroup) {
          span.dataset.wordGroup.split(',').forEach(i => {
            const el = document.querySelector(`[data-index='${i}']`);
            if (el) el.classList.remove("hover-on");
          });
        }
      });

      clock.appendChild(span);
    }
  });
}

function highlight(indices) {
  const isChanged = JSON.stringify(indices) !== JSON.stringify(lastIndices);
  lastIndices = indices;

  document.querySelectorAll(".letter").forEach(el => {
    el.classList.remove("on");
  });

  if (isChanged) {
    indices.forEach((i, delayIndex) => {
      setTimeout(() => {
        const letter = document.querySelector(`[data-index='${i}']`);
        if (letter) {
          letter.classList.add("on");
        }
      }, delayIndex * 30);
    });
  } else {
    indices.forEach(i => {
      const letter = document.querySelector(`[data-index='${i}']`);
      if (letter) {
        letter.classList.add("on");
      }
    });
  }
}

function getTimeIndices() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();

  const indices = [...wordsMap["IT"], ...wordsMap["IS"]];

  const minIndex = Math.floor(m / 5);
  if (minIndex > 0) {
    const minuteWords = [
      null, "FIVE_M", "TEN_M", "QUARTER", "TWENTY", ["TWENTY", "FIVE_M"], "HALF"
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
      h = (h + 1) % 24;
    }
  } else {
    indices.push(...wordsMap["OCLOCK"]);
  }

  const hourNames = [
    "TWELVE", "ONE", "TWO", "THREE", "FOUR", "FIVE_H",
    "SIX", "SEVEN", "EIGHT", "NINE", "TEN_H", "ELEVEN"
  ];

  const currentHour12 = h % 12;
  indices.push(...wordsMap[hourNames[currentHour12]]);

  return indices;
}

function tick() {
  highlight(getTimeIndices());
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

function changeColor(color) {
  document.documentElement.style.setProperty('--active-dark', color);
}

createGrid();
updateDigital();
tick();