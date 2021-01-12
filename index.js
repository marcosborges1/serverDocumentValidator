const express = require("express"); // Servidor
const config = require("./config"); // Arquivo de configuração
const router = require("./routes/routes"); // Todas as rotas
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json()); //Permitir o uso de JSON
app.use(router); // Utilização das rotas
app.use(express.static('public'));


app.get("/", (request, response)=> {response.send("<h4>Servidor Funcionando...</h4>")});


app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
});


