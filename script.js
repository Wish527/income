const sources = [
    "出书收入",
    "副业接单",
    "理财收益",
    "广告分成",
    "写作变现",
    "付费社群",
    "内容订阅",
    "培训课程",
    "电商带货",
    "YouTube 广告"
  ];
  
  function generateIncome() {
    const keyword = document.getElementById('keyword').value.trim();
    if (!keyword) return alert("请输入关键词");
    const result = sources.sort(() => 0.5 - Math.random()).slice(0, 3);
    document.getElementById('result').innerText = `${keyword} 的收入来源可能有：\n- ${result.join('\n- ')}`;
  }
  