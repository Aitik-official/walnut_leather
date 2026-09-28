"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Receipt, Percent, CheckCircle2, ShieldCheck, Building2, HelpCircle } from "lucide-react"

export default function TaxSettingsTab() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [enabled, setEnabled] = useState(true)
  const [taxName, setTaxName] = useState("GST (Goods & Services Tax)")
  const [taxRate, setTaxRate] = useState<number>(18)
  const [gstin, setGstin] = useState("")
  const [hsnCode, setHsnCode] = useState("4203")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const presetRates = [
    { label: "5% (Basic)", value: 5 },
    { label: "12% (Standard Leather)", value: 12 },
    { label: "18% (Standard GST - Recommended)", value: 18 },
    { label: "28% (Luxury Tier)", value: 28 },
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/settings/tax")
      const data = await res.json()
      if (data.success && data.settings) {
        setEnabled(data.settings.enabled ?? true)
        setTaxName(data.settings.taxName || "GST (Goods & Services Tax)")
        setTaxRate(Number(data.settings.taxRate) || 18)
        setGstin(data.settings.gstin || "")
        setHsnCode(data.settings.hsnCode || "4203")
        setLastUpdated(data.settings.updatedAt || null)
      }
    } catch (err) {
      console.error("Failed to load tax settings:", err)
      toast({
        title: "Notice",
        description: "Loaded default GST settings",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/settings/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          taxName,
          taxRate: Number(taxRate),
          gstin,
          hsnCode,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast({
          title: "Settings Saved",
          description: `Tax configured to ${taxRate}% (${taxName}) successfully.`,
        })
        setLastUpdated(new Date().toISOString())
      } else {
        throw new Error(data.error || "Failed to update")
      }
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message || "Failed to update tax settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const sampleAmount = 10000
  const calculatedTax = enabled ? (sampleAmount * taxRate) / 100 : 0
  const sampleTotal = sampleAmount + calculatedTax

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold">Tax & GST Settings (India Format)</CardTitle>
              </div>
              <CardDescription>
                Configure tax percentage and Indian GST breakdown applied dynamically at checkout.
              </CardDescription>
            </div>
            {lastUpdated && (
              <Badge variant="outline" className="text-xs self-start sm:self-auto">
                Updated: {new Date(lastUpdated).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Loading tax settings...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Enable / Disable Switch */}
              <div className="flex items-center justify-between p-4 bg-muted/30 border rounded-xl">
                <div className="space-y-0.5">
                  <Label htmlFor="tax-toggle" className="text-base font-semibold cursor-pointer">
                    Enable Tax / GST Collection
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, tax percentage will be calculated and added to orders during checkout.
                  </p>
                </div>
                <input
                  id="tax-toggle"
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="h-5 w-5 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              {/* Tax Name & Percentage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="tax-name" className="text-sm font-medium">
                    Tax Label / Display Name
                  </Label>
                  <Input
                    id="tax-name"
                    value={taxName}
                    onChange={(e) => setTaxName(e.target.value)}
                    placeholder="e.g. GST (18%) or CGST + SGST"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This label is shown to customers on the checkout and receipt summary.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate" className="text-sm font-medium">
                    Tax Rate (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="pr-10"
                      required
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Percentage added to order subtotal.
                  </p>
                </div>
              </div>

              {/* Preset Quick Buttons */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Indian GST Standard Presets
                </Label>
                <div className="flex flex-wrap gap-2">
                  {presetRates.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant={taxRate === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTaxRate(preset.value)}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Indian Business Details: GSTIN & HSN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="gstin" className="text-sm font-medium">
                      GSTIN Number (Optional)
                    </Label>
                  </div>
                  <Input
                    id="gstin"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground">
                    15-character Indian Goods and Services Tax Identification Number.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="hsn-code" className="text-sm font-medium">
                      HSN / SAC Code
                    </Label>
                  </div>
                  <Input
                    id="hsn-code"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="e.g. 4203 (Articles of Leather)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Harmonized System of Nomenclature code for leather jackets and apparel.
                  </p>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Live Calculation Preview (Sample Order of ₹10,000)
                  </span>
                  <Badge variant={enabled ? "default" : "secondary"}>
                    {enabled ? `${taxRate}% GST Active` : "Tax Disabled"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-muted-foreground">Subtotal:</span>
                    <p className="font-semibold text-sm">₹{sampleAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{taxName} ({enabled ? taxRate : 0}%):</span>
                    <p className="font-semibold text-sm text-primary">₹{calculatedTax.toLocaleString('en-IN')}</p>
                    {enabled && taxRate > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        (CGST {taxRate / 2}%: ₹{(calculatedTax / 2).toLocaleString('en-IN')} + SGST {taxRate / 2}%: ₹{(calculatedTax / 2).toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Final Total:</span>
                    <p className="font-bold text-sm text-foreground">₹{sampleTotal.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving} className="px-6">
                  {saving ? "Saving Changes..." : "Save Tax Settings"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
