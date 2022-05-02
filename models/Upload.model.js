
require('dotenv').config();

const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

//Llamo a todas las credenciales de mi cuenta de GoogleDrive
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: "v3",
    auth: oauth2Client
})

module.exports = {
    uploadFile: async () => { //Funcion que se encarga de subir en archivo
        try{
            const createFile = await drive.files.create({
                requestBody: {
                    name: "xml.txt",
                    mimeType: 'text/txt'
                },
                media: {
                    mimeType: 'text/txt',
                    body: fs.createReadStream(path.join(__dirname, '/../xml.txt'))
                }
            })

            console.log(createFile.data)
        } catch (error) {
            console.error(error);
        }
    },
}