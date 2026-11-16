import {
  RiArrowDownSLine,
  RiArrowRightUpLine,
  RiCalendarLine,
  RiCheckDoubleLine,
  RiDatabase2Line,
  RiHeartPulseLine,
  RiLineChartLine,
  RiPulseLine,
  RiShieldCheckLine,
  RiTimeLine,
} from "react-icons/ri";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import SweetyLogo from "../components/SweetyLogo.tsx";
import { Trusties } from "../components/Trusties.tsx";

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const features = [
  {
    icon: RiPulseLine,
    title: "Every reading in rhythm",
    description: "Capture morning, meal-time, and evening readings without losing the context around them.",
  },
  {
    icon: RiLineChartLine,
    title: "Patterns, not paperwork",
    description: "See daily and monthly trends in one calm view, with the numbers that matter most.",
  },
  {
    icon: RiShieldCheckLine,
    title: "Private by default",
    description: "Your readings stay tied to your account, ready for you and the care team you choose.",
  },
];

const faqs = [
  ["How many readings can I add?", "Sweety supports up to four readings per day, one for each time slot (Morning, After breakfast, After lunch, After dinner)."],
  ["Can I review older readings?", "Yes. Choose any date for daily detail, or use reports to see month-to-date and previous-month patterns."],
  ["Can my doctor view my reports?", "Yes. A doctor can view reports after you are assigned to their care list."],
];

