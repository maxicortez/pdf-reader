
const express = require("express");
const app = express();
var fileupload = require("express-fileupload");
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require("path");

var pathFile = "";
app.use(fileupload());

app.set("port", process.env.PORT || "3000");

app.get("/", (req, res, next)=> {
    res.status(200).json({ 
        "Respuesta": "Control de Existencias - Andina Argentina", 
        "Autor": "Maximiliano Cortez"
    });
});

app.get("/api", (req, res, next)=> {
    res.status(200).json({ 
        "Respuesta": "APIS - Control de Existencias - Andina Argentina", 
        "Autor": "Maximiliano Cortez"
    });
});

app.get("/api/upload", (req, res, next)=> {
    res.status(200).json({ 
        "Respuesta": "API/UPLOAD PDF AND READ CAE - Control de Existencias - Andina Argentina", 
        "Autor": "Maximiliano Cortez", 
        "App Path": path.join(__dirname,"upload")
    });
})

app.post("/api/upload", (req, res, next) => {
    try {
        const file = req.files.pdfupdated;
        //pathFile = path.join(__dirname, "/upload/", file.name);
        pathFile = "./upload/" + file.name;
        file.mv(pathFile, (err)=> {
            if (err) {
                throw err;
            }
            let dataBuffer = fs.readFileSync(pathFile);
            pdf(dataBuffer).then((data)=> {
                fs.unlink(pathFile, (err)=>{
                    if (err) {
                        throw err;
                    }
                })
                res.status(200).json({ "Respuesta": data.text.split("\n"), 
                    "File": file.name, 
                    "Autor": "Maximiliano Cortez"                    
                });                
            }).catch((err)=> {
                res.status(403).json({ "Error": err, 
                    "Autor": "Maximiliano Cortez"
                });             
            });
        });    
    } catch(err) {
        res.status(400).json({ "Error": err, 
            "Autor": "Maximiliano Cortez"
        });             
    }
});

function readPdf(pathDir, response){
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

        //response.send({
        //    success: true,
        //    message: "Archivo subido",
        //    resultado: data.text.split("\n")
        //})

        response.send(data.text.split("\n")[12]);
            
    }).catch((err)=> {
        response.send({
            success: true,
            message: "Archivo subido",
            error: err
        });
    });
};

app.listen(app.get("port"), ()=> {
    console.log("Servidor funcionando en el puerto 3000");
});
