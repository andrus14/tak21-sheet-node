const express = require('express');
const app = express();
const qs = require('querystring');
const sheets = require('./sheets.js');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  (async () => {
    const data = await sheets.readSheet();
    res.render('home', { rows: data });
  })();
});

app.get('/update', (req, res) => {
  res.render('update');
});

app.post('/updateRow', (req, res) => {
  if (req.method == 'POST') {
    let body = '';

    req.on('data', function (data) {
        body += data;

        if (body.length > 1e6)
          req.socket.destroy();
        }
    );

    req.on('end', function () {
        const post = qs.parse(body);
        (async () => {
          const data = await sheets.appendSheet(post);
          
          res.writeHead(302, {
            'Location': '/'
          });
          res.end();
        })();

    });
  }

});


app.listen(8080, () => {
    console.log("Server successfully running on port 8080");
});
