"use client"

import { Navbar } from "../(landing)/_components/navbar"

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <title>Notter Gem</title>
        <Navbar />
        {children}
      </>
    )
  }