let timer = null;

const holidays = [
  '2025-01-01',
  '2025-01-28','2025-01-29','2025-01-30','2025-01-31','2025-02-01','2025-02-02','2025-02-03','2025-02-04',
  '2025-04-04','2025-04-05','2025-04-06',
  '2025-05-01','2025-05-02','2025-05-03','2025-05-04','2025-05-05',
  '2025-05-31','2025-06-01','2025-06-02',
  '2025-09-08',
  '2025-10-01','2025-10-02','2025-10-03','2025-10-04','2025-10-05','2025-10-06','2025-10-07','2025-10-08'
];

const makeupDays = [
  '2025-01-26','2025-02-08',
  '2025-04-27',
  '2025-09-28','2025-10-11'
];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isHoliday(date) {
  return holidays.includes(formatDate(date));
}

function isMakeupDay(date) {
  return makeupDays.includes(formatDate(date));
}

function getWorkingDaysInMonth(year, month) {
  let workingDays = 0;
  const date = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  while (date <= last) {
    const wd = date.getDay();
    if (isHoliday(date)) {
    } else if (isMakeupDay(date)) {
      workingDays++;
    } else if (wd !== 0 && wd !== 6) {
      workingDays++;
    }
    date.setDate(date.getDate() + 1);
  }
  return workingDays;
}

function startTracking() {
  if (timer) clearInterval(timer);

  const salary = parseFloat(document.getElementById('monthlySalary').value);
  const startInput = document.getElementById('startTime').value;
  const endInput = document.getElementById('endTime').value;
  const lunchStartInput = document.getElementById('lunchBreakStart').value;
  const lunchEndInput = document.getElementById('lunchBreakEnd').value;

  if (isNaN(salary) || !startInput || !endInput || !lunchStartInput || !lunchEndInput) {
    alert("请填写完整信息！");
    return;
  }

  const now = new Date();
  const workDays = getWorkingDaysInMonth(now.getFullYear(), now.getMonth());
  const rate = salary / (workDays * 8);

  const [startH, startM] = startInput.split(':').map(Number);
  const [endH, endM] = endInput.split(':').map(Number);
  const [lunchStartH, lunchStartM] = lunchStartInput.split(':').map(Number);
  const [lunchEndH, lunchEndM] = lunchEndInput.split(':').map(Number);

  const startTime = new Date(now);
  startTime.setHours(startH, startM, 0, 0);
  const endTime = new Date(now);
  endTime.setHours(endH, endM, 0, 0);
  const lunchStartTime = new Date(now);
  lunchStartTime.setHours(lunchStartH, lunchStartM, 0, 0);
  const lunchEndTime = new Date(now);
  lunchEndTime.setHours(lunchEndH, lunchEndM, 0, 0);

  document.getElementById('inputSection').style.display = 'none';
  document.getElementById('result').style.display = 'block';

  function update() {
    const now = new Date();

    if (now < startTime) {
      document.getElementById('timeElapsed').innerText = '0 秒';
      document.getElementById('money').innerText = '0';
      document.getElementById('timeToOff').innerText = '别急，还没到上班时间';
      return;
    }

    if (now >= endTime) {
      const totalSeconds = Math.floor((endTime - startTime - getLunchDuration(startTime, endTime)) / 1000);
      const earned = (totalSeconds / 3600 * rate).toFixed(2);
      const [h, m, s] = convertSeconds(totalSeconds);
      document.getElementById('timeElapsed').innerText = `${h} 时 ${m} 分 ${s} 秒`;
      document.getElementById('money').innerText = earned;
      document.getElementById('timeToOff').innerText = '你好，请下班';
      clearInterval(timer);
      return;
    }

    const inLunchBreak = now >= lunchStartTime && now < lunchEndTime;
    let workedSeconds = Math.floor((now - startTime) / 1000);

    if (now > lunchEndTime) {
      workedSeconds -= Math.floor((lunchEndTime - lunchStartTime) / 1000);
    } else if (now > lunchStartTime) {
      workedSeconds -= Math.floor((now - lunchStartTime) / 1000);
    }

    const maxSeconds = Math.floor((endTime - startTime - getLunchDuration(startTime, endTime)) / 1000);
    workedSeconds = Math.min(workedSeconds, maxSeconds);

    const earned = (workedSeconds / 3600 * rate).toFixed(2);
    const [h, m, s] = convertSeconds(workedSeconds);
    document.getElementById('timeElapsed').innerText = inLunchBreak ? '午休中' : `${h} 时 ${m} 分 ${s} 秒`;
    document.getElementById('money').innerText = earned;

    const secondsToOff = Math.floor((endTime - now) / 1000);
    const [h2, m2, s2] = convertSeconds(secondsToOff);
    document.getElementById('timeToOff').innerText = `${h2} 时 ${m2} 分 ${s2} 秒`;
  }

  function getLunchDuration(start, end) {
    const overlapStart = Math.max(start.getTime(), lunchStartTime.getTime());
    const overlapEnd = Math.min(end.getTime(), lunchEndTime.getTime());
    return Math.max(0, overlapEnd - overlapStart);
  }

  function convertSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s];
  }

  update();
  timer = setInterval(update, 1000);
}

// —— 返回修改按钮功能 —— 
function goBack() {
  if (timer) clearInterval(timer);
  document.getElementById('result').style.display = 'none';
  document.getElementById('inputSection').style.display = 'block';
}
