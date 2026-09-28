"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    console.log("[v0] Contact form submission:", data)
    setSubmitted(true)
    form.reset()
  }

  return (
    <main className="bg-background text-foreground">
      <section className="w-full border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
          <h1 className="text-3xl font-semibold tracking-tight text-pretty md:text-4xl">Contact</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            We’re here to help with sizing, care, shipping, and custom requests.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Instant WhatsApp Support CTA Card */}
        <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-950 text-sm md:text-base">Need instant assistance?</h4>
              <p className="text-xs md:text-sm text-emerald-800">Chat directly with our team on WhatsApp for immediate support.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919653418049?text=Hello%20Walnut%20Leather%2C%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all shrink-0 hover:scale-105"
          >
            <span>Chat on WhatsApp</span>
            <span>→</span>
          </a>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" required placeholder="Your full name" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              inputMode="email"
              placeholder="you@walnutleather.com"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input id="subject" name="subject" required placeholder="How can we help?" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea id="message" name="message" required rows={6} placeholder="Tell us a bit more..." />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Or email us directly at{" "}
              <a className="underline underline-offset-4 hover:text-foreground transition-colors" href="mailto:info@walnutleather.com">
                info@walnutleather.com
              </a>
            </p>
            <Button type="submit">Send message</Button>
          </div>

          {submitted && (
            <p role="status" className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              Thank you — your message has been received. We’ll get back to you soon.
            </p>
          )}
        </form>

        <div className="mt-10 grid gap-2.5 text-sm text-muted-foreground border-t border-border pt-8">
          <p className="font-semibold text-lg text-foreground">Walnut Leather</p>
          <p className="leading-relaxed">Juhi Niharika Mirage, 9th Floor, office no. 911, Sector -10, Kharghar- 410210.</p>
          <p><span className="font-medium text-foreground">Email:</span> <a href="mailto:info@walnutleather.com" className="hover:underline text-foreground">info@walnutleather.com</a></p>
          <p><span className="font-medium text-foreground">Phone:</span> <a href="tel:+919653418049" className="hover:underline text-foreground">+91 9653418049</a> / <a href="tel:+91913723796" className="hover:underline text-foreground">+91 913723796</a></p>
          <p>
            <span className="font-medium text-foreground">WhatsApp:</span>{" "}
            <a 
              href="https://wa.me/919653418049?text=Hello%20Walnut%20Leather%2C%20I%20have%20an%20inquiry." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] hover:underline font-medium inline-flex items-center gap-1.5"
            >
              +91 9653418049 (Click to Chat)
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
