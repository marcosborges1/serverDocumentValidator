const router = require("express").Router();
const modulusRoute = require("./modulusRoute");
require("dotenv-safe").config();

//Armazenamento
const path = require("path");
const multer  = require('multer');
// const aws = require("aws-sdk");
// const multerS3 = require("multer-s3");

//Controladores
const UserController = require("../controllers/UserController");
const FileController = require("../controllers/FileController");
const PhoneController = require("../controllers/PhoneController");

//Rotas Gerais de Usuário e Arquivo
modulusRoute(router,"Usuario", UserController)
modulusRoute(router,"Arquivo", FileController)

/*USUARIOS*/
//Rotas Específicas 
router.post(`/inserirUsuario`, UserController.insert);
router.put(`/atualizarUsuario/:codigoUsuario`, UserController.update);

const jwt = require('jsonwebtoken');
function verifyJWT(request, response, next) {

  var token = request.headers['x-access-token'];
  if (!token) return response.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return response.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
    request.codigoUsuario = decoded.codigoUsuario;
    next();
  });
}
router.get('/obterUsuarioComTelefones/:codigoUsuario', UserController.getByCodigoWithPhones);
router.get('/isAuthenticated', verifyJWT, (request, response, next) => {

  console.log("Está autenticado!");
  return response.status(200).json([{ codigoUsuario: `${request.codigoUsuario}`}]);
})

router.post(`/login`, UserController.login)
router.post(`/verificarEmail`, UserController.verificarEmail)
router.get(`/logout`, verifyJWT, UserController.logout)

/*End-USUARIOS*/

/*ARQUIVOS*/

//Local

const localStorage = multer.diskStorage({
   destination: "uploads/",
   filename: function(req, file, cb){
      cb(null,"Arquivo-" + Date.now() + path.extname(file.originalname));
   }
});
const localUpload = multer({
  storage: localStorage,
  limits:{fileSize: 1500000},
}).single("arquivo");

//End - Local

//Amazon S3

// const storageS3 = multerS3({
//    s3: new aws.S3({
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//    }),
//    bucket: process.env.BUCKET_NAME,
//    contentType: multerS3.AUTO_CONTENT_TYPE,
//    acl: "public-read",
//    key: (req, file, cb) => {  
//      cb(null, "Arquivo-" + Date.now() + path.extname(file.originalname));
//    },
// });
// const uploadS3 = multer({
//   storage: storageS3,
//   limits:{fileSize: 1000000},
// }).single("arquivo");

//End - Amazon S3

//GAE


const multerGoogleStorage = require("multer-cloud-storage");
const uploadGAE = multer({
  storage: multerGoogleStorage.storageEngine(
    {
      keyFilename:"./keys.json",
      filename: function(req, file, cb){
        cb(null,`Arquivo-` + Date.now() + path.extname(file.originalname));
      }
    }
  )
}).single("arquivo");

//End - GAE

// router.post('/inserirArquivo', uploadGAE, FileController.insert);
router.post('/inserirArquivo', localUpload, FileController.insert);

router.put(`/atualizarArquivo/:codigoArquivo`, localUpload, FileController.update);

router.get(`/listarArquivosPorUsuario/:codigoUsuario`, FileController.getByCodigoUsuario);
router.delete(`/excluirArquivosPorUsuario/:codigoUsuario`, FileController.deleteByCodigoUsuario);

const validation = require("../models/validacao");

router.post(`/validacao`, async(req, res)=> {

  await new validation(req.body).save().then((entity) => {
      return res.json(entity.entityData);
  })
});

router.post(`/verificarArquivo`, FileController.verifyFileOnDb);

router.post(`/verificarArquivoParaValidacao`, localUpload, FileController.verifyFileOnDbToValidation);

router.get('/vervalidacoes', async(req, res)=> {
  const validations = await validation.query().run().then(result=>result)
  return res.json({validations});
});

router.get('/deletarValidacaoPorArquivo/:arquivo', async(req, res)=> {
  const {arquivo} = req.params;
  const validations = await validation.query().run().then(result=>result);
  const resultValidation = validations.entities.filter(r=>r.arquivo==arquivo);
  if(resultValidation && resultValidation.length>0) {
    resultValidation.map(r=> {
      validation.delete(+r.id)
        .then((response) => {
            res.json(response);
        })
        .catch(err => res.status(400).json("erro"+ err));
    })
  }

});

router.post('/validacoesPorArquivo', async(req, res)=> {
  const {arquivo, tipo} = req.body;
  let countP = 0
  let countN = 0
  const validations = await validation.query().run().then(result=>result)
  validations.entities.map(result=> {
    if(result.arquivo==arquivo && result.validacao=='positivo') {
      countP++;
    }
    if(result.arquivo==arquivo && result.validacao=='negativo') {
      countN++;
    }
  })
  return res.json({countP,countN});
});

router.get('/log/:arquivo', async(req, res) => {
  const {arquivo} = req.params;
  const validations = await validation.query().run().then(result=>result);
  const resultValidation = validations.entities.filter(r=>r.arquivo==arquivo)
  
  // const validations = await validation.scan({ arquivo: { contains: `${arquivo}`}}).exec()
  res.setHeader('Content-disposition', 'attachment; filename=Log-'+ new Date().toLocaleString('pt-BR',{ timeZone: 'America/Sao_Paulo' })+'.log');
  res.setHeader('Content-type', 'text/plain');
  res.charset = 'UTF-8';

  if(resultValidation && resultValidation.length>0) {
  
    res.write("Log:"+arquivo+"\n")
    res.write("----------------------------------\n")
    res.write("Validação | Motivação | Horário\n")
    resultValidation.map(r=> {
      const data = new Date(r.createdAt);
      res.write(r.validacao+"\t|\t"+r.motivacao+"\t|\t"+data.toLocaleString('pt-BR',{ timeZone: 'America/Sao_Paulo' })+"\n")
    })
  }
  else {
    res.write("Não existem registros para o arquivo:" + arquivo);
  }
  res.end();
});

/*TELEFONE*/
router.post(`/inserirTelefones`, PhoneController.insert);
router.get(`/listarTelefonesPorUsuario/:codigoUsuario`, PhoneController.getByCodigoUsuario);
router.delete(`/excluirTelefonesPorUsuario/:codigoUsuario`, PhoneController.deleteByCodigoUsuario);
/*End-TELEFONE*/

module.exports = router;