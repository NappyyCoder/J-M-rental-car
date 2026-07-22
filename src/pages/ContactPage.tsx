import { CtaBand } from '../components/CtaBand'
import { Contact } from '../components/Contact'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'

export function ContactPage() {
  return (
    <PageLayout>
      <PageHero
        label="Contact"
        title="Visit or call J&M Car Rental"
        lead="3692 S Plaza Trail #10, Virginia Beach. We're here Mon–Fri 9:30–5:30 and Sat 10–2."
      />
      <Contact />
      <CtaBand
        title="Prefer to talk it through?"
        text="Our team can help you choose a vehicle and explain deposit and payment requirements."
      />
    </PageLayout>
  )
}