export default function Landing({ onGetStarted, onLogin }: LandingProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-landing-bg text-landing-text selection:bg-landing-accent/25 selection:text-white">
      {/* Navigation Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" className="flex items-center gap-2">
          <SweetyLogo size="sm" />
        </a>
        <nav className="hidden items-center gap-8 text-sm text-landing-muted md:flex">
          <a className="transition-colors hover:text-landing-text" href="#features">Features</a>
          <a className="transition-colors hover:text-landing-text" href="#how-it-works">How it works</a>
          <a className="transition-colors hover:text-landing-text" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button className="rounded-full" variant="ghost" onClick={onLogin}>Log in</Button>
          <Button className="rounded-full" variant="outline" onClick={onGetStarted}>Start tracking</Button>
        </div>
      </header>

      <main>
        {/* Veil Hero Section 2 */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
          {/* Ambient Veil Radial Halo Glow Backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="mx-auto max-w-5xl px-6 text-center">
            {/* Social Proof Veil Badge with Trusties */}
            <div className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-landing-border bg-landing-panel/90 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <Trusties />
              <div className="flex items-center gap-1.5 text-xs text-landing-muted font-medium">
                <span className="size-2 rounded-full bg-landing-accent animate-pulse" />
                <span>Over 1,200+ glucose readings tracked with clinical clarity</span>
              </div>
            </div>

            {/* Hero Main Headline with Veil Typography */}
            <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-landing-text sm:text-7xl">
              Know your numbers. Feel in control of{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                every reading.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-landing-muted">
              Bring blood glucose readings, 4 daily slots, and monthly reports into one calm, medical-grade dashboard powered by PostgreSQL and Redis.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 gap-2 bg-landing-accent text-white hover:bg-landing-accent-strong shadow-lg shadow-blue-500/25 font-medium transition-all"
                onClick={onGetStarted}
              >
                <span>Start tracking free</span>
                <RiArrowRightUpLine className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 gap-2 border-landing-border bg-landing-panel/60 hover:bg-landing-panel text-landing-text transition-all"
                onClick={onLogin}
              >
                <span>See sample reports</span>
              </Button>
            </div>

            {/* Feature Pills Strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 text-xs text-landing-muted">
              <span className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-panel/60 px-3 py-1">
                <RiCheckDoubleLine className="size-3.5 text-landing-accent" />
                <span>4 Daily Slots</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-panel/60 px-3 py-1">
                <RiDatabase2Line className="size-3.5 text-landing-accent" />
                <span>PostgreSQL & Redis</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-panel/60 px-3 py-1">
                <RiHeartPulseLine className="size-3.5 text-landing-accent" />
                <span>BullMQ Daily Reminders</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-panel/60 px-3 py-1">
                <RiShieldCheckLine className="size-3.5 text-landing-accent" />
                <span>Doctor Access Control</span>
              </span>
            </div>
          </div>

          {/* Layered Veil Showcase Section */}
          <div className="mx-auto max-w-6xl px-6 pt-16">
            <div className="relative overflow-hidden rounded-3xl border border-landing-border bg-landing-panel/80 p-5 shadow-2xl shadow-blue-500/10 backdrop-blur-xl sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--landing-glow),transparent_65%)]" />
              <div className="relative grid gap-5 lg:grid-cols-[1fr_1.5fr_1fr] lg:items-center">
                <div className="hidden space-y-5 lg:block">
                  <MiniPanel
                    icon={<RiCalendarLine className="size-4 text-white" />}
                    title="Today, at a glance"
                    body="Four clear moments. One complete rhythm."
                  />
                  <MiniPanel
                    icon={<RiTimeLine className="size-4 text-landing-accent" />}
                    title="Built for real routines"
                    body="Record readings when your day actually happens."
                  />
                </div>

                {/* Central Showcase Card */}
                <Card className="border-landing-border bg-landing-bg text-landing-text shadow-xl">
                  <CardHeader className="flex-row items-start justify-between pb-2">
                    <div>
                      <p className="text-sm text-landing-muted">Today&apos;s glucose</p>
                      <CardTitle className="mt-2 text-5xl tracking-[-0.06em] text-landing-text">
                        112 <span className="text-base font-normal tracking-normal text-landing-muted">mg/dl</span>
                      </CardTitle>
                    </div>
                    <span className="rounded-full bg-landing-accent/15 px-3 py-1 text-xs font-semibold text-landing-accent">
                      In target
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-28 items-end gap-2 rounded-lg border border-landing-border bg-landing-panel px-3 py-4">
                      {[38, 54, 46, 72, 60, 82, 68, 91, 76, 84, 70, 88].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-sm bg-landing-accent/80 transition-all hover:bg-landing-accent-strong"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-landing-muted">
                      <ReadingPoint label="Morning" value="95" />
                      <ReadingPoint label="Breakfast" value="140" />
                      <ReadingPoint label="Lunch" value="160" />
                      <ReadingPoint label="Dinner" value="130" />
                    </div>
                  </CardContent>
                </Card>

                <div className="hidden space-y-5 lg:block">
                  <MiniPanel
                    icon={<RiLineChartLine className="size-4 text-landing-accent" />}
                    title="Patterns you can use"
                    body="Daily and monthly reports make change visible."
                  />
                  <MiniPanel
                    icon={<RiShieldCheckLine className="size-4 text-landing-accent" />}
                    title="Yours to share"
                    body="Your health data stays safely tied to your account."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-landing-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="text-sm text-landing-accent font-medium">A better daily habit</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Less friction between a reading and a healthy decision.
              </h2>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-landing-border bg-landing-panel text-landing-text shadow-sm">
                  <CardHeader>
                    <div className="mb-6 grid size-10 place-items-center rounded-xl bg-landing-accent/15 text-landing-accent">
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-landing-muted">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mx-auto grid max-w-6xl gap-12 px-6 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">A small check-in that adds up.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-landing-muted">
              Log what happened, see where you are, and bring a clearer story to your next conversation with your doctor.
            </p>
            <Button className="rounded-full mt-8 gap-2 bg-landing-accent text-white hover:bg-landing-accent-strong" onClick={onGetStarted}>
              <span>Create your account</span>
              <RiArrowRightUpLine className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["01", "Add the moment", "Choose a time slot (Morning, Breakfast, Lunch, Dinner) and record the glucose value."],
              ["02", "Watch the pattern", "Daily, month-to-date, and previous-month views keep context close."],
              ["03", "Share with care", "Assigned doctors can view reports you choose to share."],
              ["04", "Keep moving", "A simple history makes the next day easier to manage."],
            ].map(([number, title, description]) => (
              <Card key={number} className="border-landing-border bg-landing-panel text-landing-text shadow-sm">
                <CardHeader>
                  <span className="text-xs font-bold text-landing-accent font-mono">{number}</span>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-landing-muted">{description}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-landing-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm text-landing-accent font-medium">Questions, answered</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Start with what matters.</h2>
            </div>
            <div className="divide-y divide-landing-border rounded-xl border border-landing-border bg-landing-panel px-6 shadow-sm">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-landing-text [&::-webkit-details-marker]:hidden">
                    {question}
                    <RiArrowDownSLine className="size-5 text-landing-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-landing-muted">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto grid max-w-6xl gap-12 px-6 py-16 text-sm text-landing-muted md:grid-cols-[1.2fr_1fr_1fr_1fr] border-t border-landing-border">
        <div>
          <SweetyLogo size="sm" />
          <p className="mt-5 max-w-xs leading-6 text-xs text-landing-muted">
            A calmer home for your daily blood glucose routine.
          </p>
        </div>
        <FooterColumn title="Product" links={["Features", "How it works", "Reports"]} />
        <FooterColumn title="Support" links={["FAQ", "Privacy", "Contact"]} />
        <div>
          <p className="font-medium text-landing-text">Ready when you are</p>
          <Button variant="outline" size="sm" className="mt-4 rounded-full" onClick={onGetStarted}>
            Start tracking
          </Button>
        </div>
      </footer>
    </div>
  );
}

function MiniPanel({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-landing-border bg-landing-bg/70 p-4">
      <div className="mb-4 grid size-8 place-items-center rounded-lg bg-landing-accent/15 text-landing-accent">{icon}</div>
      <p className="text-sm font-medium text-landing-text">{title}</p>
      <p className="mt-1 text-xs leading-5 text-landing-muted">{body}</p>
    </div>
  );
}

function ReadingPoint({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider">{label}</p>
      <p className="mt-1 font-semibold text-landing-text text-sm">{value}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="font-semibold text-landing-text text-xs uppercase tracking-wider">{title}</p>
      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
            className="block text-xs text-landing-muted transition-colors hover:text-landing-text"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
