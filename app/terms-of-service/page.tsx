import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Walnut Leather",
  description: "Review Walnut Leather's official terms of service, purchasing rules, and legal conditions.",
}

export default function TermsOfServicePage() {
  return (
    <main className="bg-background text-foreground py-12 md:py-16 px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: September 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">1. Overview & Agreement</h2>
          <p>
            Welcome to Walnut Leather. Throughout the site, the terms "we", "us", and "our" refer to Walnut Leather. 
            By accessing or purchasing from our store, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service").
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">2. Online Store & Purchasing Terms</h2>
          <p>
            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or country of residence. 
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue any product or service without prior notice.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">3. Payments & Billing Security</h2>
          <p>
            All online transactions on our store are processed via SSL encryption. We accept payments through <strong>PayPal</strong>, major credit cards, and verified payment gateways. 
            By providing payment details, you warrant that you are authorized to use the specified payment account. 
            In the event of payment failure or transaction dispute, we reserve the right to withhold shipment until funds are cleared.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">4. Product Accuracy & Craftsmanship</h2>
          <p>
            We make every effort to display the colors and textures of our leather goods as accurately as possible. 
            Because full-grain leather is a natural material, slight natural variations in grain pattern and color tone are characteristics of authentic leather craftsmanship.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">5. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-foreground">6. Contact Information</h2>
          <div className="bg-muted/40 p-4 rounded-lg space-y-1 text-sm text-foreground">
            <p className="font-semibold">Walnut Leather</p>
            <p>Juhi Niharika Mirage, 9th Floor, office no. 911, Sector -10, Kharghar- 410210.</p>
            <p>Email: <a href="mailto:info@walnutleather.com" className="text-primary hover:underline">info@walnutleather.com</a></p>
            <p>Phone: +91 9653418049 / +91 913723796</p>
          </div>
        </section>
      </div>
    </main>
  )
}
