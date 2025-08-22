import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("Users", {
  id: uuid("id").primaryKey(),
  lastName: text("last_name").notNull(),
  firstName: text("first_name").notNull(),
  emailAddress: text("email_address").notNull(),
  externalId: text("external_id").notNull(),
});

// Notes table
export const notes = pgTable("Notes", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  modifiedAt: timestamp("modified_at", { withTimezone: true }).notNull(),
  userId: uuid("userId").notNull(),
  prompt: text("prompt").notNull(),
});