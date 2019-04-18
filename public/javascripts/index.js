$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
	pressureData=[],
    humidityData = [];
	
	
  var dataTemp = {
    labels: timeData,
    datasets: 
      [{
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      }]
  }
  
  var dataHumid= {
	  labels: timeData,
	  datasets:[{
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }]
	  
  }
  
  var dataPressure={
	labels: timeData,
	  datasets:[{
        fill: true,
        label: 'Pressure',
        yAxisID: 'Pressure',
        borderColor: "rgba(6, 127, 23, 139)",
        pointBoarderColor: "rgba(6, 127, 23, 139)",
        backgroundColor: "rgba(24, 120, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: pressureData
      }]
  
  }
  
  var basicOptionTemp = {
    title: {
      display: true,
      text: 'Temperature Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }]
    }
  }
  
  var basicOptionPres = {
    title: {
      display: true,
      text: 'Pressure Real-time Data',
      fontSize: 36,
    },
    scales: {
      yAxes: [{
        id: 'Pressure',
        type: 'linear',
        scaleLabel: {
          labelString: 'Pressure(mm.hg.)',
          display: true
        },
        position: 'left',
      }]
    }
  }
  
  var basicOptionHumid = {
    title: {
      display: true,
      text: 'Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes:  [{
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'left'
        }]
    }
  }
  
  
  //Get the context of the canvas element we want to select
  var ctxTemp = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChartTemp = new Chart(ctxTemp, {
    type: 'line',
    data: dataTemp,
    options: basicOptionTemp
  });

  var ctxHumid = document.getElementById("secondChart").getContext("2d");
  var myLineChartHumid = new Chart(ctxHumid, {
    type: 'line',
    data: dataHumid,
    options: basicOptionHumid
  });
  
  var ctxPress = document.getElementById("pressureChart").getContext("2d");
  var myLineChartPress = new Chart(ctxPress, {
    type: 'line',
    data: dataPressure,
    options: basicOptionPres
  });
  
  var ws = new WebSocket('wss://' + location.host);
  
  
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }
	  
	  
	  if (obj.pressure) {
        pressureData.push(obj.pressure);
      }
      if (pressureData.length > maxLen) {
        pressureData.shift();
      }
	  
	  myLineChartPress.update();
      myLineChartHumid.update();
	  myLineChartTemp.update();
	  
    } catch (err) {
      console.error(err);
    }
  }
});
