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

  const rate = salary / (21.75 * 8); // 每小时工资，按21.75天计算

  const [startH, startM] = startInput.split(':').map(Number);
  const [endH, endM] = endInput.split(':').map(Number);

  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(startH, startM, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(endH, endM, 0, 0);

  document.getElementById('inputSection').style.display = 'none';
  document.getElementById('result').style.display = 'block';

  function update() {
    const now = new Date();
    const secondsPassed = Math.floor((now - startTime) / 1000);
    if (secondsPassed < 0) return;

    const hours = Math.floor(secondsPassed / 3600);
    const minutes = Math.floor(secondsPassed / 60) % 60;
    const seconds = secondsPassed % 60;

    const earned = (secondsPassed / 3600 * rate).toFixed(2);
    document.getElementById('timeElapsed').innerText = `${hours} 时 ${minutes} 分 ${seconds} 秒`;
    document.getElementById('money').innerText = earned;

    const secondsToOff = Math.floor((endTime - now) / 1000);
    if (secondsToOff >= 0) {
      const h = Math.floor(secondsToOff / 3600);
      const m = Math.floor(secondsToOff / 60) % 60;
      const s = secondsToOff % 60;
      document.getElementById('timeToOff').innerText = `${h} 时 ${m} 分 ${s} 秒`;
    } else {
      document.getElementById('timeToOff').innerText = `已下班`;
    }
  }

  update();
  timer = setInterval(update, 1000);
}
