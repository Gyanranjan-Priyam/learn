const steps = [
  {
    step: "01",
    title: "Create a Streak",
    description:
      "Set a goal like 'Learn Spanish' or 'Exercise Daily' and choose your target duration — 30 days, 90 days, or custom.",
  },
  {
    step: "02",
    title: "Check In Daily",
    description:
      "Each day, click 'Mark Today Done' to log your progress. It takes just one second but builds powerful momentum.",
  },
  {
    step: "03",
    title: "Stay Accountable",
    description:
      "Get personalized reminders, track your heatmap, and watch your streak grow. Celebrate milestones along the way.",
  },
  {
    step: "04",
    title: "Achieve Your Goal",
    description:
      "Complete your streak and earn your badge. Then start a new challenge or extend your current one.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-500">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Build habits in four simple steps
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            StreakForge makes habit-building straightforward. No complicated systems, just daily consistency.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-px w-full bg-neutral-200 dark:bg-neutral-800 lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-neutral-900 bg-white text-xl font-bold text-neutral-900 dark:border-neutral-100 dark:bg-neutral-950 dark:text-white">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
