import { sql } from "drizzle-orm";
import {
    mysqlTable,
    varchar,
    char,
    mysqlEnum,
    timestamp,
    foreignKey,
    check,
    text,
    int,
} from "drizzle-orm/mysql-core";

const uuidType = (name: string) => char(name, { length: 36 });

export const divisions = mysqlTable("divisions", {
    id: uuidType("id")
        .primaryKey()
        .notNull()
        .default(sql`(UUID())`),
    name: varchar("name", { length: 255 }).notNull(),
});

export const users = mysqlTable(
    "users",
    {
        id: uuidType("id")
            .primaryKey()
            .notNull()
            .default(sql`(UUID())`),
        divisionId: uuidType("division_id"),
        username: varchar("username", { length: 255 })
            .unique("unique_password")
            .notNull(),
        password: varchar("password", { length: 255 }).notNull(),
        role: mysqlEnum("role", ["administrator", "staff"])
            .notNull()
            .default("staff"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.divisionId],
            foreignColumns: [divisions.id],
            name: "fk_division",
        })
            .onDelete("set null")
            .onUpdate("cascade"),
    ]
);

export const documentTypes = mysqlTable("document_types", {
    id: uuidType("id")
        .primaryKey()
        .notNull()
        .default(sql`(UUID())`),
    name: varchar("name", { length: 255 }).notNull(),
});

export const directories = mysqlTable(
    "directories",
    {
        id: uuidType("id")
            .primaryKey()
            .notNull()
            .default(sql`(UUID())`),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        // INI GAK TERBACA! PERLU DIBUAT MANUAL UNTUK FULLTEXT INDEX
        sql`FULLTEXT directories_fulltext (name)`,
    ]
);

export const files = mysqlTable("files", {
    id: uuidType("id")
        .primaryKey()
        .notNull()
        .default(sql`(UUID())`),
    cid: varchar("cid", { length: 255 }).unique("unique_cid").notNull(),
});

export const fileHistory = mysqlTable(
    "file_history",
    {
        id: uuidType("id")
            .primaryKey()
            .notNull()
            .default(sql`(UUID())`),
        fileId: uuidType("file_id"),
        cid: varchar("cid", { length: 255 }).notNull(),
        userId: uuidType("user_id"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.fileId],
            foreignColumns: [files.id],
            name: "fk_file_history",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
        foreignKey({
            columns: [t.userId],
            foreignColumns: [users.id],
            name: "fk_user_history",
        })
            .onDelete("set null")
            .onUpdate("cascade"),
    ]
);

export const documents = mysqlTable(
    "documents",
    {
        id: uuidType("id")
            .primaryKey()
            .notNull()
            .default(sql`(UUID())`),
        documentNum: varchar("document_num", { length: 255 })
            .unique("unique_document_num")
            .notNull(),
        documentTypeId: uuidType("document_type_id").notNull(),
        directoryId: uuidType("directory_id").notNull(),
        fileId: uuidType("file_id").notNull(),
        userId: uuidType("user_id"),
        title: varchar("title", { length: 255 }).notNull(),
        description: text("description"),
        viewCount: int("view_count").default(0).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.documentTypeId],
            foreignColumns: [documentTypes.id],
            name: "fk_document_type",
        }).onUpdate("cascade"),
        foreignKey({
            columns: [t.directoryId],
            foreignColumns: [directories.id],
            name: "fk_directory",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
        foreignKey({
            columns: [t.fileId],
            foreignColumns: [files.id],
            name: "fk_file_document",
        }).onUpdate("cascade"),
        foreignKey({
            columns: [t.userId],
            foreignColumns: [users.id],
            name: "fk_user_document",
        })
            .onDelete("set null")
            .onUpdate("cascade"),
        // INI GAK TERBACA! PERLU DIBUAT MANUAL UNTUK FULLTEXT INDEX
        sql`FULLTEXT documents_fulltext (title, description, document_num)`,
    ]
);


// ALTER TABLE directories 
//     ADD FULLTEXT directories_fulltext (name);

// ALTER TABLE documents 
//     ADD FULLTEXT documents_fulltext (title, description, document_num);