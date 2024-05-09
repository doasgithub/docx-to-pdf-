const express = require('express')
const multer  = require('multer')
var docxConverter = require('docx-pdf');
const path = require('path');

const app = express()
const port = 3001

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
    
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  app.post('/convertfile', upload.single('file'), (req, res, next) => {
   
    try {
        
        if(!req.file){
            return res.status(400).json({
                message: "please upload a file"
            })
        }
        let outputpath = path.join(__dirname,"files",`${req.file.originalname}.pdf`)
        docxConverter(req.file.path, outputpath,(err,result) => {
            if(err){
              console.log(err);
              return res.status(500).json({
                message: "error in converting world to pdf"
              })
            }
            res.download(outputpath,()=>{
                console.log("file downloaded");
            })
          });

    } catch (error) {
       console.log(error);
       return res.status(500).json({
        message : "internal server error"
       })
    }
  })
  app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})