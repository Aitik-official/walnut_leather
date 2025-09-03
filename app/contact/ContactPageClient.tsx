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
              <a className="underline underline-offset-4" href="mailto:support@walnutleather.com">
                support@walnutleather.com
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

        <div className="mt-10 grid gap-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Walnut Leather</p>
          <p>123 Artisan Way, Studio 4</p>
          <p>Walnut Grove, CA 90210</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </section>
    </main>
  )
}
