require("dotenv").config()
const express = require('express')
const multer = require('multer'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const File = require('./models/File')
const app = express() 
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/assets'));
app.use('/assets', express.static('assets'))

const upload = multer({dest: "uploads"})

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://godolyas123:fileshare12@cluster0.pvi9gro.mongodb.net/?retryWrites=true&w=majority")

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

  const file = await File.create(fileData)
  res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}`}) //grab url that caused the request
})


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
 

app.listen(3000 || 5000) 
