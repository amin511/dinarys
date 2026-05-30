import CheckoutForm from "@/components/checkout-form"

export const dynamic = "force-static"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <CheckoutForm />
    </div>
  )
}
