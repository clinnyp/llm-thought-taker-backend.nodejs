import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { handle } from 'hono/aws-lambda'
import { db } from './shared/db/db'
import { notes, users } from './shared/db/schema'


const app = new Hono()

app.get('/', async (c) => {
  const result = await db.select().from(users)
  return c.json({ message: result })
})

app.get('/notes', async (c) => {
  const result = await db.select().from(notes)
  return c.json({ message: result })
})


// Local development server
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

// Lambda handler for AWS deployment
export const handler = handle(app)