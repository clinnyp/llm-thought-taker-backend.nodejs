import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { handle } from 'hono/aws-lambda'
import { logger } from 'hono/logger'
import notesRouter from './lambdas/notes'
import usersRouter from './lambdas/users'
import { GoogleGenAI } from '@google/genai'


const app = new Hono()

app.use('*', logger())
app.route('/notes', notesRouter)
app.route('/users', usersRouter)

// generate chat response
app.post('/generate_chat', async (c) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    })

    const body = await c.req.json()
    const { prompt } = body

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    })

    return c.json({ message: "Chat Generated Successfully", chat: response.text }, 200)
  } catch (error) {
    return c.json({ message: 'Error generating chat response', error }, 500)
  }
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
export default app