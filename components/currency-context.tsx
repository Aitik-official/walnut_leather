"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP'

// Currency conversion rates (from USD to target currency)
// Products are stored in USD, so we convert from USD to the selected currency
const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
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
  const [currency, setCurrencyState] = useState<Currency>('INR')

  useEffect(() => {
    try {
      // Load currency from localStorage
      const savedCurrency = localStorage.getItem('currency') as Currency | null
      if (savedCurrency && ['USD', 'INR', 'EUR', 'GBP'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency)
      } else {
        setCurrencyState('INR')
      }
    } catch (e) {}
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    try {
      localStorage.setItem('currency', newCurrency)
    } catch (e) {}
  }

  const convertPrice = (priceInUSD: number): number => {
    const rate = CONVERSION_RATES[currency] || 1
    return priceInUSD * rate
  }

  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD)
    const symbol = CURRENCY_SYMBOLS[currency] || '$'
    if (currency === 'INR') {
      return `${symbol}${Math.round(convertedPrice).toLocaleString('en-IN')}`
    }
    return `${symbol}${convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const value = {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    symbol: CURRENCY_SYMBOLS[currency] || '₹',
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}

