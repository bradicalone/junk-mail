const express = require('express');
var path = require("path");
const app = express();

app.use( '/assets', express.static( __dirname + '/assets' ));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8081, () => console.log('Listening on port 8081!'));