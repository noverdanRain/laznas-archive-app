import { sql } from "drizzle-orm";
import {
    mysqlTable,
    varchar,
    char,
    mysqlEnum,
    timestamp,
    foreignKey,
    text,
    int,
    boolean,
    index,
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
            .unique("unique_username")
            .notNull(),
        password: varchar("password", { length: 255 }).notNull(),
        role: mysqlEnum("role", ["administrator", "staff"])
            .notNull()
            .default("staff"),
        isDisabled: boolean("is_disabled").default(false).notNull(),
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
        isPrivate: boolean("is_private").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    },
    () => [
        // INI GAK TERBACA! PERLU DIBUAT MANUAL UNTUK FULLTEXT INDEX
        sql`FULLTEXT directories_fulltext (name)`,
    ]
);

// export const files = mysqlTable("files", {
//     id: uuidType("id")
//         .primaryKey()
//         .notNull()
//         .default(sql`(UUID())`),
//     cid: varchar("cid", { length: 255 }).unique("unique_cid").notNull(),
//     extension: varchar("extension", { length: 10 }).notNull(),
// });

export const documents = mysqlTable(
    "documents",
    {
        id: uuidType("id")
            .primaryKey()
            .notNull()
            .default(sql`(UUID())`),
        documentNum: varchar("document_num", { length: 255 })
            .unique("unique_document_num"),
        documentTypeId: uuidType("document_type_id").notNull(),
        directoryId: uuidType("directory_id").notNull(),
        userId: uuidType("user_id"),
        title: varchar("title", { length: 255 }).notNull(),
        description: text("description"),
        cid: varchar("cid", { length: 255 }).notNull(),
        fileExt: varchar("file_ext", { length: 10 }).notNull(),
        viewsCount: int("views_count").default(0).notNull(),
        isPrivate: boolean("is_private").default(true).notNull(),
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
            columns: [t.userId],
            foreignColumns: [users.id],
            name: "fk_user_document",
        })
            .onDelete("set null")
            .onUpdate("cascade"),
        index("idx_document_cid").on(t.cid),
        // INI GAK TERBACA! PERLU DIBUAT MANUAL UNTUK FULLTEXT INDEX
        sql`FULLTEXT documents_fulltext (title, description, document_num)`,
    ]
);

export const fileHistory = mysqlTable(
    "file_history",
    {
        id: uuidType("id")
            .primaryKey()
            .notNull()
            .default(sql`(UUID())`),
        documentId: uuidType("doc_id"),
        userId: uuidType("user_id"),
        cid: varchar("cid", { length: 255 }).notNull(),
        changeName: varchar("change_name", { length: 255 }).notNull(),
        fileExt: varchar("file_ext", { length: 10 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.documentId],
            foreignColumns: [documents.id],
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

// ALTER TABLE directories
//     ADD FULLTEXT directories_fulltext (name);

// ALTER TABLE documents
//     ADD FULLTEXT documents_fulltext (title, description, document_num);
