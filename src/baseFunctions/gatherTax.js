/*const API = require("../apis");
const moment = require("moment");
const homeDir = require("os").homedir();
const desktopDir = `${homeDir}/Desktop`;
const excel = require("exceljs");
const fs = require("fs");
const readExcel = require("read-excel-file/node");
const helperFunctions = require("../utils").helperFunctions;

exports.gatherTax = function (messageObj, taxCommand) {
    let message = messageObj.content;
    message = helperFunctions.checkIfHasTaxCommand(message, taxCommand); // see if the message has tax command and remove it
    let silverToFameRatio = helperFunctions.getSilverToFameRatio(message);

    message = helperFunctions.removeSilverToFameRatio(message);

    API.getGuildId(message).then((res) => {
        let guilds = res.data.guilds;
        let guildName = guilds[0].Name;
        let guildId = guilds[0].Id;

        API.getGuildPlayers(guildId).then((res) => {
            let players = res.data;
            let names = [];
            let date = moment().format("DD.MM.YY");
            let gatherFame = [];
            let fameCollection = [];

            players.forEach((player) => {
                names.push(player.Name);
                gatherFame.push(player.LifetimeStatistics.Gathering.All.Total);
            });

            for (i = 0; i < names.length - 1; i++) {
                let fameData = {
                    name: names[i],
                    fame: gatherFame[i],
                };
                fameCollection.push(fameData);
            }
            var json = JSON.stringify(fameCollection);
            fs.writeFile(`${homeDir}/${guildName}.json`, json, "utf8", function (err) {
                if (err) throw err;
                console.log("complete");
            });

            let workBook = new excel.Workbook();
            let workSheet = workBook.addWorksheet(guildName);
            let excelPath = desktopDir + `/${guildName}.xls`;

            fs.stat(excelPath, function (err, stat) {
                if (err == null) {
                    let previousGatherCollection = [];
                    let currentGatherCollection = [];
                    readExcel(excelPath).then((rows) => {
                        rows.forEach((row) => {
                            previousGatherCollection.push(row);
                        });
                        console.log(previousGatherCollection);
                        fs.readFile(`${homeDir}/${guildName}.json`, "utf8", function (err, data) {
                            if (err) throw err;

                            let jsonObject = Object.values(JSON.parse(data));

                            let previousDate = previousGatherCollection[0][1];
                            jsonObject.forEach((object) => {
                                let currentPlayerName = object.name;
                                let playerExists = previousGatherCollection.find((previousData) => previousData[0] == currentPlayerName);
                                let playerData;

                                if (playerExists) {
                                    playerData = {
                                        name: object.name,
                                        previousFame: helperFunctions.removeDotsFromNumbers(playerExists[1]),
                                        newFame: helperFunctions.removeDotsFromNumbers(object.fame),
                                    };
                                } else {
                                    playerData = {
                                        name: object.name,
                                        newFame: helperFunctions.removeDotsFromNumbers(object.fame),
                                    };
                                }

                                currentGatherCollection.push(playerData);
                            });

                            workSheet.columns = [
                                {
                                    header: "Players",
                                    key: "player",
                                    width: 20,
                                },
                                {
                                    header: previousDate,
                                    key: "previousFame",
                                    width: 20,
                                },
                                {
                                    header: date,
                                    key: "currentFame",
                                    width: 20,
                                },
                                {
                                    header: "Fame Difference",
                                    key: "fameDiff",
                                    width: 20,
                                },
                                {
                                    header: "Tax Amount",
                                    key: "taxAmount",
                                    width: 20,
                                },
                            ];

                            let newJson = JSON.stringify(currentGatherCollection);
                            fs.writeFile(`${homeDir}/${guildName} current.json`, newJson, "utf8", function (err) {
                                if (err) throw err;
                                console.log("complete");

                                fs.readFile(`${homeDir}/${guildName} current.json`, "utf8", function (err, data) {
                                    if (err) throw err;
                                    Object.values(JSON.parse(data)).forEach((value) => {
                                        workSheet.addRow([
                                            value.name,
                                            helperFunctions.divideNumbersWithDot(value.previousFame),
                                            helperFunctions.divideNumbersWithDot(value.newFame),
                                            helperFunctions.divideNumbersWithDot(value.newFame - value.previousFame),
                                            helperFunctions.divideNumbersWithDot([value.newFame - value.previousFame] * silverToFameRatio),
                                        ]);
                                    });
                                    workBook.xlsx.writeFile(excelPath);
                                });
                            });
                        });
                    });
                } else if (err.code === "ENOENT")
                    try {
                        workSheet.columns = [
                            { header: "Players", key: "player", width: 20 },
                            { header: date, key: "date", width: 20 },
                        ];
                        fs.readFile(`${homeDir}/${guildName}.json`, "utf8", function (err, data) {
                            if (err) throw err;
                            Object.values(JSON.parse(data)).forEach((value) => {
                                workSheet.addRow([value.name, helperFunctions.divideNumbersWithDot(value.fame)]);
                            });
                            workBook.xlsx.writeFile(excelPath);
                        });
                    } catch (err) {
                        console.log(error);
                    }
            });
        });
    });
};*/
