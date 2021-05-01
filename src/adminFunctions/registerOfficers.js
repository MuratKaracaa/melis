const { GoogleSpreadsheet } = require('google-spreadsheet');
const { helperFunctions } = require('../utils');
const app = helperFunctions.initFireBase()
const db = app.database()

const doc = new GoogleSpreadsheet(process.env.spreadSheetId);

exports.registerOfficers = async function(){
    async function auth() {
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        })
    }
    auth()

    async function transferSheetData() {
        await doc.loadInfo()

        let sheet = doc.sheetsByIndex[0]
        let rows = await sheet.getRows()
        let officerData = []
        rows.forEach(row => {
            officerData[row['Name of the Guild (Case Sensitive)']] = {
                officerDcTag: row["Officer's Discord Tag (e.g. Example#1111)"],
                officerIGN: row["Officer's In Game Name"],
                proofURL: row["Proof URL (URL of image that clearly shows you are the leader of this Guild)"],
                timeStamp: row['Timestamp']
            }
        })
        db.ref('Officers').update({
            ...officerData,
        })

    }
    transferSheetData()
}

