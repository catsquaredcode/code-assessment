var express = require('express');
var router = express.Router();

/* GET unauthenticated. */
router.get('/unauthenticated', function (req, res, next) {
    const resp = [
        {
            date: new Date(),
            temperatureC: 30,
            temperatureF: 32 + (30 / 0.5556),
            summary: 'scorching'
        },
        {
            date: new Date(),
            temperatureC: 20,
            temperatureF: 32 + (20 / 0.5556),
            summary: 'warm'
        },
        {
            date: new Date(),
            temperatureC: 10,
            temperatureF: 32 + (10 / 0.5556),
            summary: 'cool'
        },
        {
            date: new Date(),
            temperatureC: 5,
            temperatureF: 32 + (5 / 0.5556),
            summary: 'chilly'
        },
        {
            date: new Date(),
            temperatureC: 0,
            temperatureF: 32 + (0 / 0.5556),
            summary: 'freezing'
        }
    ];
    const blob = new Blob([Buffer.from(JSON.stringify(resp))], { type: 'application/json' });
    res.type(blob.type)
    blob.arrayBuffer().then((buf) => {
        res.send(Buffer.from(buf))
    });
});

module.exports = router;
