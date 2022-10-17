const express = require('express');
const app = express();
require('./db');
const authRoutes = require('./routes/authRoutes')
app.use(express.json());
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors())
app.use(authRoutes);
app.use(cookieParser());


app.listen(5000); 


// const express = require('express');
// const multer = require('multer');

// const upload = multer({
//     storage:multer.diskStorage({
//         destination:function(req,file,cb){
//             cb(null,"uploads")
//         },
//         filename:function(req,file,cb){
//             cb(null,file.fieldname+"-"+Date.now()+".jpg");
//         }

//     })
// }).single("file_upload");

// app.post('/upload', upload, (req, res) =>{
//     res.send("file upload successfully")
//     // console.log(req.body);
    
    
// })

// admin-panel