let count = 0; // 记数用户的疑惑

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
        count = Math.min(count, 66);
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




/*
简易获取弹幕
弹幕请求的接口 CORS 放行, 直接使用 cid能够 Fetch 到 xml
但是这是有限弹幕池, 不是视频的全量弹幕, 需要改进
*/

/*
// 获取 BVID
location.pathname

*/

/*
// 获取 cid

fetch('https://api.bilibili.com/x/player/pagelist?bvid=BV1QNVS6FEec') // BVID 
  .then(r => r.json())
  .then(d => console.log('cid =', d.data[0].cid))

*/

/*
fetch('https://comment.bilibili.com/38748491042.xml')  // 对应 cid 需要更换
  .then(r => r.text())
  .then(t => {
    const doc = new DOMParser().parseFromString(t, 'text/xml');
    const ds = doc.querySelectorAll('d'); // 获取所有弹幕节点
    console.log('总弹幕数:', ds.length);
    // ↓ 这里你来写：遍历 ds，数出"问号弹幕"有几条
    ds.forEach(item => {
      // item.textContent 获取弹幕的文字内容
      // 判断弹幕内容是否包含问号（中文？、英文? 都统计）
      if (/^[？?]+$/.test(item.textContent)) { // 正则
        console.log('问号弹幕：', item.textContent);
      }
    });
  })
  .catch(err => console.error('请求失败:', err)); // 增加错误捕获
*/








/*
通过 protobuf 解析 - 似乎也不行, 请求多了会给拦下来

// location.pathname.split('/')[2]

function parseDanmaku(buffer) {
  const bytes = new Uint8Array(buffer);
  const contents = [];
  function readVarint(pos) {           // 读一个变长整数，返回 [值, 新位置]
    let value = 0, shift = 0, b;
    do { b = bytes[pos++]; value |= (b & 0x7f) << shift; shift += 7; } while (b & 0x80);
    return [value >>> 0, pos];
  }
  function skip(pos, wt) {             // 跳过不关心的字段
    if (wt === 0) { while (bytes[pos] & 0x80) pos++; return pos + 1; }
    if (wt === 2) { let len; [len, pos] = readVarint(pos); return pos + len; }
    if (wt === 5) return pos + 4;
    if (wt === 1) return pos + 8;
    return pos;
  }
  let i = 0;
  while (i < bytes.length) {
    let key; [key, i] = readVarint(i);
    if ((key >> 3) === 1 && (key & 7) === 2) {        // 字段1：一条弹幕
      let len; [len, i] = readVarint(i);
      const end = i + len; let j = i, content = '';
      while (j < end) {
        let k; [k, j] = readVarint(j);
        if ((k >> 3) === 7 && (k & 7) === 2) {         // 字段7：content 文本
          let slen; [slen, j] = readVarint(j);
          content = new TextDecoder().decode(bytes.subarray(j, j + slen));
          j += slen;
        } else { j = skip(j, k & 7); }
      }
      contents.push(content); i = end;
    } else { i = skip(i, key & 7); }
  }
  return contents;   // 返回这一段所有弹幕文字的数组
}

// 拉取当前视频全部弹幕，数出"纯问号"弹幕条数
async function countQuestionDanmaku() {
  // 1. 从网址拿 BVID（/video/BVxxx/ → 取第 2 段）
  const bvid = location.pathname.split('/')[2];

  // 2. 用 BVID 换 cid 和视频时长(秒)
  const pageRes = await fetch('https://api.bilibili.com/x/player/pagelist?bvid=' + bvid);
  const pageData = await pageRes.json();
  const { cid, duration } = pageData.data[0];   // 注：多P视频这里只取了第1P（已知局限）

  // 3. 分段数 = ⌈时长 / 6分钟⌉
  const segCount = Math.ceil(duration / 360);

  // 4. 并行拉取所有分段并解码
  const tasks = [];
  for (let s = 1; s <= segCount; s++) {
    const url = `https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=${cid}&segment_index=${s}`;
    tasks.push(
      fetch(url).then(r => r.arrayBuffer()).then(buf => parseDanmaku(buf))
        .catch(() => [])            // 某段失败就当空，不连累整体
    );
  }
  const segments = await Promise.all(tasks);

  // 5. 合并所有段 → 一个大数组
  const all = segments.flat();

  // 6. 数纯问号（方案乙）
  let q = 0;
  for (const text of all) {
    if (/^[？?]+$/.test(text.trim())) q++;
  }

  console.log(`总弹幕 ${all.length}，纯问号 ${q}`);
  console.log('段数 segCount =', segCount, '；各段条数 =', segments.map(s => s.length));
  return q;
}

调用countQuestionDanmaku()

*/
