const input = document.getElementById("textInput");
const kanaArea = document.getElementById("kanaArea");
const templateArea = document.getElementById("templateArea");
const speakBtn = document.getElementById("speakBtn");
const deleteBtn = document.getElementById("deleteBtn");

let isPlaying = false;

const kanaRows = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "ゆ", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "を", "ん"],
  ["が", "ぎ", "ぐ", "げ", "ご"],
  ["ざ", "じ", "ず", "ぜ", "ぞ"],
  ["だ", "ぢ", "づ", "で", "ど"],
  ["ば", "び", "ぶ", "べ", "ぼ"],
  ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
];

const templates = [
  "笑", "豚", "挿れて", "ちょっとぉ",
  "ダメだって", "アン", "おおお", "イった"
];

function createButton(text, parent) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = () => {
    if (isPlaying) return;
    input.value += text;
  };
  parent.appendChild(btn);
}

kanaRows.forEach(row => {
  const rowDiv = document.createElement("div");
  rowDiv.className = "kana-row";
  row.forEach(k => createButton(k, rowDiv));
  kanaArea.appendChild(rowDiv);
});

templates.forEach(t => createButton(t, templateArea));

const clearBtn = document.getElementById("clearBtn");

clearBtn.onclick = () => {
  if (isPlaying) return;
  input.value = "";
};

speakBtn.onclick = async () => {
  if (isPlaying || input.value === "") return;

  isPlaying = true;
  toggleButtons(true);

  const text = input.value;
  const sortedTemplates = [...templates].sort((a, b) => b.length - a.length);

  let i = 0;
  while (i < text.length) {
    let matched = false;

    for (const t of sortedTemplates) {
      if (text.slice(i, i + t.length) === t) {
        await playAudio(t);
        i += t.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const char = text[i];
      if (await playAudio(char) === false) {
      }
      i++;
    }
  }

  toggleButtons(false);
  isPlaying = false;
};

function playAudio(key) {
  return new Promise(res => {
    const path = getAudioPath(key);
    if (!path) {
      res(false);
      return;
    }
    const audio = new Audio(path);
    audio.onended = () => res(true);
    audio.play();
  });
}

function getAudioPath(k) {
  const special = {
    "笑": "audio/lol.wav",
    "豚": "audio/BH.wav",
    "挿れて": "audio/IRETE.wav",
    "ちょっとぉ": "audio/tyotto.wav",
    "ダメだって": "audio/damedatte.wav",
    "アン": "audio/an.wav",
    "おおお": "audio/OOO.wav",
    "イった": "audio/itta.wav"
  };

  if (special[k]) return special[k];

  const table = {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "si", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "ti", "つ": "tu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "hu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "wo", "ん": "n",
    "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
    "ざ": "za", "じ": "zi", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
    "だ": "da", "ぢ": "di", "づ": "du", "で": "de", "ど": "do",
    "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
    "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po"
  };

  if (table[k]) return "audio/" + table[k] + ".wav";

  return null;
}

function toggleButtons(state) {
  document.querySelectorAll("button").forEach(btn => {
    btn.disabled = state;
  });
}