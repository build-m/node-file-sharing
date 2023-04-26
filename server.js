require("dotenv").config()
const express = require('express')
const multer = require('multer'); // file upload middleware
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const File = require('./models/File')
const app = express() 
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/assets'));//style for index.ejs
app.use('/assets', express.static('assets'))////style for passdown.ejs

const upload = multer({dest: "uploads"})

mongoose.set('strictQuery', true);// to avoid depreciation warning
mongoose.connect(process.env.DATABASE_URL)

//db connection check-up
const conn = mongoose.connection;
conn.on('connected', () => {
    console.log('database is connected successfully');
});

conn.on('disconnected', () =>{
    console.log('database is disconnected');
})


app.set("view engine", "ejs")

app.get("/" , (req,res) =>{
  res.render("index")
})

app.post("/upload" , upload.single("file") , async (req,res) =>{
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname
  }

  if(req.body.password != null && req.body.password !== ""){
    fileData.password = await bcrypt.hash(req.body.password,10)
  }

  //create() method of the Mongoose API (below) is used to create single or many documents in the collection. Mongoose by default triggers save() internally when we use the create() method on any model.
  const file = await File.create(fileData)
  res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}`}) //grab url that caused the request
})

// app.get("/file/:id", async (req, res) =>{
//     //res.send(req.params.id)
//     const file = await File.findById(req.params.id)


//     if (file.password != null) {
//     if (req.body.password == null) {
//       res.render("passdown")
//       return
//     }

//     if (!(await bcrypt.compare(req.body.password, file.password))) {
//       res.render("passdown", { error: true })
//       return
//     }
//   }


//     file.downloadCount++ 
//     await file.save()
//     console.log(file.downloadCount)
//     //console.log(file.path)
//     //console.log(file.originalName)
//     res.download(file.path, file.originalName, (error) =>{
//           console.log("Error : ", error)
//     })
// })


//app.get("/file/:id", handleDownload)
//app.post("/file/:id", handleDownload)
//the above code(get & post) can be shortened as the following:

app.route("/file/:id").get(handleDownload).post(handleDownload)

// get-post handler
async function handleDownload(req, res) {
  const file = await File.findById(req.params.id)

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("passdown")
      return
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("passdown", { error: true })
      return
    }
  }

  file.downloadCount++
  await file.save()
  console.log("Downloaded")
  console.log(file.downloadCount)

   res.download(file.path, file.originalName, (error) =>{
          console.log("Error : ", error)
    })
}
 

app.listen(process.env.PORT) 