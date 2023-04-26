const mongoose = require('mongoose');

const File = new mongoose.Schema({
    path:{
        type: String,
        required: true
    },
    originalName:{
        type: String,
        required: true
    },
    password: String,
    downloadCount:{
        type: Number,
        required:true,
        default:0
    }
})

module.exports = mongoose.model("files", File) 
// "File" is the name of the table, & the second File is the name of schema,name of the table should be lowercase and plural
//in the .env db url, fileshare is db name & automatically created during execution