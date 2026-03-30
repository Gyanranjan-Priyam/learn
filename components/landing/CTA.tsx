import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame } from "lucide-react"

export function CTA() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-900 py-24 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500">
            <Flame className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start your streak?
          </h2>
          
          <p className="mt-4 text-lg text-neutral-400">
            Join thousands of people who are building better habits, one day at a time.
            Your future self will thank you.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-medium border-2 border-orange-500 bg-orange-500 text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900"
              asChild
            >
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-neutral-500">
            No credit card required · Free plan available forever
          </p>
        </div>
      </div>
    </section>
  )
}
