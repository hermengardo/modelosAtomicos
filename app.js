const express = require('express');
const app = express();

app.use(express.static('.'));

app.listen(8000, function() {
  console.log("Server is running on localhost:8000");
});
