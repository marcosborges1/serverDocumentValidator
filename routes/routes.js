const router = require("express").Router();
const modulusRoute = require("./modulusRoute");
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

//Armazenamento
const path = require("path");
const multer  = require('multer')

// //Auht
// const passport = require("passport");
// const session = require("express-session");

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
const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("arquivo");

router.post(`/inserirArquivo`, upload, FileController.insert);
router.put(`/atualizarArquivo/:codigoArquivo`, upload, FileController.update);


router.get(`/listarArquivosPorUsuario/:codigoUsuario`, FileController.getByCodigoUsuario);
router.delete(`/excluirArquivosPorUsuario/:codigoUsuario`, FileController.deleteByCodigoUsuario);



// require("../auth")(passport)
// router.use(session({
//    secret: '123',
//    resave:false,
//    saveUninitialized:false,
//    cookie: {
//       maxAge: 2 * 60 * 1000
//    }
// }));
// router.use(passport.initialize());
// router.use(passport.session());

// router.get(`/login`, (req,res)=> {
//    if(req.isAuthenticated()) { 
//       console.log(req.session.passport.user);
//       console.log("autenticado!")
//    }
//    else {
//       console.log("não autenticado!")
//    }
//    return res.send(req.query.result)
// })
// router.post(`/login`, passport.authenticate('local', {
//    successRedirect:"/login?result=true",
//    failureRedirect:"/login?result=false"
// }))

// function authenticationMiddleware(req, res, next) {
//   if (req.isAuthenticated()) return next();
//    res.redirect('/login?fail=true');
// }
// router.get(`/isAuthenticated`, (req,res)=> {
//    if (req.isAuthenticated()) {
//       return res.send(true);
//    }
//    return res.send(false);

// })

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
router.get(`/logout`, verifyJWT, UserController.logout)


module.exports = router;