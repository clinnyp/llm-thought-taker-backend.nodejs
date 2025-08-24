import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { handle } from 'hono/aws-lambda'
import { db } from './shared/db/db'
import { notes, users } from './shared/db/schema'
import { logger } from 'hono/logger'
import notesRouter from './lambdas/notes'
import usersRouter from './lambdas/users'


const app = new Hono()

app.use('*', logger())
app.route('/notes', notesRouter)
app.route('/users', usersRouter)

// Local development server
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

// Lambda handler for AWS deployment
export const handler = handle(app)
export default app