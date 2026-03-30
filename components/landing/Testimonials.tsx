import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "I've tried every habit tracker out there, but StreakForge is the only one that actually stuck. The daily reminder and freeze feature are game changers.",
    name: "Sarah Chen",
    role: "Software Engineer",
    avatar: "SC",
  },
  {
    quote:
      "Completed my first 100-day coding streak thanks to StreakForge. The milestone celebrations kept me motivated when I wanted to quit.",
    name: "Marcus Johnson",
    role: "Product Designer",
    avatar: "MJ",
  },
  {
    quote:
      "The Google Calendar sync is brilliant. I can see my streaks alongside my work schedule, which helps me plan my days better.",
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    avatar: "ER",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-500">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Loved by habit builders everywhere
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Join thousands of people who have transformed their lives through consistent daily action.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-800"
            >
              <Quote className="h-8 w-8 text-orange-200 dark:text-orange-900" />
              <blockquote className="mt-4 flex-1 text-neutral-700 dark:text-neutral-300">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4 border-t border-neutral-100 pt-6 dark:border-neutral-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
