const { GoogleSpreadsheet } = require('google-spreadsheet');
const googleSpreadSheet = require('google-spreadsheet');
const fs = require('fs');
const {uploadFile} = require('./models/Upload.model');
const google = require('googleapis');
let XMLWriter = require('xml-writer');

const credentials = require('./api-google-credentials.json');

function printWorker(worker) {
    console.log(`Nombre: ${worker.Nombre} `);
    console.log(`Edad: ${worker.Edad} `);
    console.log(`Puesto: ${worker.Puesto} `);
    console.log(`Correo: ${worker.Correo} `);
    console.log("----------------------");
}

async function accesSpreedSheet(){
    //Inicializa el GoogleSheet con el ID del documento.
    const doc = new GoogleSpreadsheet('15Qb9t6sOEl-QU2nZ1SkF0VM57QFu6R7MNnbMYtHk5Q4');

    //Inicializa el Auth de la cuenta con todos los credenciales.
    await doc.useServiceAccountAuth(credentials);
    
    //Carga de todas propiedades del documento.
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    //Comienza la creación del archivo XML

    let xml = new XMLWriter();
    xml.startDocument('1.0', 'UTF-8').startElement('data');
    
    //Itera por cada elemento que haya en las filas
    rows.forEach(row => {
        printWorker(row); //Llamo a la función que me imprime en consola los datos de la planilla.
        xml.writeElement("Nombre", `${row.Nombre}`);
        xml.writeElement("Edad", `${row.Edad}` );
        xml.writeElement("Puesto", `${row.Puesto}`);
        xml.writeElement("Correo", `${row.Correo}`);
    })

    xml.endElement();

    xml.endDocument();

    //A partir de acá el contenido del XML creado se guarda en un xml.txt
    //Cambiar la extension en la cadena del nombre del archivo a xml.xml si se prefiere obtener el mismo primero en ese formato.
    
    fs.appendFile('xml.txt', xml.toString(), (error)=>{
        if(error){
            throw error;
        }
        console.log("El archivo ha sido creado exitosamente...");
    });
    console.log(xml.toString());
}   

accesSpreedSheet();
uploadFile(); //función llamada desde /models/Upload.model.js