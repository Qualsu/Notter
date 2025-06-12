import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        userName: v.optional(v.string()),
        shortId: v.string(),
        isAcrhived: v.boolean(),
        parentDocument: v.optional(v.union(v.id("documents"), v.null())),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),
        lastEditor: v.optional(v.string())
    })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
})