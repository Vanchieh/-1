const colors = ['#ffe5ec', '#ffc2d1', '#ffb3c6', '#ff8fab', '#fb6f92'];
const circles = [];
const numCircles = 50;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// 新增選單容器
const menu = document.createElement('ul');
menu.style.position = "absolute";
menu.style.top = "10px";
menu.style.left = "10px";
menu.style.zIndex = "1000";
menu.style.listStyle = "none";
menu.style.margin = "0";
menu.style.padding = "0";
menu.style.display = "flex";
document.body.appendChild(menu);

// 新增「首頁」選單項目
const homeItem = document.createElement('li');
homeItem.textContent = "首頁";
homeItem.style.marginRight = "10px";
homeItem.style.padding = "10px";
homeItem.style.borderRadius = "5px";
homeItem.style.backgroundColor = "#fff";
homeItem.style.color = "#000";
homeItem.style.border = "1px solid #ccc";
homeItem.style.cursor = "pointer";
menu.appendChild(homeItem);

// 新增「自我介紹」按鈕
const introButton = document.createElement('button');
introButton.textContent = "顯示自我介紹";
introButton.style.marginRight = "10px";
introButton.style.padding = "10px";
introButton.style.borderRadius = "5px";
introButton.style.backgroundColor = "#fff";
introButton.style.color = "#000";
introButton.style.border = "1px solid #ccc";
introButton.style.cursor = "pointer";
menu.appendChild(introButton);

// 新增「測驗卷」選單項目
const quizItem = document.createElement('li');
quizItem.textContent = "測驗卷";
quizItem.style.marginRight = "10px";
quizItem.style.padding = "10px";
quizItem.style.borderRadius = "5px";
quizItem.style.backgroundColor = "#fff";
quizItem.style.color = "#000";
quizItem.style.border = "1px solid #ccc";
quizItem.style.cursor = "pointer";
menu.appendChild(quizItem);

// 新增文字容器
const introText = document.createElement('div');
introText.textContent = "淡江大學教育科技學系，姓名:徐凡傑，學號:413730275";
introText.style.position = "absolute";
introText.style.top = "50px";
introText.style.left = "10px";
introText.style.zIndex = "1001";
introText.style.fontSize = "30px";
introText.style.color = "#13315c";
introText.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
introText.style.padding = "10px";
introText.style.borderRadius = "5px";
introText.style.display = "none"; // 初始隱藏
document.body.appendChild(introText);

// 按鈕點擊事件
introButton.addEventListener('click', () => {
  introText.style.display = introText.style.display === "none" ? "block" : "none";
});

// 測驗卷點擊事件
quizItem.addEventListener('click', () => {
  // 隱藏畫布和其他內容
  canvas.style.display = "none";
  introText.style.display = "none";

  // 啟動測驗功能
  startQuiz();
});

// 初始化圓的資料
for (let i = 0; i < numCircles; i++) {
  const size = Math.random() * (120 - 20) + 20; // 圓的大小 20~120
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const speedX = (Math.random() - 0.5) * 2; // X 軸速度
  const speedY = (Math.random() - 0.5) * 2; // Y 軸速度
  circles.push({ x, y, size, color, speedX, speedY });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
  for (const circle of circles) {
    // 更新圓的位置
    circle.x += circle.speedX;
    circle.y += circle.speedY;

    // 邊界檢查，讓圓反彈
    if (circle.x - circle.size / 2 < 0 || circle.x + circle.size / 2 > canvas.width) {
      circle.speedX *= -1;
    }
    if (circle.y - circle.size / 2 < 0 || circle.y + circle.size / 2 > canvas.height) {
      circle.speedY *= -1;
    }

    // 繪製圓
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
  }

  requestAnimationFrame(draw); // 繼續動畫
}

draw(); // 開始繪製

// 測驗功能
function startQuiz() {
  let table;
  let question = "";
  let options = [];
  let correctAnswer = "";
  let selectedOption = null;
  let resultMessage = "";
  let radio, submitButton;
  let currentQuestionIndex = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  function preload() {
    table = loadTable("question.csv", "csv", "header");
  }

  function setup() {
    createCanvas(windowWidth, windowHeight);
    background("#b0c4b1");

    loadQuestion(currentQuestionIndex);

    radio = createRadio();
    radio.style("font-size", "35px");
    radio.style("color", "#4a5759");

    for (let i = 0; i < options.length; i++) {
      radio.option(options[i]);
    }
    radio.changed(() => {
      selectedOption = radio.value();
    });

    submitButton = createButton("下一題");
    submitButton.style("font-size", "35px");
    submitButton.mousePressed(handleNextQuestion);

    positionElements();
  }

  function draw() {
    background("#b0c4b1");

    fill("#edafb8");
    noStroke();

    let rectWidth = windowWidth / 2;
    let rectHeight = windowHeight / 2;
    let rectX = (windowWidth - rectWidth) / 2;
    let rectY = (windowHeight - rectHeight) / 2;

    rect(rectX, rectY, rectWidth, rectHeight);

    fill(0);
    textSize(35);
    textAlign(CENTER, CENTER);
    text(question, windowWidth / 2, rectY + 50);

    if (resultMessage) {
      text(resultMessage, windowWidth / 2, rectY + rectHeight - 50);
    }
  }

  function positionElements() {
    let rectWidth = windowWidth / 2;
    let rectHeight = windowHeight / 2;
    let rectX = (windowWidth - rectWidth) / 2;
    let rectY = (windowHeight - rectHeight) / 2;

    if (radio) {
      radio.position(rectX + rectWidth - radio.elt.offsetWidth / 2, rectY + 150);
    }

    if (submitButton) {
      submitButton.position(rectX + rectWidth - submitButton.width / 2, rectY + rectHeight - 150);
    }
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    positionElements();
  }

  function loadQuestion(index) {
    question = table.getString(index, "question");
    options = [
      table.getString(index, "option1"),
      table.getString(index, "option2"),
      table.getString(index, "option3"),
      table.getString(index, "option4"),
    ];
    correctAnswer = table.getString(index, "answer");

    if (radio) {
      radio.html("");
      for (let i = 0; i < options.length; i++) {
        radio.option(options[i]);
      }
    }
    selectedOption = null;
    resultMessage = "";
  }

  function handleNextQuestion() {
    if (selectedOption === correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < table.getRowCount()) {
      loadQuestion(currentQuestionIndex);
    } else {
      question = `測驗結束！答對：${correctCount} 題，答錯：${incorrectCount} 題`;
      options = [];
      resultMessage = "";
      radio.html("");
      submitButton.html("再試一次");
      submitButton.mousePressed(restartQuiz);
    }
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    loadQuestion(currentQuestionIndex);
    submitButton.html("下一題");
    submitButton.mousePressed(handleNextQuestion);
  }
}

