console.log("This is question Plugin");
// setInterval 轮询 B 站有关video-toolbar-left 的 Vue 渲染有没有好
/* const timer = setInterval(() => {
  if (document.querySelector('.video-toolbar-left')) {
    console.log("轮询到了! 已经渲染完成, 检查按钮是否已经存在...");
    if (document.getElementById('plugin-question-btn')) {
      console.log("按钮存在! 持续轮询...");
    } else {
      console.log("按钮不存在, 插入按钮...");
      const box = document.querySelector('.video-toolbar-left');
      const btn = document.createElement('div');
      btn.id = 'plugin-question-btn';
      btn.textContent = '?';
      btn.title = '问号(?)';
      box.appendChild(btn);
      // 不 clearInterval 因为 Vue 会擦除, 我们要持续让他出现
      console.log("按钮插入完毕!持续轮询...");
    }
  } else {
    console.log("轮询中, toolbar 还没有渲染完成...");
  }
}, 500);
*/

const timer = setInterval(() => {
  if (document.querySelector('.video-toolbar-left')) {
    console.log("轮询到了! 已经渲染完成, 检查按钮是否已经存在...");
    if (document.getElementById('plugin-question-btn')) {
      console.log("按钮存在! ");
    } else {
      console.log("按钮不存在, 插入按钮...");
      const box = document.querySelector('.video-toolbar-left');
      const btn = document.createElement('div');
      btn.id = 'plugin-question-btn';
      btn.classList.add('video-toolbar-left-item');
      btn.textContent = '?';
      btn.title = '问号(?)';
      box.appendChild(btn);
      console.log("按钮插入完毕!结束轮询...");
      clearInterval(timer);
    }
  } else {
    console.log("轮询中, toolbar 还没有渲染完成...");
  }
}, 500);
