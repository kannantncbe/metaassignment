var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

var server = http.createServer({
    requestCert: false,
    rejectUnauthorized: false
}, app);

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
 app.use(bodyParser.urlencoded({
    extended: false
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.post('/metadatascrap', function(req, res) {
    console.log("post values: ", req.body);
    var targeturl = req.body.targeturl;

    if (targeturl) {} else {
        var response = { "error": "targeturl parameter is missing" };
        res.json(response);
        return false;
    }

    const turl = targeturl;

    const getMetaData = require('metadata-scraper')
    const options = {
        url: turl, // URL of web page
        maxRedirects: 0, // Maximum number of redirects to follow (default: 5)
        ua: 'MyApp', // Specify User-Agent header
        lang: 'de-CH', // Specify Accept-Language header
        timeout: 1000, // Request timeout in milliseconds (default: 10000ms)
        forceImageHttps: false, // Force all image URLs to use https (default: true)
        customRules: {} // more info below
    }

    getMetaData(options).then((resdata) => {
        console.log(resdata)
        var data = {
            status: "success",
            status_code: 200,
            message: "Mata Data",
            result: resdata
        };
        res.json(data);
        return false;
    })

});

server.listen(3000, function() {
    console.log("API Service listening at 3000");
});