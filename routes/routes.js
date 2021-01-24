const router = require("express").Router();
const modulusRoute = require("./modulusRoute");
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');


//Armazenamento
const path = require("path");
const multer  = require('multer');
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

//Controladores
const UserController = require("../controllers/UserController");
const FileController = require("../controllers/FileController");

//Rotas Gerais de Usuário e Arquivo
modulusRoute(router,"Usuario", UserController)
modulusRoute(router,"Arquivo", FileController)

//Rotas Específicas 
router.post(`/inserirUsuario`, UserController.insert);
router.put(`/atualizarUsuario/:codigoUsuario`, UserController.update);

//Parte do Storage Multer
const storage = multer.diskStorage({
   destination: "uploads/",
   filename: function(req, file, cb){
      cb(null,"Arquivo-" + Date.now() + path.extname(file.originalname));
   }
});

const storageS3 = multerS3({
   s3: new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
   }),
   bucket: process.env.BUCKET_NAME,
   contentType: multerS3.AUTO_CONTENT_TYPE,
   acl: "public-read",
   key: (req, file, cb) => {  
     cb(null, "Arquivo-" + Date.now() + path.extname(file.originalname));
   },
});


const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("arquivo");

const uploadS3 = multer({
   storage: storageS3,
   limits:{fileSize: 1000000},
}).single("arquivo");

router.post(`/inserirArquivo`, uploadS3, FileController.insert);
router.put(`/atualizarArquivo/:codigoArquivo`, uploadS3, FileController.update);


router.get(`/listarArquivosPorUsuario/:codigoUsuario`, FileController.getByCodigoUsuario);
router.delete(`/excluirArquivosPorUsuario/:codigoUsuario`, FileController.deleteByCodigoUsuario);

function verifyJWT(request, response, next) {

   var token = request.headers['x-access-token'];
   if (!token) return response.status(401).json({ auth: false, message: 'No token provided.' });

   jwt.verify(token, process.env.SECRET, function (err, decoded) {
     if (err) return response.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
     request.codigoUsuario = decoded.codigoUsuario;
     next();
   });
}
router.get('/isAuthenticated', verifyJWT, (request, response, next) => {

   console.log("Está autenticado!");
   return response.status(200).json([{ codigoUsuario: `${request.codigoUsuario}`}]);
})

router.post(`/login`, UserController.login)
router.post(`/verificarEmail`, UserController.verificarEmail)
router.get(`/logout`, verifyJWT, UserController.logout)

const validation = require("../models/validacao")

router.post(`/validacao`, async(req, res)=> {
  const validate = await validation.create(req.body);
  return res.json(validate);
});

router.post(`/verificarArquivo`, FileController.verifyFileOnDb);

router.get('/vervalidacoes', async(req, res)=>{
  const validations = await validation.scan().exec();
  return res.json({validations});
});

router.post('/validacoesPorArquivo', async(req, res)=> {
  const {arquivo, tipo} = req.body;
  const validations = await validation.scan({ arquivo: { contains: `${arquivo}`}, validacao: {contains:`${tipo}`}}).exec()
  return res.json(validations.count);
});

router.get('/log/:arquivo', async(req, res) => {
  const {arquivo} = req.params;
  const validations = await validation.scan({ arquivo: { contains: `${arquivo}`}}).exec()
  res.setHeader('Content-disposition', 'attachment; filename=Log-'+ new Date().toLocaleString('pt-BR')+'.log');
  res.setHeader('Content-type', 'text/plain');
  res.charset = 'UTF-8';

  if(validations.length>0) {
    res.write("Log:"+arquivo+"\n")
    res.write("----------------------------------\n")
    res.write("Validação | Motivação | Horário\n")
    validations.map(r=> {
      const data = new Date(r.createdAt);
      res.write(r.validacao+"\t|\t"+r.motivacao+"\t|\t"+data.toLocaleString('pt-BR')+"\n")
    })
  }
  else {
    res.write("Não existem registros para o arquivo:" + arquivo);
  }
  
  res.end();
});


module.exports = router;