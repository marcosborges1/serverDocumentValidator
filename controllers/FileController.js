const database = require("../database/connection");
const baseInformation = {table:"arquivo", modulus: "Arquivo"};
const Crypto = require("../utils/Crypto");
const crypto = require("crypto");
const fs = require('fs');
const validation = require("../models/validacao");
const path = require("path")

const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';
// const aws = require("aws-sdk");
// const s3 = new aws.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

const getRawBody = require('raw-body')

const {Storage} = require('@google-cloud/storage');
const gcobj = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.GCS_KEYFILE
});
const gcsBucket = gcobj.bucket(process.env.GCS_BUCKET);

class FileController {

    list(request, response) {

        database.select("codigoArquivo","codigoUsuario","nome","arquivo","cripto","url").from(`${baseInformation.table}`).then(result=> {
            response.json(result)
        }).catch(error => console.error(error));
    }
    getByCodigo(request, response) {

        const {codigoArquivo} = request.params;
        database.select("codigoArquivo","codigoUsuario","nome","arquivo","cripto","url").from(`${baseInformation.table}`).where({codigoArquivo}).then(result=> {
            response.json(result)
        }).catch(error=> console.error(error));
    }

    getByCodigoUsuario(request, response) {

        const {codigoUsuario} = request.params;
        database.select("codigoArquivo","codigoUsuario","nome","arquivo","cripto","url").from(`${baseInformation.table}`).where({codigoUsuario}).then(result=> {
            response.json(result)
        }).catch(error=> console.error(error));
    }

