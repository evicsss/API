import express from 'express'; // Importa o framework Express
import cors from 'cors'; // Importa o middleware CORS para permitir requisições de diferentes origens
import { PrismaClient } from '@prisma/client'; // Importa o cliente Prisma para interagir com o banco de dados


const prisma = new PrismaClient(); // Instancia um novo cliente Prisma
const app = express(); // Cria uma nova aplicação Express
app.use(express.json()); // Middleware para fazer o parse do corpo das requisições como JSON
app.use(cors()); // Habilita CORS para permitir requisições de outras origens

// Endpoint para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        // Cria um novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,  // Obtém o e-mail do corpo da requisição
                name: req.body.name, // Obtém o nome do corpo da requisição
                age: req.body.age // Obtém a idade do corpo da requisição
            }
        });
        res.status(201).json(newUser); // Retorna o usuário criado com status 201 (Criado)
    } catch (error) {
         // Retorna um erro se algo falhar
        res.status(500).json({ error: 'Erro ao criar usuário.', details: error.message });
    }
});
// Endpoint para buscar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
    // Busca usuários no banco de dados, podendo filtrar por nome e e-mai
        const users = await prisma.user.findMany({
            where: {
                ...(req.query.name && { name: req.query.name }), // Filtra por nome se fornecido
                ...(req.query.email && { email: req.query.email }) // Filtra por e-mail se fornecido
            }
        });
        res.status(200).json(users); // Retorna a lista de usuários com status 200 (OK)
    } catch (error) {
        // Retorna um erro se algo falhar
        res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
    }
});
// Endpoint para atualizar um usuário existente
app.put('/usuarios/:id', async (req, res) => {
    try {
        // Atualiza o usuário no banco de dados
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id }, // Identifica o usuário pelo ID fornecido na URL
            data: {
                email: req.body.email, // Atualiza o e-mail
                name: req.body.name, // Atualiza o nome
                age: req.body.age // Atualiza a idade
            }
        });
        res.status(200).json(updatedUser); // Retorna o usuário atualizado com status 200 (OK)
    } catch (error) {
         // Retorna um erro se algo falhar
        res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
    }
});
// Endpoint para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
    try {
     // Deleta o usuário do banco de dados
        await prisma.user.delete({
            where: { id: req.params.id } // Identifica o usuário pelo ID fornecido na URL
        });
        res.status(200).json({ message: "Usuário deletado com sucesso!" }); // Retorna mensagem de sucesso
    } catch (error) {
     // Retorna um erro se algo falhar
        res.status(500).json({ error: 'Erro ao deletar usuário.', details: error.message });
    }
});
// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000'); // Log indicando que o servidor está ativo
});
