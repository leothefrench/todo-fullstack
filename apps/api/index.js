import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

// Notre "Base de données" fictive (Logique métier simplifiée)
const todos = [
  { id: 1, title: 'Apprendre Fastify', completed: false },
  { id: 2, title: 'Configurer le Monorepo', completed: true }
]

fastify.get('/todos', async (request, reply) => {
  return todos
})

fastify.post('/todos', async (request, reply) => {
  const {title } = request.body

  const newTodo = {
    id: todos.length + 1,
    title: title,
    completed: false
  }

  todos.push(newTodo)
  reply.code(201)

  return newTodo
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

fastify.delete('/todos/:id', async (request, reply) => {
  const { id } = request.params

  const index = todos.findIndex(t => t.id === parseInt(id))

  if (index === -1) {
    // Si l'index est -1, le todo n'existe pas
    return reply.code(404).send({ error: "Todo introuvable, suppression impossible" })
  }

  todos.splice(index, 1)

  return reply.code(204).send()
})

fastify.patch('/todos/:id', async (request, reply) => {
  const { id } = request.params
  const { completed } = request.body

  const todo = todos.find(todo => todo.id === parseInt(id))

  if (!todo) {
    return reply.code(404).send({ error: "Impossible de modifier un Todo inexistant" })
  }

  if (typeof completed === 'boolean') {
    todo.completed = completed
  }

  return todo 
})