import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// neon, drizzle
export const user = pgTable("user", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
    conversation: many(conversation),
}));

export const conversation = pgTable("conversation", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    userId: uuid("userId")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationRelations = relations(conversation, ({ one, many }) => ({
    user: one(user, {
        fields: [conversation.userId],
        references: [user.id],
    }),
    message: many(message),
}));

export const message = pgTable("message", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    content: text("content"),
    role: text("role").$type<"user" | "assistant">(),
    conversationId: uuid("conversationId")
        .references(() => conversation.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messageRelations = relations(message, ({ one }) => ({
    conversation: one(conversation, {
        fields: [message.conversationId],
        references: [conversation.id],
    }),
}));
