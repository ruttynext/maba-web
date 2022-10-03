export const padTo2Digits = (num)=> {
    return String(num).padStart(2, '0');
};

export const GetFormatTime =(timeStamp, fullDateTime)=>
{ 
     const timeFormat = padTo2Digits(timeStamp.getHours()) + ':' + padTo2Digits(timeStamp.getMinutes());
     if(fullDateTime == true)
        return (timeStamp.getMonth() +1 ) + '/' + timeStamp.getDate() + '/' +  timeStamp.getFullYear() + " " + timeFormat;
    
     return timeFormat;
};

export const getTime = (startTime, endTime)=> {
 
    let diffTime = Math.abs(endTime.valueOf() - startTime.valueOf());
    let days = diffTime / (24*60*60*1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    return [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)];
    //[days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]
    //return hours+'שעות'+ minutes+'דקות'+ secs+'שניות';
  };

  export const formatTime = (secs)=> {
    var date = new Date(0);
    date.setSeconds(Number(secs));
    return date.toISOString().substr(11, 8);
};