// import { Request, Response, NextFunction } from "express";
// import { verify } from "jsonwebtoken";

// import authConfig from "@config/auth";

// import AppError from "@shared/errors/AppError";

// interface ITokenPayload {
//   iat: number;
//   ext: number;
//   sub: string;
// }

// export default function auth(
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ): void {
//   const authHeader = request.headers.authorization;

//   if (!authHeader) {
//     throw new AppError("JWT token is missing", 401);
//   }

//   const [, token] = authHeader.split(" ");

//   try {
//     const decoded = verify(token, authConfig.jwt.secret);

//     const { sub } = decoded as ITokenPayload;

//     request.user = {
//       id: sub,
//     };

//     return next();
//   } catch (err) {
//     throw new AppError("Invalid JWT token", 401);
//   }
// }


// const bcrypt = require("bcryptjs")
// const LocalStrategy = require("passport-local").Strategy;
// const database = require("./database/connection");

// // const user = [{
// //     codigoUsuario:5,
// //     email:"borges.marcos1@gmail.com",
// //     senha: "123456"
// // }]
// let currentUser;

// module.exports = (passport) => {

//     const findUserByEmailAndSenha = async (email,senha) => {

//         const currentUser = await database.select("*").from(`usuario`).where({email:email,senha:senha}).then(result=> {
//             return result[0];
//         }).catch(error => console.error(error));

//         return currentUser;
//     }
//     const findUserByCodigoUsuario = async (codigoUsuario) => {
//         const currentUser = await database.select("*").from(`usuario`).where({codigoUsuario:codigoUsuario}).then(result=> {
//             return result[0];
//         }).catch(error => console.error(error));
//         return currentUser;
//     }

//     passport.serializeUser((user, done)=> {
//         done(null, user.codigoUsuario);
//     });
//     passport.deserializeUser((codigoUsuario,done)=> {

//         try {
//             const user = findUserByCodigoUsuario(codigoUsuario);
//             done(null, user);
//         } catch (error) {
//             console.log(console.error());
//             return done(null, error);
//         }
//     })

//     passport.use(new LocalStrategy({
//         usernameField: "email",
//         passwordField: "senha",
//     }, async (email, senha, done)=> { 
//         try {

//             const user = await findUserByEmailAndSenha(email,senha);
//             if(!user) return done(null, false);
//             // const isValid = (senha === user.senha);
//             // if(!isValid) return done(null, false);

//             return done(null, user);

//         } catch (error) {
//             console.log(error);
//             return done(err, false);
//         }
//     }));


// }