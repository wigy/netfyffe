const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.redirect('/quote/');
});

app.use('/quote', require('./routes/quote'));

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
