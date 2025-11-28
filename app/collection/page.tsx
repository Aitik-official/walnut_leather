"use client"

import Link from "next/link"

const categories = [
  {
    slug: "mens",
    title: "Mens",
    img: "/mens_main.png",
  },
  {
    slug: "womens",
    title: "Womens",
    img: "/women_main.png",
  },
]

export default function CollectionPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Mens and Womens Categories */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Two Images Side by Side */}
        <div className="grid grid-cols-2 h-full w-full">
          {/* Mens Category - Left Image */}
          <Link href="/collection/mens" className="relative h-full overflow-hidden group cursor-pointer">
            <img
              src="/mens_main.png"
              alt="Mens Collection"
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
            {/* Category Title Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide z-10">
                {categories[0].title}
              </h2>
            </div>
          </Link>
          
          {/* Womens Category - Right Image */}
          <Link href="/collection/womens" className="relative h-full overflow-hidden group cursor-pointer">
            <img
              src="/women_main.png"
              alt="Womens Collection"
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
            {/* Category Title Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide z-10">
                {categories[1].title}
              </h2>
            </div>
          </Link>
        </div>
      </section>
    </main>
  )
}
