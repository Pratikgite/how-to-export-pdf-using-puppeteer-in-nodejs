const puppeteer = require('puppeteer');
const { cron } = require("node-cron");
const { fs } = require("fs");
const { path } = require("path");
// const { readFile } = require('util').promisify(fs.readFile);

exports.pdfExport = async (req, res) => {
    console.log("working pdf route");

    try {
        const url = `https://google.com/`;
        const browser = await puppeteer.launch({
            headless: true
        });
        // create a new page
        const page = await browser.newPage();
      
        // Go to URL of HTML that I want to export in PDF
        await page.goto(url, {
            waitUntil: "networkidle0"
        });
        // Create pdf file of opened page
        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            path: `./public/${Date.now()}_pdf.pdf`
        });
       
        // close the browser
        await browser.close();
       
        // Return generated pdf in response
        res.contentType("application/pdf");
        return res.status(200).send(pdf);

    } catch(err) {
        console.log(err);
        res.send('Something went wrong.')
    }
};

exports.cron = async (req, res) => {
    cron.schedule('* * * * *', () => {
        console.log('running a task every minute');
    });
}

