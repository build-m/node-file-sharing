const form = document.querySelector("#form")
const inputFile = document.querySelector("#file")
const uploadFile = document.querySelector(".upload-file")
const uploaded = document.querySelector(".uploaded")

form.onclick = e => {
            inputFile.click();
        }

        inputFile.onchange = e => {
            // console.log(e.target.files)      
            const filename = e.target.files[0].name
             console.log(filename)
        }