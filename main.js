/**
 * Processo principal 
 * Estudo do CRUD com o MongoDB
 */

//importação do módulo de conexão (database)
const { conectar, desconectar } = require('./database.js')

//importação do moedelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )

        //a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso ")
    } catch (error) {
        //tratamento de exceções esécíficas
        if (error.code == 11000) {
            console.log(`Erro: o CPF ${cpfCli} já cadastrado. `)

        } else {
            console.log(error)
        }
    }
}

//CRUD Read- Função para listar todos os clientes cadastrados
const listarClientes = async () => {
    try {
        //a linha abaixo lista todos os clientes cadastrados por ordem alfabética
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)

    }

}

//CRUD Read - Função para buscar um cliente específico
const buscarCliente = async (nome) => {
    try {
        //find() buscar
        //nomeCliente: new RegExp(nome) filtro pelo nome (pates que contenham (expressão regular))
        //'i' insensitive (ignorar letras maiúsculas ou minuscúlas)
        const cliente = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }
        )

        //calcular as similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        //validação (se não existir o cliente)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado. ")

        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)
            //cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            //formatação da data
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpf: melhorCliente.cpf,
                dataCadastro: melhorCliente.dataCadastro.toLocaleString('pt-br')
            }
            console.log(clienteFormatado)
        }

    } catch (error) {
        console.log(error)

    }
}

//===========================================================================================================



//execução da aplicação
const app = async () => {
    await conectar()
    //CRUD - Create
    //await criarCliente("Gustavo Nunes", "99999-0000", "12345678900")
    //await criarCliente("Bruno Henrique", "92424-2424", "12345678901")
    //await criarCliente("Breno Henrique", "92424-2425", "12345678903")
    //await criarCliente("Gabriel Coutinho", "91111-1111", "12345678902")
    //await criarCliente("João Coutinho", "91111-1112", "12345678904")
    //await criarCliente("Jose Coutinho", "91111-1113", "12345678905")

    //CRUD - Read (Exemplo 1- listar todos os clientes)
    //await listarClientes()

    //CRUD - Read (Exemplo 2- buscar clientes)
    await buscarCliente("Breno H")
    await desconectar()

}


console.clear()
app()