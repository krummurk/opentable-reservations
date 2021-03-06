const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const models = require('./models.js');
const expressStaticGzip = require('express-static-gzip');
const app = express();
var port = 3010;

app.use(cors());
app.use('/', expressStaticGzip(path.join(__dirname, '../public'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: function (res, path) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
   },
   index: false
}));
// app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/restaurant/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/API/restaurant/reservation/:restID/bookedTimes', (req, res) => {
  models.queryNumberOfResToday(req.params.restID, (err, result) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    let numResToday = result[0].resToday.toString();
    res.status(200).send(numResToday);
  })
});


app.get('/API/restaurant/reservation/:restID/reservations', (req, res) => {
  models.queryAvailableReservations(req.params.restID, req.query.partySize, req.query.dateTime, (err, results) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).json(results);

  });
});

app.listen(port, () => {
  console.log('Listening on port:', port);
});