const { GoogleSpreadsheet } = require('google-spreadsheet');
const { helperFunctions } = require('../utils');
const app = helperFunctions.initFireBase()
const db = app.database()
const creds = {
    type: process.env.type,
    project_id: process.env.projectId,
    private_key_id: process.env.private_key_id,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}
console.log(creds)


const doc = new GoogleSpreadsheet(process.env.spreadSheetId);
exports.registerOfficers = async function(messageObject) {
    async function auth() {
        await doc.useServiceAccountAuth(creds)

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
    let authorTag = messageObject.author.username + '#' + messageObject.author.discriminator
    let adminTag = 'Murat Karaca#0756'
    if (authorTag === adminTag){
        transferSheetData()
    } else {
        messageObject.reply('You are not allowed to do that.')
    }

}

