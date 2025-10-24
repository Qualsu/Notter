"use client"
import { useRequestUser } from "../../../server/users/request"

export default function Layout({ children }: { children: React.ReactNode }){
    useRequestUser()
    return children
}