    async insert(request, response) {
        
       const {codigoUsuario, nome} = request.body;
       //Local
       // const arquivo = request.file.filename;
       //Nuvem AWS
       // const arquivo = request.file.key;
       // const url = request.file.location;

       //Nuvel GAE
        //console.log(request.file);

        // console.log(request.file);

        const arquivo = request.file.filename;

        // const dir = path.resolve(__dirname, "../");
        // const tmpFolder = path.resolve(dir, request.file.path);  

        // const content = await fs.promises.readFile(tmpFolder);
        // console.log(content);
        // const ByteToStringMD5Hash = Buffer.from(content).toString('utf8');
        // console.log(ByteToStringMD5Hash);
        // gcsBucket.upload(tmpFolder, function(err, file, apiResponse) {
        //     if(err) {
        //         console.log("Erro no upload!");
        //     }
        //     if(file) {
        //         console.log("Upload feito com sucesso!");
        //     }
            
        // })
        
        
        
        // let cipher = crypto.createCipher(algorithm,password);
        // const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
        

        // let cipher = crypto.createCipher(algorithm,password);
        // const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
        // const url = `https://storage.googleapis.com/document-validator-ufc-server/${arquivo}`;
        // let url = request.file.linkUrl;
        // url = url.replace("cloud.google","googleapis");
       
    //    const requ = require('request');

    //    const fileContent = await requ(url).pipe(fs.createWriteStream(arquivo))
    //    await sleep(1000) 
    //    const tmpFolder = path.resolve(__dirname, "../");
    //    const tmpFolder1 = path.resolve(tmpFolder, fileContent.path);  
    //    await sleep(1000)
       
        // const content = await fs.promises.readFile(tmpFolder1);
        // const ByteToStringMD5Hash = Buffer.from(content).toString('utf8');
        
       
    
    //Cifra
        const file = await gcsBucket.file(arquivo).createReadStream();
        const buffer = await getRawBody(file); 
        const ByteToStringMD5Hash = Buffer.from(buffer).toString('utf8');

        let cipher = crypto.createCipher(algorithm,password);
        const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
        const url = request.file.linkUrl.replace("cloud.google","googleapis");
       
        //Salvar no Banco
        const cripto = Crypto.encrypt(arquivo);
        database.insert({codigoUsuario, nome, arquivo, cripto, url, hash}).into(`${baseInformation.table}`).then(result=> {
            response.json({message:`${baseInformation.modulus} cadastrado com sucesso!`})
        }).catch(error => console.error(error));
    }
    async update(request, response) {

        let values = null;
        const {nome, arquivoAtual} = request.body;
        const {codigoArquivo} = request.params;

        if(request.file) {
            const validations = await validation.query().run().then(result=>result);
            const arquivo = request.file.filename;

            // const dir = path.resolve(__dirname, "../");
            // const tmpFolder = path.resolve(dir, request.file.path);  

            // const content = await fs.promises.readFile(tmpFolder);
            // const ByteToStringMD5Hash = Buffer.from(content).toString('utf8');

            // gcsBucket.upload(tmpFolder, function(err, file, apiResponse) {
            //     console.log("Upload feito com sucesso!");
            // })
            
            // const cripto = Crypto.encrypt(arquivo);
            // let cipher = crypto.createCipher(algorithm,password);
            // const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
            // const url = `https://storage.googleapis.com/document-validator-ufc-server/${arquivo}`;

            // const requ = require('request');

            // const fileContent = await requ(url).pipe(fs.createWriteStream(arquivo))
            // await sleep(1000) 
            // const tmpFolder = path.resolve(__dirname, "../");
            // const tmpFolder1 = path.resolve(tmpFolder, fileContent.path);  
            // await sleep(1000)
            
            // const content = await fs.promises.readFile(tmpFolder1);
            // const ByteToStringMD5Hash = Buffer.from(content).toString('utf8');
            
           

            //S3
            // const params = {
            //     Bucket: process.env.BUCKET_NAME,
            //     Key: arquivoAtual
            // };
            // const resultado = await s3.deleteObject(params, function(err, data) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     else {
            //         console.log(`Arquivo apagado com sucesso.`);
            //     }
            // });

            const cripto = Crypto.encrypt(arquivo);
            const file = await gcsBucket.file(arquivo).createReadStream();
            const buffer = await getRawBody(file); 
            const ByteToStringMD5Hash = Buffer.from(buffer).toString('utf8');

            let cipher = crypto.createCipher(algorithm,password);
            const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
            const url = request.file.linkUrl.replace("cloud.google","googleapis");

            //Remover Arquivo
            gcsBucket.file(arquivoAtual).delete();
            const resultValidation = validations.entities.filter(r=>r.arquivo==arquivoAtual);
            if(resultValidation && resultValidation.length>0) {
                resultValidation.map(r=> {
                validation.delete(+r.id)
                    .then((result) => {
                        console.log(result);
                    })
                    .catch(err => console.log("erro"+ err));
                })
            }

            database.update({nome:nome,arquivo:arquivo,cripto:cripto,url:url, hash:hash}).from(`${baseInformation.table}`).where({codigoArquivo}).then(usuario=> {
                response.json({message:`${baseInformation.modulus} alterado com sucesso!`})
            }).catch(error => console.error(error));

            // fs.unlink(`uploads/${request.body.arquivoAtual}`, (err) => {
            //   if (err) {
            //     console.error(err)
            //     return
            //   }
            //   console.log("Arquivo removido com sucesso!")
            // })

        }
        else {
            database.update({nome:nome}).from(`${baseInformation.table}`).where({codigoArquivo}).then(usuario=> {
                response.json({message:`${baseInformation.modulus} alterado com sucesso!`})
            }).catch(error => console.error(error));
        }
        
        
        // const {nome,arquivo,cripto} = request.body;
        
    }
    async delete(request, response) {

        const {codigoArquivo} = request.params;
        const validations = await validation.query().run().then(result=>result);

        //Remover Arquivo
        const result = await database.select("arquivo").from(`${baseInformation.table}`).where({codigoArquivo});
        
        //Remover S3
        // const params = {
        //     Bucket: process.env.BUCKET_NAME,
        //     Key: result[0]["arquivo"]
        // };
        // const resultado = await s3.deleteObject(params, function(err, data) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(`Arquivo apagado com sucesso.`);
        //     }
        // });
        //Remover Arquivo
        
        await gcsBucket.file(result[0]["arquivo"]).delete();

        const resultValidation = validations.entities.filter(r=>r.arquivo==result[0]["arquivo"]);
        if(resultValidation && resultValidation.length>0) {
            resultValidation.map(r=> {
            validation.delete(+r.id)
                .then((result) => {
                    console.log(result);
                })
                .catch(err => console.log("erro"+ err));
            })
        }
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

    async verifyFileOnDbToValidation(request, response) {

        if(request.file) {
            console.log("Arquivo feito upload!")
            const arquivo = request.file.filename;
            const cripto = Crypto.encrypt(arquivo);
            const file = await gcsBucket.file(arquivo).createReadStream();
            const buffer = await getRawBody(file); 
            const ByteToStringMD5Hash = Buffer.from(buffer).toString('utf8');

            let cipher = crypto.createCipher(algorithm,password);
            const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
            
            // const folderBase = path.resolve(__dirname, "../");
            // const tempFolder = path.resolve(folderBase, request.file.path);  
        
            // const content = await fs.promises.readFile(tempFolder);
            // const ByteToStringMD5Hash = Buffer.from(content).toString('utf8');
            
            // let cipher = crypto.createCipher(algorithm,password);
            // const hash = cipher.update(ByteToStringMD5Hash,'utf8','hex');
            database.select("arquivo","cripto","hash").from(`${baseInformation.table}`).where({hash}).then(result=> {
                response.json(result)
             }).catch(error => console.error(error));
    
        }
        
    }


    async deleFilesS3ByUser(codigoUsuario) {
        const results = await database.select("arquivo").from(`${baseInformation.table}`).where({codigoUsuario:codigoUsuario});
        const validations = await validation.query().run().then(result=>result);

        if(results.length>0) {
            let keys = []
            results.map(d => {
                gcsBucket.file(d.arquivo).delete();
                // keys.push({Key:d.arquivo})
                const resultValidation = validations.entities.filter(r=>r.arquivo==d.arquivo);
                if(resultValidation && resultValidation.length>0) {
                    resultValidation.map(r=> {
                    validation.delete(+r.id)
                        .then((result) => {
                            console.log(result);
                        })
                        .catch(err => console.log("erro"+ err));
                    })
                }
            });

            // const params = {
            //   Bucket: process.env.BUCKET_NAME,
            //   Delete: { // required
            //     Objects: keys
            //   }
            // }
            // const resultado = await s3.deleteObjects(params, function(err, data) {
            //   if (err) console.log(err, err.stack); // an error occurred
            //   else     console.log("Arquivos deletados com sucesso!");           // successful response
            // });
            // return resultado;
        }
        return true

    }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = new FileController();