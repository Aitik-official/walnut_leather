import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund & Return Policy | Walnut Leather",
  description: "Read Walnut Leather's clear, customer-friendly refund, return, and cancellation policies.",
}

export default function RefundPolicyPage() {
  return (
    <main className="bg-background text-foreground py-12 md:py-16 px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Refund & Return Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: September 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">1. Return Period & Guarantee</h2>
          <p>
            At Walnut Leather, we take pride in our handcrafted leather jackets and luxury leather goods. If you are not completely satisfied with your purchase, 
            you may request a return or exchange within <strong>30 days</strong> of receiving your delivery.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">2. Return Eligibility Requirements</h2>
          <p>To be eligible for a full refund or exchange, items must meet the following criteria:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Item must be unused, unworn, unwashed, and in original brand new condition.</li>
            <li>Item must have all original product tags, dust bags, and packaging intact.</li>
            <li>Proof of purchase (order number, PayPal transaction ID, or email receipt) must be provided.</li>
            <li>Customized, personalized, or custom-tailored leather goods are non-returnable unless defective.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">3. How to Initiate a Return</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact our customer support team at <strong>info@walnutleather.com</strong> or call <strong>+91 9653418049</strong> with your order number.</li>
            <li>Our team will review your request and issue a Return Authorization Number (RA#) along with return shipping instructions.</li>
            <li>Pack the item securely and dispatch it to our registered return facility address:
              <br />
              <em className="text-foreground font-medium">Walnut Leather — Juhi Niharika Mirage, 9th Floor, office no. 911, Sector -10, Kharghar- 410210.</em>
            </li>
          </ol>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">4. Refund Processing & PayPal Reversals</h2>
          <p>
            Once your returned package is received and quality-inspected at our warehouse (typically 2-3 business days), we will notify you via email regarding the approval of your refund.
          </p>
          <p>
            If approved, your refund will be processed immediately back to your original payment method (including <strong>PayPal account</strong> or original payment card). 
            PayPal refunds typically appear in your PayPal account balance or card within 1-3 business days depending on bank clearance.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">5. Order Cancellations</h2>
          <p>
            You can cancel an order free of charge before it has been dispatched by emailing info@walnutleather.com immediately. 
            If the order has already been shipped, standard return procedures apply once delivered.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">6. Damaged or Defective Items</h2>
          <p>
            In the rare event that you receive a defective or damaged product, please notify us within 48 hours of delivery with photos of the issue. 
            We will provide a prepaid return label and issue a full refund or express replacement at no additional cost to you.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-foreground">7. Contact Support</h2>
          <div className="bg-muted/40 p-4 rounded-lg space-y-1 text-sm text-foreground">
            <p className="font-semibold">Walnut Leather Customer Care</p>
            <p>Juhi Niharika Mirage, 9th Floor, office no. 911, Sector -10, Kharghar- 410210.</p>
            <p>Email: <a href="mailto:info@walnutleather.com" className="text-primary hover:underline">info@walnutleather.com</a></p>
            <p>Phone: +91 9653418049 / +91 913723796</p>
          </div>
        </section>
      </div>
    </main>
  )
}
