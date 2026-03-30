import {
  Flame,
  Calendar,
  Bell,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react"

const features = [
  {
    icon: Flame,
    title: "Streak Tracking",
    description:
      "Track multiple streaks simultaneously with beautiful visual progress indicators and milestone celebrations.",
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    description:
      "Sync your streaks with Google Calendar or subscribe via Apple Calendar for seamless integration.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Personalized daily reminders at your preferred time ensure you never forget to check in.",
  },
  {
    icon: BarChart3,
    title: "Activity Heatmap",
    description:
      "Visualize your consistency with GitHub-style heatmaps that show your progress at a glance.",
  },
  {
    icon: Shield,
    title: "Streak Freezes",
    description:
      "Life happens. Use up to 2 freezes per streak to protect your progress on off days.",
  },
  {
    icon: Smartphone,
    title: "Milestone Rewards",
    description:
      "Celebrate achievements at 5, 10, 30, 60, 90, and 100-day milestones with badges and confetti.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-500">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Everything you need to build lasting habits
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Powerful tools designed to keep you motivated and accountable on your journey.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/50">
                <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
