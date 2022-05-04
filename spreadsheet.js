const { GoogleSpreadsheet } = require('google-spreadsheet');
const googleSpreadSheet = require('google-spreadsheet');
const fs = require('fs');
const {uploadFile} = require('./models/Upload.model');
const google = require('googleapis');
let XMLWriter = require('xml-writer');

const credentials = require('./api-google-credentials.json');

async function accesSpreedSheet(){
    //Inicializa el GoogleSheet con el ID del documento.
    const doc = new GoogleSpreadsheet('15Qb9t6sOEl-QU2nZ1SkF0VM57QFu6R7MNnbMYtHk5Q4');

    //Inicializa el Auth de la cuenta con todos los credenciales.
    await doc.useServiceAccountAuth(credentials);
    
    //Carga de todas propiedades del documento.
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    //Cargo las propiedades de la fila a la constante rows.
    const rows = await sheet.getRows()
    
    //Asigno constante headers a un array con los elementos de los cabezales de las columnas, es decir, la primera fila del documento.
    const headers = sheet.headerValues;

    //Comienza la creación del archivo XML

    let xml = new XMLWriter();
    xml.startDocument('1.0', 'UTF-8').startElement('data');
    
    for (i=2;i<rows.length+2;i++) { //Este for itera por la cantidad de filas que tenga la tabla, apartir de la segunda fila(la que no seria el header)
        
        
        await sheet.loadHeaderRow(i) //Para avanzar de fila, y poder acceder a los elementos de la misma, por cada iteracion asigno una nueva headerRow
        var datos = sheet.headerValues; //Asigno esa nueva fila de "headers" a la variable datos  
        
        for (j=0;j<datos.length;j++) {
            
            xml.writeElement(headers[j], datos[j]); //Me agrega los elementos header, como etiquetas en formato xml, y los elementos de datos dentro de esas etiquetas.

        }
    }
    
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

    uploadFile(); //función llamada desde /models/Upload.model.js
}   

accesSpreedSheet();
