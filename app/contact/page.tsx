import type { Metadata } from "next"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "Contact | Walnut Leather",
  description: "Questions about products or orders? Get in touch with Walnut Leather.",
}

export default function ContactPage() {
  return <ContactForm />
}
