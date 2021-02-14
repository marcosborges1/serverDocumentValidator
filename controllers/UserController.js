const database = require("../database/connection");
const baseInformation = {table:"usuario", modulus: "Usuário"};
const jwt = require('jsonwebtoken');
const FileController = require("./FileController");
const PhoneController = require("./PhoneController");

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
    getByCodigoWithPhones(request, response) {

        const {codigoUsuario} = request.params;
        database.select("*").from(`${baseInformation.table}`).where({codigoUsuario}).then(async(result)=> {
            await PhoneController.getByCodigoUsuario(request, response).then(res=> console.log(res))
            response.json(result)
        }).catch(error=> console.error(error));
    }
    insert(request, response) {

        const {nome,apelido, email, senha, tipo} = request.body;
        database.insert({nome,apelido, email, senha, tipo}).into(`${baseInformation.table}`).then(result=> {
            response.json({
                codigoUsuario:result[0],
                message:`${baseInformation.modulus} cadastrado com sucesso!`
            })
        }).catch(error=> console.error(error));
    }
    update(request, response) {

        const {codigoUsuario} = request.params;
        const {nome,apelido, email, senha, tipo } = request.body;
        database.update({nome,apelido, email, senha, tipo}).from(`${baseInformation.table}`).where({codigoUsuario}).then(usuario=> {
            response.json({message:`${baseInformation.modulus} alterado com sucesso!`})
        }).catch(error => console.error(error));
    }
    async delete(request, response) {

        const {codigoUsuario} = request.params;

        //Apagar arquivos do S3
        FileController.deleFilesS3ByUser(codigoUsuario);

        //Apagar o usuário. Observação: já tem as restrições de cascata (on update, on delete)
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

        return response.send({ auth: false });
    }
    async verificarEmail(request, response) {
        const {email} = request.body;

        const result = await database.select("*").from(`${baseInformation.table}`).where({email:email}).then(result=> {
            return result[0];
        }).catch(error=> console.error(error));

        if(result) { 
            return response.json({ exist: true }); 
        }
        else {
            response.json({ exist: false });
        }
    }
    async logout(request, response) {
        console.log("Esta passando");
        return response.send({ auth: false, token: null });
    }

}

module.exports = new UserController();