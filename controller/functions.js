const puppeteer = require('puppeteer');
const { cron } = require("node-cron");
const fs = require("fs");
const { path } = require("path");
const { Configuration, OpenAIAPI } = require('openai');
const { readline } = "readline";
const Imap = require('imap');
const {simpleParser} = require('mailparser');

exports.pdfExport = async (req, res) => {
    try {
        const url = `https://google.com/`;  // url what you want to export.
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
        res.status(500).send('Something went wrong,', err);
    }
};

exports.cron = async (req, res) => {
    cron.schedule('* * * * *', () => {
        console.log('running a task every minute');
    });
}

exports.chatbot = async (req,res) => {

    var first = fs.readFileSync('./controller/dummy.txt', 'utf8');
    console.log("first: ", first);

    fs.readFile('./controller/dummy.txt', function (err, data) {
        if (err) return console.error(err);
       console.log(data.toString());
    });
    return 1;
    
    const configuration = new Configuration({
        apiKey: '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',
    });

    const openai = new OpenAIAPI(configuration);
    


    openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
        })
        .then((res) => {
            console.log(res.data.choices[0].message.content);
        })
        .catch((e) => {
            console.log(e);
        });

}

exports.mailReader = async (req, res) => {
    try {
        const imapConfig = {
            user: 'youremail@gmail.com',
            password: 'password',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        };

        const imap = new Imap(imapConfig);
        imap.once('ready', () => {
          imap.openBox('INBOX', false, () => {
            imap.search(['UNSEEN', ['ON', "2023-11-18T00:00:00.853Z"]], (err, results) => {
              const f = imap.fetch(results, {bodies: ''});
              f.on('message', msg => {
                msg.on('body', stream => {
                  simpleParser(stream, async (err, parsed) => {
                    // const {from, subject, textAsHtml, text} = parsed;
                    console.log(parsed);
                    /* Make API call to save the data
                       Save the retrieved data into a database.
                       E.t.c
                    */
                  });
                });
                msg.once('attributes', attrs => {
                    const {uid} = attrs;
                    //   imap.addFlags(uid, ['\\Seen'], () => {
                    //     // Mark the email as read after reading it
                    //     console.log('Marked as read!');
                    //   });
                    imap.setFlags(uid,"Deleted",1);
                });
              });
              f.once('error', ex => {
                return Promise.reject(ex);
              });
              f.once('end', () => {
                console.log('Done fetching all messages!');
                imap.end();
              });
            });
          });
        });
    
        imap.once('error', err => {
          console.log(err);
        });
    
        imap.once('end', () => {
          console.log('Connection ended');
        });
    
        imap.connect();
    } catch (ex) {
        console.log('an error occurred');
    }
};