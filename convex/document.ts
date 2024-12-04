import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify) {
            throw new Error("Not authenticated")
        }

        const userId = identify.subject

        const documents = await ctx.db.query("documents")
            .withIndex("by_user_parent", (q) => q
                .eq("userId", userId)
                .eq("parentDocument", args.parentDocument)
        ).filter((q) => 
            q.eq(q.field("isAcrhived"), false)
        )
        .order("desc")
        .collect()

        return documents
    }
})

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify){
            throw new Error("Not authenticated")
        }

        const userId = identify.subject

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isAcrhived: false,
            isPublished: false
        })

        return document
    }
})