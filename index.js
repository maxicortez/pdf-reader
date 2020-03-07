
const express = require("express");
const app = express();
var fileupload = require("express-fileupload");
const fs = require('fs');
const pdf = require('pdf-parse');

var pathFile = "";
app.use(fileupload());

app.set("port", process.env.PORT || "3000");

app.get("/", (req, res, next)=> {
    res.status(200).send("Control de Existencias - Andina Argentina.");
})

app.get("/api", (req, res, next)=> {
    res.status(200).send("Control de Existencias - Andina Argentina, utilice POS");
})

app.post("/api/upload", (req, res, next) => {
    const file = req.files.pdfupdated;
    pathFile = "./upload/" + file.name
    file.mv(pathFile, (err, result)=> {
        if (err) {
            throw err;
        }
        
         readPdf(pathFile, res);
        
        //res.send({
        //    success: true,
        //    message: "Archivo subido",
        //    getreadpdf: resultado
        //})
    });
})

app.listen(app.get("port"), ()=> {
    console.log("Servidor funcionando en el puerto 3000");
})

function readPdf(pathDir, response){
    //let dataBuffer = fs.readFileSync('path to PDF file...');
    let dataBuffer = fs.readFileSync(pathDir);
    pdf(dataBuffer).then((data)=> {
    
        // number of pages
        // console.log(data.numpages);
        // number of rendered pages
        // console.log(data.numrender);
        // PDF info
        // console.log(data.info);
        // PDF metadata
        // console.log(data.metadata); 
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        // console.log(data.version);
        // PDF text
        response.send({
            success: true,
            message: "Archivo subido",
            resultado: data.text.split("\n")
        })
            
    }).catch((err)=> {
        response.send({
            success: true,
            message: "Archivo subido",
            error: err
        })
    })
};