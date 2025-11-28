"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Currency = 'USD' | 'EUR' | 'GBP'

// Currency conversion rates (from USD to target currency)
// Products are stored in USD, so we convert from USD to the selected currency
const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD ≈ 0.92 EUR (example rate - should be updated regularly)
  GBP: 0.79, // 1 USD ≈ 0.79 GBP (example rate - should be updated regularly)
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (priceInUSD: number) => string
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD')

  useEffect(() => {
    // Load currency from localStorage
    const savedCurrency = localStorage.getItem('currency') as Currency | null
    if (savedCurrency && ['USD', 'EUR', 'GBP'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const convertPrice = (priceInUSD: number): number => {
    const rate = CONVERSION_RATES[currency]
    return priceInUSD * rate
  }

  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD)
    const symbol = CURRENCY_SYMBOLS[currency]
    return `${symbol}${convertedPrice.toFixed(2)}`
  }

  const value = {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    symbol: CURRENCY_SYMBOLS[currency],
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}

