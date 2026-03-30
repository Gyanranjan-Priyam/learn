import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with habit building.",
    features: [
      "Up to 3 active streaks",
      "Daily email reminders",
      "Activity heatmap",
      "Milestone badges",
      "2 freezes per streak",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious habit builders who want more power.",
    features: [
      "Unlimited active streaks",
      "Google Calendar sync",
      "Apple Calendar (iCal) export",
      "Priority email support",
      "5 freezes per streak",
      "Advanced analytics",
      "Custom streak colors & emojis",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams building habits together.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team leaderboards",
      "Shared streak challenges",
      "Admin dashboard",
      "Slack integration",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-500">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-orange-500 bg-white shadow-lg dark:bg-neutral-900"
                  : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-neutral-900 dark:text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-neutral-500 dark:text-neutral-400">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{plan.description}</p>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 w-full ${
                  plan.featured
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                }`}
                asChild
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
