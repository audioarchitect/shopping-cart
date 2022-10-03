const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const router = require('./routes/routes');

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/shopping-cart', router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});