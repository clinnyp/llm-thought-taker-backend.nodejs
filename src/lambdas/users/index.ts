import { Hono } from "hono"
import { db } from "../../shared/db/db"
import { users } from "../../shared/db/schema"
import { eq } from "drizzle-orm"


const app = new Hono()

// get all users
app.get('/', async (c) => {
  try {
    const result = await db.select().from(users)
    return c.json({ message: result }, 200)
  } catch (error) {
    return c.json({ message: 'Error fetching users', error }, 500)
  }
})

// create a user
app.post('/', async (c) => {
  try {
    const user = await c.req.json()
    const result = await db.insert(users).values(user)
    return c.json({ message: "User Created Successfully", result }, 200)
  } catch (error) {
    return c.json({ message: 'Error creating user', error }, 500)
  }
})

// delete a user
app.delete('/:externalUserId', async (c) => {
  try {
    const externalUserId = c.req.param('externalUserId')
    const user = await db.select().from(users).where(eq(users.externalId, externalUserId))

    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }
    const result = await db.delete(users).where(eq(users.id, externalUserId))
    return c.json({ message: "User Deleted Successfully", user }, 200)
  } catch (error) {
    return c.json({ message: 'Error deleting users', error }, 500)
  }
})

export default app