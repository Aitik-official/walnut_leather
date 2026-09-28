import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Walnut Leather",
  description: "Learn about Walnut Leather's shipping methods, delivery times, tracking, and international rates.",
}

export default function ShippingPolicyPage() {
  return (
    <main className="bg-background text-foreground py-12 md:py-16 px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Shipping & Delivery Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: September 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">1. Order Processing Times</h2>
          <p>
            All orders placed on Walnut Leather are processed within <strong>1 to 2 business days</strong> (excluding weekends and public holidays). 
            Once your order has been dispatched, you will receive an automated shipping confirmation email containing your shipment tracking number.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">2. Domestic & International Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-border">
              <thead>
                <tr className="bg-muted text-foreground text-xs uppercase">
                  <th className="p-3 border border-border">Shipping Region</th>
                  <th className="p-3 border border-border">Estimated Delivery Time</th>
                  <th className="p-3 border border-border">Cost</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr>
                  <td className="p-3 border border-border font-medium">Domestic (India) Standard</td>
                  <td className="p-3 border border-border">3 - 5 Business Days</td>
                  <td className="p-3 border border-border">FREE on all orders</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium">International Express (USA, EU, UK, Worldwide)</td>
                  <td className="p-3 border border-border">5 - 9 Business Days</td>
                  <td className="p-3 border border-border">Calculated at Checkout (FREE over $150 / ₹12,000)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">3. Shipment Tracking & PayPal Compliance</h2>
          <p>
            In accordance with <strong>PayPal Merchant Seller Protection policies</strong>, all international and domestic shipments are sent via insured, trackable courier services (DHL Express, FedEx, or Blue Dart). 
            Every customer receives a valid tracking number as soon as the carrier collects the package.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">4. Customs, Duties & Taxes</h2>
          <p>
            For international shipments, customs duties or import taxes may apply depending on your destination country's regulations. 
            Any customs fees assessed by local authorities are the responsibility of the recipient.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-foreground">5. Shipping Support & Inquiries</h2>
          <p>If you have questions about your delivery status or need assistance with shipment tracking, contact us:</p>
          <div className="bg-muted/40 p-4 rounded-lg space-y-1 text-sm text-foreground">
            <p className="font-semibold">Walnut Leather Logistics Team</p>
            <p>Juhi Niharika Mirage, 9th Floor, office no. 911, Sector -10, Kharghar- 410210.</p>
            <p>Email: <a href="mailto:info@walnutleather.com" className="text-primary hover:underline">info@walnutleather.com</a></p>
            <p>Phone: +91 9653418049 / +91 913723796</p>
          </div>
        </section>
      </div>
    </main>
  )
}
