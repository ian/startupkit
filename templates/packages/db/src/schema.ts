import { relations } from "drizzle-orm"
import {
    boolean,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    varchar
} from "drizzle-orm/pg-core"

export const teamRoleEnum = pgEnum("team_role", ["owner", "member"])

export const users = pgTable("User", {
    id: text("id").primaryKey(),
    firstName: text("firstName"),
    lastName: text("lastName"),
    name: text("name"),
    image: text("image"),
    email: text("email").unique(),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    phone: text("phone").unique(),
    role: text("role").default("user").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
    lastSeenAt: timestamp("lastSeenAt", { mode: "date" })
})

export const accounts = pgTable(
    "Account",
    {
        id: text("id").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accountId: text("accountId").notNull(),
        providerId: text("providerId").notNull(),
        accessToken: text("accessToken"),
        refreshToken: text("refreshToken"),
        accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
        refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
            mode: "date"
        }),
        scope: text("scope"),
        idToken: text("idToken"),
        password: text("password"),
        createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
        updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull()
    },
    (table) => [
        index("Account_userId_idx").on(table.userId),
        uniqueIndex("Account_providerId_accountId_key").on(
            table.providerId,
            table.accountId
        )
    ]
)

export const sessions = pgTable(
    "Session",
    {
        id: text("id").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        token: text("token").notNull().unique(),
        expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
        ipAddress: text("ipAddress"),
        userAgent: text("userAgent"),
        impersonatedBy: text("impersonatedBy"),
        createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
        updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull()
    },
    (table) => [uniqueIndex("Session_token_key").on(table.token)]
)

export const teams = pgTable(
    "Team",
    {
        id: text("id").primaryKey(),
        name: varchar("name", { length: 64 }).notNull(),
        slug: text("slug").notNull().unique(),
        createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
        updatedAt: timestamp("updatedAt", { mode: "date" })
    },
    (table) => [index("Team_slug_idx").on(table.slug)]
)

export const teamMembers = pgTable(
    "TeamMember",
    {
        teamId: text("teamId")
            .notNull()
            .references(() => teams.id),
        userId: text("userId")
            .notNull()
            .references(() => users.id),
        role: teamRoleEnum("role").default("member").notNull(),
        createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
        updatedAt: timestamp("updatedAt", { mode: "date" }),
        joinedAt: timestamp("joinedAt", { mode: "date" })
    },
    (table) => [
        uniqueIndex("TeamMember_teamId_userId_key").on(table.teamId, table.userId),
        index("TeamMember_teamId_idx").on(table.teamId),
        index("TeamMember_userId_idx").on(table.userId)
    ]
)

export const verifications = pgTable(
    "Verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
        createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
        updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull()
    },
    (table) => [
        index("Verification_identifier_value_idx").on(
            table.identifier,
            table.value
        )
    ]
)

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    memberships: many(teamMembers)
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}))

export const teamsRelations = relations(teams, ({ many }) => ({
    members: many(teamMembers)
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id]
    }),
    user: one(users, {
        fields: [teamMembers.userId],
        references: [users.id]
    })
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert

export type TeamMember = typeof teamMembers.$inferSelect
export type NewTeamMember = typeof teamMembers.$inferInsert

export type Verification = typeof verifications.$inferSelect
export type NewVerification = typeof verifications.$inferInsert

