const express= require('express');
const cors= require('cors');
const mongoose= require('mongoose');
const server = express();
const multer  = require('multer');
require('dotenv').config();

// const upload = multer({dest:'./resume'})
server.use("/resume",express.static("resume"))
const PORT = process.env.PORT || 8080


server.use(cors());
server.use(express.json());


const passcode = process.env.BACKEND_PASSWORD
const username = process.env.BACKEND_USERNAME


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://${username}:${passcode}@minidb.fj06imn.mongodb.net/?retryWrites=true&w=majority`);
  console.log('db connected');
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './resume')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,  uniqueSuffix+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })





const InterViewProConnect_backend = new mongoose.Schema({
    name: String,
    email:String,
    instituteName:String,
    linkedinProfile:String,
    domain:String,
    resume:String
}, { collection: 'IVPCollection_User' });

const IVPC_MODEL_User = mongoose.model('IVPCollection_User', InterViewProConnect_backend);



const InterViewProConnect_backend_Interviewer = new mongoose.Schema({
    name: String,
    email:String,
    domain:String,
    experience:Number,
    linkedinProfile:String
}, { collection: 'IVPCollection_Interviewer' });

const IVPC_MODEL_Interviewer = mongoose.model('IVPCollection_Interviewer', InterViewProConnect_backend_Interviewer);



server.get('/IVPCusers', async(req,res)=>{
        const documents = await IVPC_MODEL_User.find({});
        res.json(documents)
})



server.get('/IVPCinterviewers', async(req,res)=>{
    const documents = await IVPC_MODEL_Interviewer.find({});
    res.json(documents)
})



server.get('/',(req,res)=>{
    res.send("success");
})


server.post('/PostIVPCUsers',upload.single("file"),async(req,res)=>{
    let PostIVPCUsers_Collection = new IVPC_MODEL_User();
    PostIVPCUsers_Collection.name=req.body.name;
    PostIVPCUsers_Collection.email=req.body.email;
    PostIVPCUsers_Collection.instituteName=req.body.instituteName;
    PostIVPCUsers_Collection.linkedinProfile=req.body.linkedinProfile;
    PostIVPCUsers_Collection.domain=req.body.domain;
    PostIVPCUsers_Collection.resume=req.file.filename;

    const Save_Document_user = await PostIVPCUsers_Collection.save();
    res.json(Save_Document_user);

})


server.post('/PostIVPCInterviewer',async(req,res)=>{
    let PostIVPCInterviewer_Collection = new IVPC_MODEL_User();
    PostIVPCInterviewer_Collection.name=req.body.name;
    PostIVPCInterviewer_Collection.email=req.body.email;
    PostIVPCInterviewer_Collection.domain=req.body.domain;
    PostIVPCInterviewer_Collection.experience=req.body.experience;
    PostIVPCInterviewer_Collection.linkedinProfile=req.body.linkedinProfile;

    const Save_Document_interviewer = await PostIVPCInterviewer_Collection.save();
    res.json(Save_Document_interviewer);

})








server.listen(PORT,()=>{
    console.log(`server is running ronak at port ${PORT} `);
});