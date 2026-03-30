"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createStreak, updateStreak } from "@/actions/streak"
import {
  STREAK_COLORS,
  STREAK_EMOJIS,
  STREAK_PRESETS,
  STREAK_DEFAULTS,
} from "@/lib/constants"
import { cn } from "@/lib/utils"

interface StreakFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    name: string
    description?: string | null
    targetDays: number
    color: string
    emoji: string
    freezesAllowed: number
  }
}

export function StreakForm({ mode, initialData }: StreakFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPresets, setShowPresets] = useState(mode === "create")

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    targetDays: initialData?.targetDays ?? STREAK_DEFAULTS.targetDays,
    color: initialData?.color ?? STREAK_DEFAULTS.color,
    emoji: initialData?.emoji ?? STREAK_DEFAULTS.emoji,
    freezesAllowed: initialData?.freezesAllowed ?? STREAK_DEFAULTS.freezesAllowed,
  })

  const handlePresetSelect = (preset: (typeof STREAK_PRESETS)[number]) => {
    setFormData({
      ...formData,
      name: preset.name,
      description: preset.description,
      targetDays: preset.targetDays,
      emoji: preset.emoji,
      color: preset.color,
    })
    setShowPresets(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result =
        mode === "create"
          ? await createStreak(formData)
          : await updateStreak(initialData!.id, formData)

      if (result.success) {
        if (mode === "create" && result.data) {
          router.push(`/dashboard/streaks/${result.data.id}`)
        } else {
          router.push(`/dashboard/streaks/${initialData!.id}`)
        }
      } else {
        setError(result.error)
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preset Templates */}
      {mode === "create" && showPresets && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="text-base">Quick Start Templates</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPresets(false)}
            >
              Skip & customize
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {STREAK_PRESETS.map((preset) => (
              <Card
                key={preset.name}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handlePresetSelect(preset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${preset.color}20` }}
                    >
                      {preset.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{preset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {preset.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Form */}
      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Streak Name</Label>
          <Input
            id="name"
            placeholder="e.g., Daily Exercise, Read 30 mins"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12"
            required
            maxLength={50}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="What's this streak about?"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="resize-none"
            rows={2}
            maxLength={200}
          />
        </div>

        {/* Target Days */}
        <div className="space-y-2">
          <Label htmlFor="targetDays">Target Days</Label>
          <div className="flex items-center gap-2">
            <Input
              id="targetDays"
              type="number"
              min={1}
              max={365}
              value={formData.targetDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetDays: parseInt(e.target.value) || 1,
                })
              }
              className="h-12 w-24"
            />
            <span className="text-muted-foreground">days</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[7, 21, 30, 66, 100].map((days) => (
              <Button
                key={days}
                type="button"
                variant={formData.targetDays === days ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setFormData({ ...formData, targetDays: days })}
              >
                {days} days
              </Button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {STREAK_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                className={cn(
                  "w-10 h-10 rounded-xl transition-all",
                  formData.color === colorOption.value
                    ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                )}
                style={{
                  backgroundColor: colorOption.value,
                  boxShadow:
                    formData.color === colorOption.value
                      ? `0 0 20px ${colorOption.value}40`
                      : undefined,
                }}
                onClick={() =>
                  setFormData({ ...formData, color: colorOption.value })
                }
                title={colorOption.label}
              />
            ))}
          </div>
        </div>

        {/* Emoji Selection */}
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {STREAK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={cn(
                  "w-10 h-10 rounded-xl text-xl transition-all flex items-center justify-center",
                  formData.emoji === emoji
                    ? "bg-muted ring-2 ring-primary scale-110"
                    : "bg-muted/50 hover:bg-muted hover:scale-105"
                )}
                onClick={() => setFormData({ ...formData, emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Freezes Allowed */}
        <div className="space-y-2">
          <Label htmlFor="freezes">Freezes Allowed</Label>
          <div className="flex items-center gap-2">
            <Input
              id="freezes"
              type="number"
              min={0}
              max={10}
              value={formData.freezesAllowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  freezesAllowed: parseInt(e.target.value) || 0,
                })
              }
              className="h-12 w-24"
            />
            <span className="text-sm text-muted-foreground">
              🧊 Save your streak on off days
            </span>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 rounded-xl bg-muted/30 space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">
            Preview
          </Label>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${formData.color}20` }}
            >
              {formData.emoji}
            </div>
            <div>
              <p className="font-bold text-lg">
                {formData.name || "Your Streak Name"}
              </p>
              <p className="text-sm text-muted-foreground">
                {formData.targetDays} day journey • {formData.freezesAllowed}{" "}
                freeze{formData.freezesAllowed !== 1 && "s"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.name}
          className="w-full h-12 text-base font-semibold"
          style={{ backgroundColor: formData.color }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : (
            <>
              {mode === "create" ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Streak
                </>
              ) : (
                <>
                  Save Changes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
