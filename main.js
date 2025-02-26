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

// CRUD Update - Função para alterar os dados de um cliente
// ATENÇÃO !!! Obrigatóriamente o update precisa ser feito
// com base no ID do cliente
const atualizarCliente = async (id, nomeCli, foneCli, cpfCli) => {
    try {
        const cliente = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            },
            {
                new: true,
                runValidators: true
            }
        )
        //validação (retorno do banco)
        if (!cliente) {
            console.log("Cliente não encontrado")
        } else {
            console.log("Dados do cliente alterados com sucesso")
        }
    } catch (error) {
        console.log(error)
    }
}

//CRUD Delete - Função para excluir um cliente
//Atenção!!! Obrigatóriamente a exclusão é feita pelo ID
const deletarCliente = async (id) => {
    try {
        //a linha abaixo exclui o cliente do banco de dados
        const cliente = await clienteModel.findByIdAndUpdate(id)
        //validação
        if (!cliente) {
            console.log("Cliente não encontrado")
        } else {
            console.log("Cliente Deletado")
        }
    } catch (error) {
        console.log(error)
    }
}




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
    await listarClientes()

    //CRUD - Read (Exemplo 2- buscar clientes)
    //await buscarCliente("Breno Henrique")
    // CRUD - Update
    //await atualizarCliente('67b904ff8559c8f2934bcf57', 'Breno Henrique Junior', '(11)99999-8888', '000.111.222-33')
    //await buscarCliente("Breno Henrique")

    //CRUD Delete
    await deletarCliente('67b904ff8559c8f2934bcf55')
    await listarClientes()
    await desconectar()
        

}


console.clear()
app()