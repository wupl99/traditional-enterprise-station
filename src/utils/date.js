export function parseDate(time){
  var curDate = new Date();
  curDate.setTime(time);
  var year = curDate.getFullYear();
  var month = curDate.getMonth() + 1;
  var date = curDate.getDate();
  var hours = curDate.getHours();
  var minutes = curDate.getMinutes();
  var seconds = curDate.getSeconds();

  month = month < 10 ? '0'+month : month;
  date = date < 10 ? '0'+date : date;
  hours = hours < 10 ? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  return year+'-'+month+'-'+date + ' '+hours+':'+minutes+':'+seconds;
};