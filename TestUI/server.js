const express = require('express');

const app = express();

// Middleware per il parsing del body delle richieste
app.use(express.json());

// Rotta per gestire le richieste su /WeatherForecast/unauthenticated
app.get('/WeatherForecast/unauthenticated', (req, res) => {
// creazione della response mockata
const response=[
  {
    date:new Date("11/02/2020"),
    temperatureC: 0,
    temperatureF: 32,
    summary: "Chilly",
  },{
    date:new Date("08/03/2024"),
    temperatureC: 36,
    temperatureF: 96.8,
    summary: "Hot",
  }
]
const responseString = JSON.stringify(response);
console.log(responseString)
  // Invio della stringa come risposta
  res.send(responseString);
});

// Avvio del server sulla porta 5001
app.listen(5001, () => {
  console.log('Server avviato sulla porta 5001');
});