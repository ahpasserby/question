let countVedio = 0;  // 记数视频中的问号条数(能获取到的弹幕池, 可能不等于真正的全量弹幕池)
// let countQuestion = 0; // 记数视频中的问号个数(能获取到的弹幕池, 可能不等于真正的全量弹幕池)


async function countQuestionDanmaku() {
  // BVID（/video/BVxxx/ → 取第 2 段）
  const bvid = location.pathname.split('/')[2];

  // CID
  const cid = (await (await fetch('https://api.bilibili.com/x/player/pagelist?bvid=' + bvid)).json()).data[0].cid;

  // xmlText - fetch到 xml 转为 text 文本存入 xmlText
  const xmlText = await (await fetch('https://comment.bilibili.com/' + cid + '.xml')).text();

  // doc - 将 xmlText 转为 DOM
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');

  // ds - 选出 doc(DOM) 中的所有 d 标签, 存入类数组 ds
  const ds = doc.querySelectorAll('d');
  console.log('当前弹幕池中的总弹幕数:' + ds.length);

  // 数问号
  countVedio = 0;
  //countQuestion = 0;
  ds.forEach(item => {
    if (isQuestionDanmaku(item.textContent)) { // 正则判断 item 是否只有问号构成
      countVedio++;
      //countQuestion += item.textContent.length;
      console.log('问号弹幕：', item.textContent);
    }
  })
  // console.log('问号条数:' + countVedio + '|问号数:' + countQuestion);
  console.log('问号条数:' + countVedio);
  const targetEl = document.querySelector('.dm-text');
  if (targetEl) {
    const pct = ds.length ? countVedio / ds.length : 0; // 计算当前弹幕池中的疑惑率(防止除 0)
    const raw = parseCount(targetEl.textContent);
    console.log('总弹幕量: ' + raw + ' | 疑惑比率: ' + pct);
    document.getElementById('plugin-question-count').textContent = bStyle(raw * pct);
  } else {
    document.getElementById('plugin-question-count').textContent = countVedio; // 改数字
  }
}

// 判断一条弹幕是不是"疑惑弹幕"
function isQuestionDanmaku(text) {
  text = text.trim();
  const qCount = (text.match(/[？?¿]/g) || []).length; // 数有几个问号
  if (qCount === 0) return false; // 一个问号都没有 → 不是
  if (qCount >= 3) return true; // 条件A：≥3 个问号，直接算
  const hasWord = /[\p{L}\p{N}]/u.test(text);     // 有没有文字(含中文)或数字
  return !hasWord;    // 条件B：没有实质文字 + 至少1个问号, 算疑惑
}

// 将 .dm-text 返回的字段解析成原始数字
function parseCount(text) {
  const n = parseFloat(text);
  if (text.includes('亿')) return n * 1e8;
  if (text.includes('万')) return n * 1e4;
  return n;
}

// 将数据转换为 b 站风格显示
function bStyle(n) {
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '亿';
  if (n >= 1e4) return (n / 1e4).toFixed(1) + '万';
  return Math.round(n);
}