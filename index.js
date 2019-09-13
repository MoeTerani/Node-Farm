const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//SERVER

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataobj = JSON.parse(data);

const slugs = dataobj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  //URL VARIABLE
  const { query, pathname } = url.parse(req.url, true);

  // overview PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const cardsHtml = dataobj
      .map(el => replaceTemplate(tempCard, el))
      .join(' ');
    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product = dataobj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API PAGE
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  }

  // NOT FOUND PAGE
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'My-own-Content': 'Hello-World!'
    });
  }
});

server.listen(8081, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:8081/');
});

// // Blocking , synchronu
// var textIn = fs.readFileSync('./txt/append.txt', 'utf8');
// console.log(textIn);

// const textOut = `This is what we know about the vacado: ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File Written');

// Non-Blocking , asynchronu
fs.readFile('./txt/stasssrt.txt', 'utf8', (err, data1) => {
  //   if (err) return console.log('Error💥');
  fs.readFile(`./txt/${data1}.txt`, 'utf8', (err, data2) => {
    console.log('second round!');
    fs.readFile(`./txt/append.txt`, 'utf8', (err, data3) => {
      fs.writeFile(`./txt/final.txt`, `${data2} \n${data3}`, 'utf8', err => {
        console.log('Your file has been written 😎');
      });
    });
  });
});

console.log('Data will be read!');
