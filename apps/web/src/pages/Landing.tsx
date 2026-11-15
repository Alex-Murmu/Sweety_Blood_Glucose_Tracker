import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.js";

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const features = [
  {
    icon: Activity,
    title: "Every reading in rhythm",
    description: "Capture morning, meal-time, and evening readings without losing the context around them.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Patterns, not paperwork",
    description: "See daily and monthly trends in one calm view, with the numbers that matter most.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "Your readings stay tied to your account, ready for you and the care team you choose.",
  },
];

const faqs = [
  ["How many readings can I add?", "Sweety supports up to four readings per day, one for each time slot."],
  ["Can I review older readings?", "Yes. Choose any date for daily detail, or use reports to see month-to-date and previous-month patterns."],
  ["Can my doctor view my reports?", "Yes. A doctor can view reports after you are assigned to their care list."],
];

export default function Landing({ onGetStarted, onLogin }: LandingProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-landing-bg text-landing-text">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-landing-accent text-landing-bg">
            <HeartPulse className="size-4" />
          </span>
          Sweety
        </a>
        <nav className="hidden items-center gap-8 text-sm text-landing-muted md:flex">
          <a className="motion-safe:transition-colors hover:text-landing-text" href="#features">Features</a>
          <a className="motion-safe:transition-colors hover:text-landing-text" href="#how-it-works">How it works</a>
          <a className="motion-safe:transition-colors hover:text-landing-text" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-landing-muted hover:bg-landing-panel hover:text-landing-text" onClick={onLogin}>Log in</Button>
          <Button variant="outline" className="border-landing-border bg-landing-panel text-landing-text hover:bg-landing-panel-strong" onClick={onGetStarted}>Start tracking</Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:pt-28">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-landing-border bg-landing-panel px-3 py-1.5 text-xs text-landing-muted">
            <Sparkles className="size-3.5 text-landing-accent" />
            A calmer way to understand your day
          </div>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-landing-text sm:text-7xl">
            Know your numbers. Feel more in control.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-landing-muted">
            Bring glucose readings, context, and patterns into one simple place.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-landing-accent text-landing-bg hover:bg-landing-accent-strong" onClick={onGetStarted}>
              Start tracking <ArrowUpRight className="ml-2 size-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-landing-border bg-transparent text-landing-text hover:bg-landing-panel" onClick={onLogin}>
              See your reports
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="relative overflow-hidden rounded-3xl border border-landing-border bg-landing-panel p-5 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--landing-glow),transparent_58%)]" />
            <div className="relative grid gap-5 lg:grid-cols-[1fr_1.5fr_1fr] lg:items-center">
              <div className="hidden space-y-5 lg:block">
                <MiniPanel icon={<CalendarDays />} title="Today, at a glance" body="Four clear moments. One complete picture." />
                <MiniPanel icon={<Clock3 />} title="Built for real routines" body="Add a reading when your day actually happens." />
              </div>
              <Card className="border-landing-border bg-landing-bg text-landing-text">
                <CardHeader className="flex-row items-start justify-between">
                  <div>
                    <p className="text-sm text-landing-muted">Today&apos;s glucose</p>
                    <CardTitle className="mt-2 text-5xl tracking-[-0.06em]">112 <span className="text-base font-normal tracking-normal text-landing-muted">mg/dl</span></CardTitle>
                  </div>
                  <span className="rounded-full bg-landing-accent/15 px-2.5 py-1 text-xs text-landing-accent">In range</span>
                </CardHeader>
                <CardContent>
                  <div className="flex h-28 items-end gap-2 rounded-lg border border-landing-border bg-landing-panel px-3 py-4">
                    {[38, 54, 46, 72, 60, 82, 68, 91, 76, 84, 70, 88].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t-sm bg-landing-accent/70" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-landing-muted">
                    <ReadingPoint label="Morning" value="98" />
                    <ReadingPoint label="Breakfast" value="126" />
                    <ReadingPoint label="Lunch" value="112" />
                    <ReadingPoint label="Dinner" value="—" />
                  </div>
                </CardContent>
              </Card>
              <div className="hidden space-y-5 lg:block">
                <MiniPanel icon={<ChartNoAxesCombined />} title="Patterns you can use" body="Daily and monthly reports make change visible." />
                <MiniPanel icon={<ShieldCheck />} title="Yours to share" body="Your health data stays in your account." />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-landing-border bg-landing-bg-soft">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="text-sm text-landing-accent">A better daily habit</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Less friction between a reading and a useful decision.</h2>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-landing-border bg-landing-panel text-landing-text">
                  <CardHeader>
                    <feature.icon className="mb-8 size-5 text-landing-accent" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-landing-muted">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto grid max-w-6xl gap-12 px-6 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">A small check-in that adds up.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-landing-muted">Log what happened, see where you are, and bring a clearer story to your next conversation with your care team.</p>
            <Button className="mt-8 bg-landing-accent text-landing-bg hover:bg-landing-accent-strong" onClick={onGetStarted}>Create your account <ArrowUpRight className="ml-2 size-4" /></Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["01", "Add the moment", "Choose a time slot and record the number."],
              ["02", "Watch the pattern", "Daily and monthly views keep context close."],
              ["03", "Share with care", "Assigned doctors can see the reports you choose to share."],
              ["04", "Keep moving", "A simple history makes the next day easier."],
            ].map(([number, title, description]) => (
              <Card key={number} className="border-landing-border bg-landing-panel text-landing-text">
                <CardHeader>
                  <span className="text-sm text-landing-accent">{number}</span>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-landing-muted">{description}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-landing-border bg-landing-bg-soft">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm text-landing-accent">Questions, answered</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Start with what matters.</h2>
            </div>
            <div className="divide-y divide-landing-border rounded-2xl border border-landing-border bg-landing-panel px-6">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-landing-text [&::-webkit-details-marker]:hidden">
                    {question}
                    <ChevronDown className="size-4 text-landing-muted motion-safe:transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-landing-muted">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto grid max-w-6xl gap-12 px-6 py-16 text-sm text-landing-muted md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 font-semibold text-landing-text">
            <span className="grid size-8 place-items-center rounded-lg bg-landing-accent text-landing-bg"><HeartPulse className="size-4" /></span>
            Sweety
          </div>
          <p className="mt-5 max-w-xs leading-6">A clearer home for your blood glucose routine.</p>
        </div>
        <FooterColumn title="Product" links={["Features", "How it works", "Reports"]} />
        <FooterColumn title="Support" links={["FAQ", "Privacy", "Contact"]} />
        <div>
          <p className="font-medium text-landing-text">Ready when you are</p>
          <Button variant="outline" size="sm" className="mt-4 border-landing-border bg-transparent text-landing-text hover:bg-landing-panel" onClick={onGetStarted}>Start tracking</Button>
        </div>
      </footer>
    </div>
  );
}

function MiniPanel({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-landing-border bg-landing-bg/70 p-4">
      <div className="mb-4 grid size-8 place-items-center rounded-lg bg-landing-accent/15 text-landing-accent">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs leading-5 text-landing-muted">{body}</p>
    </div>
  );
}

function ReadingPoint({ label, value }: { label: string; value: string }) {
  return <div><p>{label}</p><p className="mt-1 font-medium text-landing-text">{value}</p></div>;
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return <div><p className="font-medium text-landing-text">{title}</p><div className="mt-4 space-y-3">{links.map((link) => <a key={link} href={`#${link.toLowerCase().replaceAll(" ", "-")}`} className="block motion-safe:transition-colors hover:text-landing-text">{link}</a>)}</div></div>;
}
