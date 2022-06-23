const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const link = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
// processScorecard(link);
function processScorecard(link){
    request(link, cb);
}

function cb(error, response, body){
    if(error)
        console.log(error);
    else
        extractMatchDetail(body);
}

function extractMatchDetail(body){
    let $ = cheerio.load(body);
    let pnd = $(".match-header-info.match-info-MATCH  .description").text();
    let result = $(".event .status-text").text();
    let detail = pnd.split(',');
    let place = detail[1].trim();
    let date = detail[2].trim();
    let innings = $(".card.content-block.match-scorecard-table .Collapsible");
    // console.log(innings.length);
    // let htmlString = "";
    for(let i=0; i<innings.length; i++){
        let teamName = $(innings[i]).find('h5').text().split('INNINGS')[0].trim();
        let oppTeamIndex = i==0?1:0;
        let oppTeam = $(innings[oppTeamIndex]).find('h5').text().split('INNINGS')[0].trim();
        let cInning = $(innings[i]);
        let allRows = cInning.find('.table.batsman tr');
        console.log(`${date} | ${place} | ${teamName} vs ${oppTeam} | ${result}`);
        for(let j=0; j<allRows.length; j++){
            let allCols = $(allRows[j]).find('td');
            let isWorthy = $(allCols[0]).hasClass('batsman-cell');
            // console.log(isWorthy);
            if(isWorthy==true){
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, oppTeam, place, date, result);
            }
        }
        
    }
    // console.log(htmlString);
}

function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, oppTeam, place, date, result){
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content  = readExcel(filePath, playerName);
    let dataObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        oppTeam,
        place,
        date,
        result
    }
    content.push(dataObj);
    writeExcel(filePath, content, playerName);

}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}

function readExcel(filepath, sheetName){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function writeExcel(filePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}


module.exports = {
    ps : processScorecard
}