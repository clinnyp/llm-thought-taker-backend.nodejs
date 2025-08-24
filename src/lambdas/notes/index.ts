import { Hono } from "hono"
import { db } from "../../shared/db/db"
import { notes, users } from "../../shared/db/schema"
import { and, eq } from "drizzle-orm"


const app = new Hono()

app.get('/:noteId/users/:externalUserId', async (c) => {
  try {
    const noteId = c.req.param('noteId')
    const externalUserId = c.req.param('externalUserId')

    const result = await db.select().from(notes).innerJoin(users, eq(notes.userId, users.id)).where(and(eq(notes.id, noteId), eq(users.externalId, externalUserId)))
    if (!result) {
      return c.json({ message: 'Note not found' }, 404)
    }
    return c.json({ message: "Note Retrieved Successfully", result }, 200)
  } catch (error) {
    return c.json({ message: 'Error fetching note', error }, 500)
  }
})

app.post('/', async (c) => {
  try {
    // later zod validation
    const body = await c.req.json()
    const { external_user_id } = body
    const userResult = await db.select().from(users).where(eq(users.externalId, external_user_id)).then(res => res[0])
    if (!userResult) {
      return c.json({ message: 'User not found' }, 404)
    }
    const newNote = {
      ...body,
      userId: userResult.id
    }
    const note = await db.insert(notes).values(newNote).returning()
    return c.json({ message: "Note Created Successfully", note }, 201)
  } catch (error) {
    return c.json({ message: 'Error creating note', error }, 500)
  }
})

export default app