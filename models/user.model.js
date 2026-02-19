import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export default usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),

    firstName: varchar('first_name', { length: 60 }).notNull(),
    lastName: varchar('last_name', { length: 60 }),

    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});