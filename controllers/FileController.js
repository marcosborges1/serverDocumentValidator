const database = require("../database/connection");
const baseInformation = {table:"arquivo", modulus: "Arquivo"};

class FileController {

    list(request, response) {

        database.select("*").from(`${baseInformation.table}`).then(result=> {
            response.json(result)
        }).catch(error => console.error(error));
    }
    getByCodigo(request, response) {

        const {codigoArquivo} = request.params;
        database.select("*").from(`${baseInformation.table}`).where({codigoArquivo}).then(result=> {
            response.json(result)
        }).catch(error=> console.error(error));
    }

    getByCodigoUsuario(request, response) {

        const {codigoUsuario} = request.params;
        database.select("*").from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json(result)
        }).catch(error=> console.error(error));
    }

    insert(request, response) {

        const {codigoUsuario, nome, arquivo, hash} = request.body;
        database.insert({codigoUsuario, nome, arquivo, hash}).into(`${baseInformation.table}`).then(result=> {
            response.json({message:`${baseInformation.modulus} cadastrado com sucesso!`})
        }).catch(error => console.error(error));
    }
    update(request, response) {

        const {codigoArquivo} = request.params;
        const {nome,arquivo,hash} = request.body;
        database.update({nome,arquivo,hash}).from(`${baseInformation.table}`).where({codigoArquivo}).then(usuario=> {
            response.json({message:`${baseInformation.modulus} alterado com sucesso!`})
        }).catch(error => console.error(error));
    }
    delete(request, response) {

        const {codigoArquivo} = request.params;
        database.delete().from(`${baseInformation.table}`).where({codigoArquivo}).then(result=> {
            response.json({message:`${baseInformation.modulus} excluído com sucesso!`})
        }).catch(error => console.error(error));
    }
    deleteByCodigoUsuario(request, response) {

        const {codigoUsuario} = request.params;
        database.delete().from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json({message:`${baseInformation.modulus}(s) excluído(s) com sucesso!`})
        }).catch(error => console.error(error));
    }
}

module.exports = new FileController();