const database = require("../database/connection");
const baseInformation = {table:"usuario", modulus: "Usuário"};

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
}

module.exports = new UserController();