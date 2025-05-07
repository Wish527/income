let timer = null;

function startTracking() {
  if (timer) clearInterval(timer);

  const salary = parseFloat(document.getElementById('monthlySalary').value);
  const startInput = document.getElementById('startTime').value;
  const endInput = document.getElementById('endTime').value;

  if (isNaN(salary) || !startInput || !endInput) {
    alert("请填写完整信息！");
    return;
  }

  // 计算每小时工资，按每月21.75个工作日、每天8小时
  const rate = salary / (21.75 * 8);

  const [startH, startM] = startInput.split(':').map(Number);
  const [endH, endM] = endInput.split(':').map(Number);

  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(startH, startM, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(endH, endM, 0, 0);

  // 隐藏输入框，显示结果区域
  document.getElementById('inputSection').style.display = 'none';
  document.getElementById('result').style.display = 'block';

  function update() {
    const now = new Date();

    // 如果当前时间早于上班时间，什么也不显示
    if (now < startTime) {
      document.getElementById('timeElapsed').innerText = '0 秒';
      document.getElementById('money').innerText = '0';
      document.getElementById('timeToOff').innerText = '别急，还没到上班时间';
      return;
    }

    // 如果已下班，则锁定显示，不再继续计时
    if (now >= endTime) {
      const totalSeconds = Math.floor((endTime - startTime) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const earned = (totalSeconds / 3600 * rate).toFixed(2);

      document.getElementById('timeElapsed').innerText = `${hours} 时 ${minutes} 分 ${seconds} 秒`;
      document.getElementById('money').innerText = earned;
      document.getElementById('timeToOff').innerText = '你好，请下班';

      clearInterval(timer); // 停止定时器
      return;
    }

    // 正常上班中的计时逻辑
    const secondsPassed = Math.floor((now - startTime) / 1000);
    const hours = Math.floor(secondsPassed / 3600);
    const minutes = Math.floor((secondsPassed % 3600) / 60);
    const seconds = secondsPassed % 60;

    const earned = (secondsPassed / 3600 * rate).toFixed(2);
    document.getElementById('timeElapsed').innerText = `${hours} 时 ${minutes} 分 ${seconds} 秒`;
    document.getElementById('money').innerText = earned;

    const secondsToOff = Math.floor((endTime - now) / 1000);
    const h = Math.floor(secondsToOff / 3600);
    const m = Math.floor((secondsToOff % 3600) / 60);
    const s = secondsToOff % 60;
    document.getElementById('timeToOff').innerText = `${h} 时 ${m} 分 ${s} 秒`;
  }

  update();
  timer = setInterval(update, 1000);
}
