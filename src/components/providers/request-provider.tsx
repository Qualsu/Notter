"use client"

import { useRequestOrg } from "../../app/api/orgs/request"
import { useRequestUser } from "../../app/api/users/request"

export function RequestProvider({ children }: { children: React.ReactNode }) {
  useRequestUser()
  useRequestOrg()

  return <>{children}</>
}