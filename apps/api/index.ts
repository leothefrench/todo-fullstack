import Fastify from 'fastify'
import prisma from './db.js' // Ton Singleton Prisma

const fastify = Fastify({
  logger: true
})

// --- Interfaces pour TypeScript ---
interface TodoBody {
  title: string;
}

interface TodoUpdateBody {
  completed: boolean;
}

interface TodoParams {
  id: string;
}

// --- Les Endpoints ---

// GET : Récupérer tous les Todos depuis Neon
fastify.get('/todos', async (request, reply) => {
  const todos = await prisma.todo.findMany()
  return todos
})

// POST : Créer un nouveau Todo
fastify.post<{ Body: TodoBody }>('/todos', async (request, reply) => {
  const { title } = request.body

  const newTodo = await prisma.todo.create({
    data: {
      title: title,
      completed: false
    }
  })

  return reply.code(201).send(newTodo)
})

// DELETE : Supprimer un Todo par son ID
fastify.delete<{ Params: TodoParams }>('/todos/:id', async (request, reply) => {
  const { id } = request.params

  try {
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    })
    return reply.code(204).send()
  } catch (err) {
    return reply.code(404).send({ error: "Todo introuvable, suppression impossible" })
  }
})

// PATCH : Modifier le statut d'un Todo
fastify.patch<{ Params: TodoParams, Body: TodoUpdateBody }>('/todos/:id', async (request, reply) => {
  const { id } = request.params
  const { completed } = request.body

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { completed }
    })
    return updatedTodo
  } catch (err) {
    return reply.code(404).send({ error: "Impossible de modifier un Todo inexistant" })
  }
})

// --- Lancement du serveur ---
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log("🚀 Serveur prêt sur http://localhost:3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
