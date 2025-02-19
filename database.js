/**
 * Módulo de conexão com o banco de dados
 * Uso de framework mongoose
 */

//importação do mongoose

const mongoose = require('mongoose')

//configuração do banco de dados
//ip/link do servidor, autentificação, nome do banco
//ao final da url definir um banco de dados
//exemplo: /dbclientes
const url = 'mongodb+srv://admin:123Senac@cluster0.qwga8.mongodb.net/dbclientes'


//validação (evitar a abertura de várias conexões)
let conectado = false

//método ou função para conectar
const conectar = async () => {
    //Se não estiver conectado 
    if(!conectado) {
        try {
            await mongoose.connect(url) // conectar
            conectado = true //setar a variavel
            console.log("MongoDB Conectado")
        } catch (error) {
            console.error(error)
        }
    }
}

//método ou função para desconectar
const desconectar = async () => {
    //se estiver conectado
    if(conectado) {
        //desconectar
        try {
            await mongoose.disconnect(url) //desconectar
            conectado = false 
            console.log("MongoDB desconectado")
        } catch (error) {
            console.error(error)
        }
    }
}

//exportar para o main os métodos conectar e desconectar
module.exports = {conectar, desconectar}