const express = require('express')
const bodyParser = require('body-parser')
const app = express();

app.get('/', (req, res) => {
  res.send("Hello World")
})


const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if(err) return console.log(err);
  console.log('server running at port ' + port);
})
