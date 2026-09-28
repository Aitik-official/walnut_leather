import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export interface TaxSettings {
  enabled: boolean
  taxName: string
  taxRate: number // Percentage, e.g. 18 or 12
  gstin?: string
  hsnCode?: string
  updatedAt?: string
}

const DEFAULT_TAX_SETTINGS: TaxSettings = {
  enabled: true,
  taxName: 'GST (Goods and Services Tax)',
  taxRate: 18, // 18% standard India GST for leather goods
  gstin: '',
  hsnCode: '4203', // HSN code for leather apparel and clothing accessories
}

// GET /api/settings/tax
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const settings = await db.collection('settings').findOne({ key: 'tax_settings' })

    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_TAX_SETTINGS,
      })
    }

    return NextResponse.json({
      success: true,
      settings: {
        enabled: settings.enabled ?? DEFAULT_TAX_SETTINGS.enabled,
        taxName: settings.taxName || DEFAULT_TAX_SETTINGS.taxName,
        taxRate: typeof settings.taxRate === 'number' ? settings.taxRate : DEFAULT_TAX_SETTINGS.taxRate,
        gstin: settings.gstin || '',
        hsnCode: settings.hsnCode || DEFAULT_TAX_SETTINGS.hsnCode,
        updatedAt: settings.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Error fetching tax settings:', error)
    return NextResponse.json({
      success: true,
      settings: DEFAULT_TAX_SETTINGS,
      warning: 'Using default tax settings',
    })
  }
}

// POST /api/settings/tax
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { enabled, taxName, taxRate, gstin, hsnCode } = body

    const rate = Number(taxRate)
    if (isNaN(rate) || rate < 0 || rate > 100) {
      return NextResponse.json(
        { success: false, error: 'Tax rate must be a valid percentage between 0 and 100' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const updatedSettings: TaxSettings = {
      enabled: Boolean(enabled),
      taxName: (taxName || 'GST').trim(),
      taxRate: rate,
      gstin: (gstin || '').trim(),
      hsnCode: (hsnCode || '4203').trim(),
      updatedAt: new Date().toISOString(),
    }

    await db.collection('settings').updateOne(
      { key: 'tax_settings' },
      { $set: { ...updatedSettings, key: 'tax_settings' } },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Tax settings updated successfully',
      settings: updatedSettings,
    })
  } catch (error: any) {
    console.error('Error updating tax settings:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update tax settings' },
      { status: 500 }
    )
  }
}
