"use client"

const WhatsappIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    className="h-5 w-5 text-[#25D366]"
  >
    <path
      fill="currentColor"
      d="M16 3.2a12.8 12.8 0 0 0-11 19.2L4.5 29l6.7-2.1A12.8 12.8 0 1 0 16 3.2Zm0 23.04a10.2 10.2 0 0 1-5.2-1.42l-.37-.22-4 1.28 1.3-3.87-.24-.4a10.32 10.32 0 1 1 8.51 4.63Z"
    />
    <path
      fill="currentColor"
      d="M13.64 10.84c-.23-.52-.47-.53-.69-.54l-.59-.01c-.21 0-.54.08-.82.38s-1.07 1.05-1.07 2.57s1.1 2.98 1.26 3.19s2.13 3.41 5.25 4.65c2.6 1.02 3.13.82 3.69.77s1.82-.74 2.08-1.46s.26-1.33.18-1.46s-.28-.21-.58-.37s-1.82-.9-2.1-1s-.49-.16-.7.16s-.81 1-1 1.21s-.37.23-.68.08s-1.31-.48-2.5-1.52a9.4 9.4 0 0 1-1.73-2.15c-.18-.31-.02-.48.14-.64s.31-.37.47-.55s.21-.31.31-.52s.05-.39-.03-.55s-.68-1.64-.96-2.23Z"
    />
  </svg>
)

const IndiaFlag = () => (
  <span className="mr-3 flex h-5 w-5 overflow-hidden rounded-sm border border-[#dcdcdc]">
    <img
      src="https://flagcdn.com/w20/in.png"
      alt="India flag"
      className="h-full w-full object-cover"
      loading="lazy"
    />
  </span>
)

export default function WhatsappPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#222]">Enter your WhatsApp Number</h1>
          <p className="mt-2 text-sm text-[#6f6f6f]">
            We will send a verification code to your WhatsApp account to confirm your identity.
          </p>
        </div>

        <form className="mt-8 space-y-4">
          <div className="flex items-center rounded-md border border-[#dcdcdc] bg-white px-3 py-3 text-[#222] shadow-sm">
            <IndiaFlag />
            <span className="mr-2 text-sm font-medium text-[#444]">+91</span>
            <span className="text-sm text-[#888]">India</span>
            <span className="ml-auto text-[#888]">▾</span>
          </div>

          <div className="flex items-center rounded-md border border-[#dcdcdc] bg-[#f8f9fb] px-3 py-3 text-[#222] shadow-sm focus-within:border-[#1990ff]">
            <WhatsappIcon />
            <input
              type="tel"
              placeholder="WhatsApp Number"
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#a0a0a0]"
            />
          </div>

          <p className="text-xs text-[#7a7a7a]">Use the WhatsApp number you actively use.</p>

          <button
            type="button"
            className="w-full rounded-md bg-[#1890ff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f7ada] focus:outline-none focus:ring-2 focus:ring-[#1890ff]/40"
          >
            Send OTP on WhatsApp
          </button>

          <p className="text-center text-xs text-[#7a7a7a]">
            Your number will only be used for login and job-related notifications.
          </p>
          <p className="text-center text-xs font-semibold text-[#1890ff] hover:underline cursor-pointer">
            View Privacy Policy
          </p>
        </form>
      </section>
    </main>
  )
}

