let timer = null;

// —— 1. 法定节假日（2025年） ——
// 数据来源：国务院办公厅《2025年部分节假日安排的通知》
const holidays = [
  '2025-01-01',                             // 元旦
  '2025-01-28','2025-01-29','2025-01-30','2025-01-31','2025-02-01','2025-02-02','2025-02-03','2025-02-04', 
  '2025-04-04','2025-04-05','2025-04-06',   
  '2025-05-01','2025-05-02','2025-05-03','2025-05-04','2025-05-05', 
  '2025-05-31','2025-06-01','2025-06-02',   
  '2025-09-08',                             
  '2025-10-01','2025-10-02','2025-10-03','2025-10-04','2025-10-05','2025-10-06','2025-10-07','2025-10-08'
];

// —— 2. 调休（补班）工作日 ——  
const makeupDays = [
  '2025-01-26','2025-02-08', // 春节前后补班
  '2025-04-27', // 劳动节补班 
  '2025-09-28','2025-10-11'  // 国庆中秋补班 
];

// 日期格式化为 yyyy-mm-dd（本地时间）
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// 判断是否为法定节假日
function isHoliday(date) {
    return holidays.includes(formatDate(date));
}

// 判断是否为调休补班
function isMakeupDay(date) {
    return makeupDays.includes(formatDate(date));
}

// —— 3. 计算当月实际工作日数（调休算工作日，节假日不算） ——  
function getWorkingDaysInMonth(year, month) {
  let workingDays = 0;
  const date = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  while (date <= last) {
    const dStr = formatDate(date);
    const wd = date.getDay(); // 0=周日,6=周六

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

// —— 4. 实时工资追踪主函数 ——
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

    // console.log(workDays);
  
    const rate = salary / (workDays * 8);  // 每天8小时
    
    // console.log(rate);
  
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
  
    // 切换显示
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('result').style.display = 'block';
  
    let isLunchBreak = false;
  
    function update() {
      const now = new Date();
      
      // 下班早退保护
      if (now < startTime) {
      document.getElementById('timeElapsed').innerText = '0 秒';
      document.getElementById('money').innerText = '0';
      document.getElementById('timeToOff').innerText = '别急，还没到上班时间';
      return;
      }
      
      // 到点下班
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
      
      // 判断是否在午休时间
      const inLunchBreak = now >= lunchStartTime && now < lunchEndTime;
      
      // 已工作秒数（扣除午休）
      let workedSeconds = Math.floor((now - startTime) / 1000);
      
      if (now > lunchEndTime) {
      workedSeconds -= Math.floor((lunchEndTime - lunchStartTime) / 1000);
      } else if (now > lunchStartTime) {
      workedSeconds -= Math.floor((now - lunchStartTime) / 1000);
      }
      
      // 限制最大工时
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
      
      // 工具函数：午休实际需要扣除的时间（只在 startTime 与 endTime 内的部分）
      function getLunchDuration(start, end) {
      const overlapStart = Math.max(start.getTime(), lunchStartTime.getTime());
      const overlapEnd = Math.min(end.getTime(), lunchEndTime.getTime());
      return Math.max(0, overlapEnd - overlapStart);
      }
      
      // 工具函数：将秒数转为 时 分 秒
      function convertSeconds(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return [h, m, s];
      }
      
  
    update();
    timer = setInterval(update, 1000);
  }
  
