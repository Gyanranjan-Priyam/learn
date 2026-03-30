import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.08),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 dark:border-orange-900 dark:bg-orange-950">
            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
              Build habits that stick
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
            Turn your goals into{" "}
            <span className="text-orange-500">unbreakable streaks</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-xl">
            StreakForge helps you build lasting habits through daily check-ins, 
            visual progress tracking, and smart reminders. Never break your streak again.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-neutral-900 px-8 text-base font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              asChild
            >
              <Link href="/signup">
                Start Your First Streak
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 border-neutral-300 px-8 text-base font-medium dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              asChild
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-orange-500" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-orange-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-orange-500" />
              <span>Calendar sync included</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20">
          <div className="relative mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-950/50">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-neutral-200 px-3 py-1 text-xs text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
                  streakforge.app/dashboard
                </div>
              </div>
              
              {/* Dashboard Preview */}
              <div className="bg-neutral-50 p-6 dark:bg-neutral-900 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-3">
                  {/* Streak Card 1 */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🔥</span>
                      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/50 dark:text-orange-400">
                        Active
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Learn Rust</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">30-day challenge</p>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-neutral-900 dark:text-white">23</span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                        <div className="h-full w-[77%] rounded-full bg-orange-500" />
                      </div>
                    </div>
                  </div>

                  {/* Streak Card 2 */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">💪</span>
                      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/50 dark:text-orange-400">
                        Active
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Morning Workout</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">90-day challenge</p>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-neutral-900 dark:text-white">45</span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                        <div className="h-full w-[50%] rounded-full bg-orange-500" />
                      </div>
                    </div>
                  </div>

                  {/* Streak Card 3 */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">📚</span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                        Completed
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Read Daily</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">30-day challenge</p>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-neutral-900 dark:text-white">30</span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                        <div className="h-full w-full rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
