const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

var formidable = require("formidable");
let date=Date.now();
app.put('/api/upload', (req, res, next) => {
    
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
  
        var oldPath = files.profilePic.path;
        var newPath = path.join(__dirname, 'uploads')
                + '/'+files.profilePic.name
        var rawData = fs.readFileSync(oldPath);
        var file_size=fs.statSync(oldPath);
        console.log(file_size.size);
        let check=file_size.size>(1024*1024);
      

          let p=path.extname(newPath)
          


       if (check )  {
            res.status(200).json({message:"Size is greater then 1 Mb.."})
           
            
          }
       
        else if (p==".jpg" || p==".png"){
         
        fs.writeFile(newPath, rawData, function(err){
            if(err) {console.log(err)}
            else{
                
            return res.json({id:date})
            }
        })
        fs.rename(newPath, `./uploads/image_${date}.jpg`, function (err) {
            if (err) throw err;
            console.log('File Renamed!');
          });

        }
        
        else {
          res.status(200).json({message:"Please enter format in jpg or png"})


        }

  })
});

app.delete("/api/:id",(req,res)=>{


  fs.unlink(`./uploads/image_${req.params.id}.jpg`, function (err) {
    if (err){
       throw err;
    }
    else{
      
      res.json({message: `Deleted item id : ${req.params.id}`});
    }
      

  });
 
})

app.post("/api/rename",(req,res)=>{

  fs.rename(`./uploads/image_${req.body.id}.jpg`, `./uploads/${req.body.name}_${req.body.id}.jpg`, function (err) {
    if (err){
       throw err;
    }
    else{
    res.json({message:`file image_${req.body.id} is rename as ${req.body.name}`});
    }
  });

});

   

app.listen(2222, () => {
  console.log("run on port 2222");
});