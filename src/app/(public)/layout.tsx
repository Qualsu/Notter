"use client"
import { useRequestOrg } from "../../../server/orgs/request"
import { useRequestUser } from "../../../server/users/request"

export default function Layout({ children }: { children: React.ReactNode }){
    useRequestUser()
    useRequestOrg()
    return children
}