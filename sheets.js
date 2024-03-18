const { google } = require('googleapis');
const credentials = require('./google-sheets-api-credentials.json');

// authenticate the service account
const googleAuth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    'https://www.googleapis.com/auth/spreadsheets'
);

async function readSheet() {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      // read data in the range in a sheet
      const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
          auth: googleAuth,
          spreadsheetId: credentials.sheet_id,
          range: `${credentials.sheet_page}!B1:D1000`
      });
      
      const valuesFromSheet = infoObjectFromSheet.data.values;
      
      return valuesFromSheet;
    }
    catch(err) {
      console.log("readSheet func() error", err);  
    }
  }
  
  async function appendSheet(data) {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
  
      const appendToGsheet = [
        [
            data.name,
            data.description,
            data.quantity
        ],
      ];
      
      // append data in the range
      await sheetInstance.spreadsheets.values.append({
          auth: googleAuth,
          spreadsheetId: credentials.sheet_id,
          range: `${credentials.sheet_page}!B1:D1000`,
          valueInputOption: 'RAW',
          resource: {
            values: appendToGsheet,
          },
      });
    }
    catch(err) {
      console.log("updateSheet func() error", err);  
    }
  }

  module.exports = { readSheet, appendSheet };