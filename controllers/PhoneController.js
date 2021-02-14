const database = require("../database/connection");
const baseInformation = {table:"telefone", modulus: "Telefone"};

class PhoneController {

    async getByCodigoUsuario(request, response) {

        const {codigoUsuario} = request.params;
        database.select('numero').from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json(result)
        }).catch(error=> console.error(error));
    }
    async insert(request, response) {

        const {telefones, codigoUsuario} = request.body;
        telefones.map(t=> {
            t.codigoUsuario = codigoUsuario;
        })
        database.insert({telefones}["telefones"]).into(`${baseInformation.table}`).then(result=> {
            response.json({message:`${baseInformation.modulus} cadastrado com sucesso!`})
        }).catch(error => console.error(error));
    }
    async deleteByCodigoUsuario(request, response) {

        const {codigoUsuario} = request.params;
        database.delete().from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            console.log(result);
            response.json(result)
        }).catch(error=> console.error(error));
    }
}

module.exports = new PhoneController();