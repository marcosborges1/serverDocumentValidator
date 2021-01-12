const router = require("express").Router();
const modulusRoute = require("./modulusRoute");


//Armazenamento
const path = require("path");
const multer  = require('multer')

//Controladores
const UserController = require("../controllers/UserController");
const FileController = require("../controllers/FileController");

//Rotas Gerais de Usuário e Arquivo
modulusRoute(router,"Usuario", UserController)
modulusRoute(router,"Arquivo", FileController)

//Rotas Específicas 
router.post(`/inserirUsuario`, UserController.insert);
router.put(`/atualizarUsuario/:codigoUsuario`, UserController.update);
// router.post(`/inserirArquivo`, FileController.insert);
// router.post('/inserirArquivo', upload.single("arquivo"), (req, res) => console.log(`${req.body.arquivo}<h2>Upload realizado com sucesso</h2>`));  



// router.post('/inserirArquivo', upload.single('arquivo'), function (req, res, next) {
//   // req.file is the `avatar` file
//   console.log(req.body);
//   // req.body will hold the text fields, if there were any
// })


// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
   destination: "uploads/",
   filename: function(req, file, cb){
      cb(null,"Arquivo-" + Date.now() + path.extname(file.originalname));
   }
});
const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("arquivo");

router.post(`/inserirArquivo`, upload, FileController.insert);
router.put(`/atualizarArquivo/:codigoArquivo`, upload, FileController.update);


router.get(`/listarArquivosPorUsuario/:codigoUsuario`, FileController.getByCodigoUsuario);
router.delete(`/excluirArquivosPorUsuario/:codigoUsuario`, FileController.deleteByCodigoUsuario);

module.exports = router;