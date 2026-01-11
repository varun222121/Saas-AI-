
const pdf = require('pdf-parse');
const fs = require('fs');

const dataBuffer = fs.readFileSync(process.argv[2]);
pdf(dataBuffer).then(data => {
    console.log(JSON.stringify({ text: data.text, pages: data.numpages }));
}).catch(err => {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
});
