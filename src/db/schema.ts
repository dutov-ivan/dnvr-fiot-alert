import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  fcmToken: text('fcmToken').notNull(),
  faculty: text('faculty').notNull(),
});
