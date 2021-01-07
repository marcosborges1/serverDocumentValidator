const router = require("express").Router();
const modulusRoute = require("./modulusRoute");

//Controladores
const UserController = require("../controllers/UserController");
const FileController = require("../controllers/FileController");

//Rotas Gerais de Usuário e Arquivo
modulusRoute(router,"Usuario", UserController)
modulusRoute(router,"Arquivo", FileController)

//Rotas Específicas 
router.get(`/listarArquivosPorUsuario/:codigoUsuario`, FileController.getByCodigoUsuario);
router.delete(`/excluirArquivosPorUsuario/:codigoUsuario`, FileController.deleteByCodigoUsuario);

module.exports = router;