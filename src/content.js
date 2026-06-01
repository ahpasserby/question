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
  if (document.querySelector('.video-toolbar-left-main')) {
    console.log("轮询到了! 已经渲染完成, 检查按钮是否已经存在...");
    if (document.getElementById('plugin-question-btn')) {
      console.log("按钮存在! ");
    } else {
      console.log("按钮不存在, 插入按钮...");
      const box = document.querySelector('.video-toolbar-left-main');
      // 构建 btn mian
      const btn = document.createElement('div');
      btn.id = 'plugin-question-btn';
      btn.classList.add('toolbar-left-item-wrap');
      // 构建 btnChild
      const btnChild = document.createElement('div');
      btnChild.title = '疑问（？）';
      btnChild.classList.add('video-toolbar-left-item');
      
      // 构建 btnChild 的左边 使用一个临时元素 temp 存 svg 然后取出放入 btnLeft 中
      const temp = document.createElement('div');
      temp.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 36 36" class="video-question video-toolbar-item-icon"><path d="M8 15C8 10 12 7.5 18 7.5C24 7.5 28 10 28 14.5C28 18.5 21.5 19.5 19 21C18.8 21.3 18.5 21.7 18.5 22.5" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18.5" cy="29" r="3.3" fill="currentColor"/></svg>';
      const btnLeft = temp.firstElementChild;

      
      // 构建 btn 的右边
      const btnRight = document.createElement('span');
      btnRight.classList.add('video-toolbar-item-text');
      btnRight.textContent = '0';
      btnRight.id = 'plugin-question-count';
      // 组织 btnChild
      btnChild.appendChild(btnLeft);
      btnChild.appendChild(btnRight);
      // 组织 btn
      btn.appendChild(btnChild);
      // 组织 box
      box.appendChild(btn);
      console.log("按钮插入完毕!结束轮询...");
      clearInterval(timer);
      // 事件绑定
      btn.addEventListener('click', onQuestionClick);
      
    }
  } else {
    console.log("轮询中, toolbar 还没有渲染完成...");
  }
}, 500);
