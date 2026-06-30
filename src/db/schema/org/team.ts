import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const team = pgTable(
  "team",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(
      () => /* @__PURE__ */ new Date(),
    ),
    slug: text("slug"),
  },
  (table) => [index("team_organizationId_idx").on(table.organizationId)],
);