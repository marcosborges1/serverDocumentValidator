const database = require("../database/connection");
const baseInformation = {table:"arquivo", modulus: "Arquivo"};
const Crypto = require("../utils/Crypto")
const fs = require('fs')

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

       const {codigoUsuario, nome} = request.body;
       const arquivo = request.file.filename;
       const cripto = Crypto.encrypt(arquivo);
        database.insert({codigoUsuario, nome, arquivo, cripto}).into(`${baseInformation.table}`).then(result=> {
            response.json({message:`${baseInformation.modulus} cadastrado com sucesso!`})
        }).catch(error => console.error(error));
    }
    update(request, response) {

        let values = null;
        const {nome} = request.body;

        if(request.file) {
            const arquivo = request.file.filename;
            const cripto = Crypto.encrypt(arquivo);
            values = {nome,arquivo,cripto}

            //Remover Arquivo
            fs.unlink(`uploads/${request.body.arquivoAtual}`, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log("Arquivo removido com sucesso!")
            })

        }
        else {
            values = {nome}
        }
        
        const {codigoArquivo} = request.params;
        // const {nome,arquivo,cripto} = request.body;
        database.update(values).from(`${baseInformation.table}`).where({codigoArquivo}).then(usuario=> {
            response.json({message:`${baseInformation.modulus} alterado com sucesso!`})
        }).catch(error => console.error(error));
    }
    delete(request, response) {

        const {codigoArquivo} = request.params;

        //Remover Arquivo
        database.select("arquivo").from(`${baseInformation.table}`).where({codigoArquivo}).then(result=> 
            fs.unlink(`uploads/${result[0]["arquivo"]}`, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log("Arquivo removido com sucesso!")
            })
        ).catch(error=> console.error(error));
        // Apagar Arquivo banco
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