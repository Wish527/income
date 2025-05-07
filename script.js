let timer = null;

function startTracking() {
  if (timer) clearInterval(timer);

  const rate = parseFloat(document.getElementById('hourlyRate').value);
  const timeInput = document.getElementById('startTime').value;

  if (isNaN(rate) || !timeInput) {
    alert("请填写工资和时间！");
    return;
  }

  const [hours, minutes] = timeInput.split(':').map(Number);
  const startTime = new Date();
  startTime.setHours(hours, minutes, 0, 0);

  // 隐藏输入部分
  document.getElementById('inputSection').style.display = 'none';

  // 显示计算结果部分
  document.getElementById('result').style.display = 'block';

  function update() {
    const now = new Date();
    const hoursWorked = Math.floor((now - startTime) / 1000 / 3600);  // 已工作小时数
    const minutesWorked = Math.floor((now - startTime) / 1000 / 60) - hoursWorked * 60;  // 已工作分钟数
    const secondsWorked = Math.floor((now - startTime) / 1000) - hoursWorked * 3600 - minutesWorked * 60;  // 已工作秒数
    if (secondsWorked < 0) return; // 还没到上班时间

    const total_seconds = Math.floor((now - startTime) / 1000);

    const earned = (total_seconds / 3600 * rate).toFixed(2);

    document.getElementById('timeElapsed').innerText = hoursWorked + ' 时 ' + minutesWorked + ' 分 ' + secondsWorked + ' 秒 ';
    document.getElementById('money').innerText = earned;
  }

  update();
  timer = setInterval(update, 1000);
}
