import { Suspense } from "react"
import { SuccessBuyClient } from "./success-buy-client"

export default function SuccessBuy() {
  return (
    <Suspense fallback={null}>
      <SuccessBuyClient />
    </Suspense>
  )
}
