let count = 0; // 记数疑惑
let isCooling = false;
let cooldownEnd = 0; // 冷却结束的时间点（毫秒时间戳）

// 物理状态量
let angle = 0;
let speed = 0;
let isSpinning = false; // 检查是否已经在旋转了
let svg = null; // 缓存图标引用


// 全局监听
document.addEventListener('keydown', (e) => {
  const el = document.activeElement;
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
    return;
  }
  if (e.key === '?' || e.key === '？') {
    onQuestionClick();
  }
})

function onQuestionClick() {
  console.log('疑惑了, 疑惑按钮受到点击')
  count++;
  svg = document.querySelector('.video-question');
  speed += 8;
  if (!isSpinning) {
    isSpinning = true;
    requestAnimationFrame(tick);
  }
  showToast('疑问 + 1');
}

function showToast(text) {
  document.querySelector('.bpx-player-video-area').style.position = 'relative';
  const toastItem = document.createElement('div');
  toastItem.classList.add('bpx-player-tooltip-item');
  toastItem.classList.add('q-toast-floatting');
  toastItem.dataset.name = 'shortcut';
  toastItem.style.cssText = 'position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); visibility: visible; opacity: 1;';
  
  const toastTitle = document.createElement('div');
  toastTitle.classList.add('bpx-player-tooltip-title');
  toastTitle.textContent = text;
  toastItem.appendChild(toastTitle);
  
  const tooltipArea = document.querySelector('.bpx-player-tooltip-area');
  tooltipArea.appendChild(toastItem);
  toastItem.addEventListener('animationend', () => toastItem.remove());
}

function tick() {
  angle += speed;
  speed *= 0.97;  // 摩擦系数
  svg.style.transform = 'rotate(' + angle + 'deg)';
  if (speed > 0.8) { // 停止系数
    requestAnimationFrame(tick);
  } else {
    isSpinning = false;
    if (count > 0) {
      if (isCooling) {
        const Retime = Math.ceil((cooldownEnd - Date.now()) / 1000); // 向上取整
        showToast('等 ' + Retime + ' 秒哦, 不然疑惑要被你玩坏了');
      } else {
        // 向输入框装填问号
        count = Math.min(count, 20);
        sendDanmaku('?'.repeat(count));
        showToast('已发送' + count + '个疑惑');
        // 开启冷却
        isCooling = true;
        cooldownEnd = Date.now() + 5000;
        setTimeout(() => isCooling = false, 5000) // 5s 后解冻
      }
      count = 0;
    }
  }
}

function sendDanmaku(text) {
  const inputBox = document.querySelector('.bpx-player-dm-input');
  inputBox.value = text; // 修改 DOM
  inputBox.dispatchEvent(new Event('input', { bubbles: true })); // 冒泡派发 input 事件
  //document.querySelector('.bpx-player-dm-btn-send').click(); // click 发送, 不会触发 b 站的 5 秒等待动画

  // 派发 Enter 的 keydown 事件, 以此使得 b 站的 5 秒等待动画出现
  // 我真是个小天才
  inputBox.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter', // 冗余
    keyCode: 13, 
    which: 13, 
    bubbles: true, 
  }))
}