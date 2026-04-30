import { Suspense } from "react"
import { CancelBuyClient } from "./cancel-buy-client"

export default function CancelBuy() {
  return (
    <Suspense fallback={null}>
      <CancelBuyClient />
    </Suspense>
  )
}
