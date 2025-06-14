import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"
import { generateRandomId } from "./genId"
import { limitCreateDocument } from "./rateLimits"

export const archive = mutation({
    args: {
      id: v.id("documents"),
      userId: v.string()
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify) {
            throw new Error("Not authenticated")
        }

        const existingDocument = await ctx.db.get(args.id)

        if(!existingDocument){
            throw new Error("404")
        }

        if(existingDocument.userId !== args.userId){
            throw new Error("401")
        }

        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents").withIndex("by_user_parent", (q) => (
                q.eq("userId", args.userId).eq("parentDocument", documentId)
            )).collect()

            for(const child of children){
                await ctx.db.patch(child._id, {
                    isAcrhived: true
                })

                await recursiveArchive(child._id)
            }
        }

        const document = await ctx.db.patch(args.id, {
            isAcrhived: true
        })

        recursiveArchive(args.id)

        return document
    }
})

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
        userId: v.string()
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify) {
            throw new Error("Not authenticated")
        }

        const documents = await ctx.db.query("documents")
            .withIndex("by_user_parent", (q) => q
                .eq("userId", args.userId)
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
        parentDocument: v.optional(v.id("documents")),
        userId: v.string(),
        lastEditor: v.string()
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify){
            throw new Error("Not authenticated")
        }

        const documentCount = await ctx.db
          .query("documents")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .order("desc")
          .collect()

        if (documentCount.length >= 100){
          throw new Error("Rate limited note")
        }

        await limitCreateDocument(ctx, args.userId)

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            shortId: generateRandomId(),
            userId: args.userId,
            userName: args.lastEditor,
            isAcrhived: false,
            isPublished: false,
            lastEditor: args.lastEditor
        })

        return document
    }
})

export const getTrash = query({
    args: {
      userId: v.string()
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify){
            throw new Error("Not authenticated")
        }

        const documents = await ctx.db.query("documents")
            .withIndex("by_user", (q) => q
                .eq("userId", args.userId)
            ).filter((q) =>
                q.eq(q.field("isAcrhived"), true)
            )
            .order("desc")
            .collect()

        return documents
    }
})

export const restore = mutation({
    args: {
      id: v.id("documents"),
      userId: v.string()
    },
    handler: async(ctx, args) => {
        const identify = await ctx.auth.getUserIdentity()

        if (!identify){
            throw new Error("Not authenticated")
        }

        const existingDocument = await ctx.db.get(args.id)

        if(!existingDocument) {
            throw new Error("Not found")
        }

        if(existingDocument.userId !== args.userId) {
            throw new Error("Unauthorized")
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents")
                .withIndex("by_user_parent", (q) => q
                    .eq("userId", args.userId)
                    .eq("parentDocument", documentId)
                )
                .collect()
        
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isAcrhived: false
                })
        
                await recursiveRestore(child._id)
            }
        }

        const options: Partial<Doc<"documents">> = {
            isAcrhived: false
        }

        if(existingDocument.parentDocument){
            const parent = await ctx.db.get(existingDocument.parentDocument)
            if(parent?.isAcrhived){
                options.parentDocument = undefined
            }
        }

        const document = await ctx.db.patch(args.id, options)
        
        recursiveRestore(args.id)

        return document
    }
})

export const remove = mutation({
    args: {
      id: v.id("documents"),
      userId: v.string()
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Not authenticated")
      }
  
      const exisingDocument = await ctx.db.get(args.id)
  
      if (!exisingDocument) {
        throw new Error("Document not found")
      }
  
      if (exisingDocument.userId !== args.userId) {
        throw new Error("Not authorized")
      }
  
      const document = await ctx.db.delete(args.id)
  
      return document
    }
})

export const getSearch = query({
    args: {
      userId: v.string()
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Not authenticated")
      }
    
      const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .filter((q) => q.eq(q.field("isAcrhived"), false))
        .order("desc")
        .collect()
  
      return documents
    }
})

export const getById = query({
    args: {
      documentId: v.id("documents"),
      userId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
  
      const document = await ctx.db.get(args.documentId)
  
      if (!document) {
        throw new Error("Document not found")
      }
  
      if (document.isPublished && !document.isAcrhived) {
        return document
      }
  
      if (!identity) {
        throw new Error("Not authenticated")
      }
    
      if (document.userId !== args.userId) {
        throw new Error("Not authorized")
      }
  
      return document
    }
})

export const getByShortId = query({
  args: {shortId: v.optional(v.string())},
  handler: async (ctx, args) => {
    const documents = await ctx.db.query("documents")
      .filter((q) => q.eq(q.field("shortId"), args.shortId))
      .collect()

    return documents[0]
  }
})

export const getTestPage = query({
  handler: async (ctx) => {
    const document = await ctx.db.query("documents")
      .filter((q) => q.eq(q.field("shortId"), "TEST-PAGE"))
      .collect()

    return document[0]
  }
})

export const update = mutation({
    args: {
      id: v.id("documents"),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      coverImage: v.optional(v.string()),
      icon: v.optional(v.string()),
      isPublished: v.optional(v.boolean()),
      parentDocument: v.optional(v.union(v.id("documents"), v.null())),
      userId: v.string(),
      lastEditor: v.string()
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Not authenticated")
      }
    
      const { id, ...rest } = args
  
      const existingDocument = await ctx.db.get(args.id)
  
      if (!existingDocument) {
        throw new Error("Document not found")
      }
  
      if (existingDocument.userId !== args.userId) {
        throw new Error("Unauthorized")
      }
      
      if (rest.parentDocument === null) {
        rest.parentDocument = undefined
        args.parentDocument = undefined
      }
      
      const document = await ctx.db.patch(args.id, {
        ...rest,
      })
      
      return document
    }
})

export const removeIcon = mutation({
    args: {
      id: v.id("documents"),
      userId: v.string()
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Not authenticated")
      }
    
      const existingDocument = await ctx.db.get(args.id)
  
      if (!existingDocument) {
        throw new Error("Document not found")
      }
  
      if (existingDocument.userId !== args.userId) {
        throw new Error("Unauthorized")
      }
  
      const document = await ctx.db.patch(args.id, {
        icon: undefined
      })
  
      return document
    }
})

export const removeCoverImage = mutation({
  args: {
    id: v.id("documents"),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error("Document not found")
    }

    if (existingDocument.userId !== args.userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    })

    return document
  }
})