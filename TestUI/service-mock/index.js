const express = require('express');
const cors = require('cors'); 
const app = express();

// enable all origins as a mock service
app.use(cors({ origin: '*'}));

// servoce costants
const PORT = 5000;
const N_RECORDS = 10;
const TEMP_TYPES = [
    { type: 'Freezing', min: -Infinity, max: 5 },
    { type: 'Chilly', min: 5, max: 10 },
    { type: 'Cool', min: 10, max: 15 },
    { type: 'Mild', min: 15, max: 20 },
    { type: 'Warm', min: 20, max: 25 },
    { type: 'Balmy', min: 25, max: 30 },
    { type: 'Hot', min: 30, max: 35 },
    { type: 'Sweltering', min: 35, max: 40 },
    { type: 'Scorching', min: 40, max: Infinity }
  ];

// service functions
function getRandomTemperature(min, max) {
  return Math.random() * (max - min) + min;
}

function celsiusToFahrenheit(celsius) {
  return parseInt((celsius * 9/5)) + 32;
}

function setTemperatureType(celsiusTemp) {
  for (const type of TEMP_TYPES) {
    if (celsiusTemp >= type.min && celsiusTemp < type.max) {
      return type.type;
    }
  }
}  

// enable route 
app.get('/WeatherForecast/unauthenticated', (req, res) => {
  const temperatureData = [];

  // return N mock records 
  for (let i = 0; i < N_RECORDS; i++) {
    const today = new Date();
    const celsiusTemp = parseInt(getRandomTemperature(-5, 50));
    const fahrenheitTemp = celsiusToFahrenheit(celsiusTemp);
    const temperatureType = setTemperatureType(celsiusTemp);
    const data = {
      date: today,
      temperatureC: parseFloat(celsiusTemp.toFixed(2)),
      temperatureF: parseFloat(fahrenheitTemp.toFixed(2)),
      summary: temperatureType
    };
    temperatureData.push(data);
  }

  res.json(temperatureData);
});

// start the server
app.listen(PORT, () => {
  console.log('server started on port: '+PORT);
});
