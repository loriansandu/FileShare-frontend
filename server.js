function requireHTTPS(req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

const express = require('express');
const app = express();

app.use(requireHTTPS);
app.use(express.static('./dist/file-share-frontend'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/file-share-frontend/'}),
);

app.listen(process.env.PORT || 4200);
// app.listen( 4200);
