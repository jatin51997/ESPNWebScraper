const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
const AllMatchesObj = require("./AllMatches");
const link = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

let iplpath =path.join(__dirname, "ipl");
dirCreator(iplpath);

request(link, cb);
function cb(error, response, body){
    if(error)
        console.log(error);
    else
        handleHTML(body);
}

function handleHTML(body){
    // console.log(response);
    let html = cheerio.load(body);
    let rlink = html(".label.blue-text.blue-on-hover").attr("href");
    rlink = "https://www.espncricinfo.com" + rlink;
    request(rlink, function cbb(error, response, body){
        if(error)
            console.log(error);
        else
            AllMatchesObj.getAllMatches(body);
    });
    
}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}