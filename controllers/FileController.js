const database = require("../database/connection");
const baseInformation = {table:"arquivo", modulus: "Arquivo"};
const Crypto = require("../utils/Crypto")
const fs = require('fs')
const aws = require("aws-sdk");
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

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

        // console.log(request.file);
        // console.log(request.body);
       const {codigoUsuario, nome} = request.body;
       //Local
       // const arquivo = request.file.filename;
       //Nuvem
       const arquivo = request.file.key;
       const url = request.file.location;

       const cripto = Crypto.encrypt(arquivo);
        database.insert({codigoUsuario, nome, arquivo, cripto, url}).into(`${baseInformation.table}`).then(result=> {
            response.json({message:`${baseInformation.modulus} cadastrado com sucesso!`})
        }).catch(error => console.error(error));
    }
    async update(request, response) {

        let values = null;
        const {nome, arquivoAtual} = request.body;

        if(request.file) {
            const arquivo = request.file.filename;
            const cripto = Crypto.encrypt(arquivo);
            values = {nome:nome,arquivo:arquivo,cripto:cripto}

            //Remover Arquivo
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: arquivoAtual
            };
            const resultado = await s3.deleteObject(params, function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`Arquivo apagado com sucesso.`);
                }
            });

            // fs.unlink(`uploads/${request.body.arquivoAtual}`, (err) => {
            //   if (err) {
            //     console.error(err)
            //     return
            //   }
            //   console.log("Arquivo removido com sucesso!")
            // })

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
    async delete(request, response) {

        const {codigoArquivo} = request.params;

        //Remover Arquivo
        const result = await database.select("arquivo").from(`${baseInformation.table}`).where({codigoArquivo});
        
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: result[0]["arquivo"]
        };
        const resultado = await s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`Arquivo apagado com sucesso.`);
            }
        });
        // Apagar Arquivo banco
        database.delete().from(`${baseInformation.table}`).where({codigoArquivo}).then(result=> {
            response.json({message:`${baseInformation.modulus} excluído com sucesso!`})
        }).catch(error => console.error(error));

            // })
            
            // fs.unlink(`uploads/${result[0]["arquivo"]}`, (err) => {
            //   if (err) {
            //     console.error(err)
            //     return
            //   }
            //   console.log("Arquivo removido com sucesso!")
            // })
        // }).catch(error=> console.error(error));
        // Apagar Arquivo banco
        // database.delete().from(`${baseInformation.table}`).where({codigoArquivo}).then(result=> {
        //     response.json({message:`${baseInformation.modulus} excluído com sucesso!`})
        // }).catch(error => console.error(error));
    }
    deleteByCodigoUsuario(request, response) {

        const {codigoUsuario} = request.params;
        database.delete().from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json({message:`${baseInformation.modulus}(s) excluído(s) com sucesso!`})
        }).catch(error => console.error(error));
    }
    verifyFileOnDb(request, response) {

       const {arquivo} = request.body;
        database.select("arquivo","cripto").from(`${baseInformation.table}`).where({arquivo}).then(result=> {
            response.json(result)
        }).catch(error => console.error(error));
    }
    async deleFilesS3ByUser(codigoUsuario) {
        const results = await database.select("arquivo").from(`${baseInformation.table}`).where({codigoUsuario:codigoUsuario});
        
        if(results.length>0) {
            let keys = []
            results.map(d => {
                keys.push({Key:d.arquivo})
            });

            const params = {
              Bucket: process.env.BUCKET_NAME,
              Delete: { // required
                Objects: keys
              }
            }
            const resultado = await s3.deleteObjects(params, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else     console.log("Arquivos deletados com sucesso!");           // successful response
            });
            return resultado;
        }
        return true

    }
}

module.exports = new FileController();