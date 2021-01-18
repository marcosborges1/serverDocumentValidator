const database = require("../database/connection");
const baseInformation = {table:"usuario", modulus: "Usuário"};
const jwt = require('jsonwebtoken');

class UserController {

    list(request, response) {

        database.select("*").from(`${baseInformation.table}`).then(result=> {
            response.json(result)
        }).catch(error => console.error(error));
    }
    getByCodigo(request, response) {

        const {codigoUsuario} = request.params;
        database.select("*").from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json(result)
        }).catch(error=> console.error(error));
    }
    insert(request, response) {

        const {nome,identificacao, email, senha} = request.body;
        database.insert({nome,identificacao, email, senha}).into(`${baseInformation.table}`).then(result=> {
            response.json({message:`${baseInformation.modulus} cadastrado com sucesso!`})
        }).catch(error => console.error(error));
    }
    update(request, response) {

        const {codigoUsuario} = request.params;
        const {nome,identificacao, email, senha } = request.body;
        database.update({nome,identificacao, email, senha}).from(`${baseInformation.table}`).where({codigoUsuario}).then(usuario=> {
            response.json({message:`${baseInformation.modulus} alterado com sucesso!`})
        }).catch(error => console.error(error));
    }
    delete(request, response) {

        const {codigoUsuario} = request.params;
        database.delete().from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json({message:`${baseInformation.modulus} excluído com sucesso!`})
        }).catch(error => console.error(error));
    }
    async login(request, response) {
        const {email, senha} = request.body;

        const result = await database.select("*").from(`${baseInformation.table}`).where({email:email, senha:senha}).then(result=> 
            result[0]
        ).catch(error=> console.error(error));

        if(result) {
            const {codigoUsuario} = result
            const token = jwt.sign({ codigoUsuario }, process.env.SECRET, {
              expiresIn: "1d" // expires in 5min
            });
            return response.send({ auth: true, token: token });
        }

        response.status(401).json({ message: 'Login inválido!' });
        // if(request.query.fail)
        //     response.render('login', {message: "Usuario ou senha errados"})
        // else 
        //     response.render('login', {message:null})
    }
    async logout(request, response) {
        console.log("Esta passando");
        return response.send({ auth: false, token: null });
    }

}

module.exports = new UserController();