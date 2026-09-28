import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Walnut Leather",
  description: "Learn how Walnut Leather collects, uses, protects, and handles your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background text-foreground py-12 md:py-16 px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: September 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
          <p>
            Walnut Leather ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            or purchase products from us.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
          <p>We may collect several types of information from and about users of our website, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Details:</strong> Name, shipping address, billing address, email address, and telephone number.</li>
            <li><strong>Payment Information:</strong> Payment details are securely processed by authorized third-party gateways (including PayPal and credit card processors). We do not store sensitive payment credentials or credit card numbers on our servers.</li>
            <li><strong>Order Data:</strong> Details about products purchased, order history, transaction records, and communication logs.</li>
            <li><strong>Technical & Usage Data:</strong> IP address, browser type, operating system, browsing actions, and device identifiers collected automatically via cookies.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
          <p>We use your personal data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and deliver order purchases, send shipping notifications, and manage returns.</li>
            <li>Process payments securely through PayPal and trusted credit card payment processing partners.</li>
            <li>Provide customer support and respond to your inquiries efficiently.</li>
            <li>Send order confirmation emails, invoice details, and promotional communications (if opted in).</li>
            <li>Detect and prevent fraud, security breaches, and unauthorized transactions.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">4. Payment Processing & Third-Party Services</h2>
          <p>
            When you complete a purchase using PayPal or credit card processing partners, your billing information is transmitted directly 
            to PayPal under encrypted SSL technology (256-bit). PayPal handles your payment information according to their 
            own global privacy and data protection standards.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">5. Data Sharing & Security</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We only share information with trusted service providers 
            (logistics partners, payment gateways, web hosting services) strictly necessary to fulfill your orders and operate our business. 
            We implement robust administrative, technical, and physical security measures to safeguard your personal data.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">6. Your Data Protection Rights</h2>
          <p>Depending on your jurisdiction, you have the right to access, update, correct, or request deletion of your personal data held by us. You can exercise these rights by contacting us at info@walnutleather.com.</p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-foreground">7. Contact Us</h2>
          <p>If you have questions regarding this Privacy Policy or data processing practices, please contact us:</p>
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
