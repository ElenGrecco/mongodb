/**
 * Processo principal 
 * Estudo do CRUD com o MongoDB
 */

//importação do módulo de conexão (database)
const {conectar, desconectar} = require('./database.js')

const app = async() => {
await conectar()
await desconectar()
}

console.clear()
app()