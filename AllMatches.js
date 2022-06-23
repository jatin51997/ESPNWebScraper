const cheerio = require("cheerio");
const request = require("request");
const scorecardObj = require("./scorecard");

function handleSecondPage(body){
    let $ = cheerio.load(body);
    let scorecardList = $("a[data-hover='Scorecard']");
    for(let i=0; i<scorecardList.length; i++){
        let link = $(scorecardList[i]).attr("href");
        link = "https://www.espncricinfo.com" + link;
        console.log(link);
        scorecardObj.ps(link);
    }
}

module.exports = {
    getAllMatches : handleSecondPage
}