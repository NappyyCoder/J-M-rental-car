import { CtaBand } from '../components/CtaBand'
import { Contact } from '../components/Contact'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'
import { ADDRESS_LINE1, HOURS } from '../lib/contact'

export function ContactPage() {
  return (
    <PageLayout>
      <PageHero
        label="Contact"
        title="Visit or call us"
        lead={`${ADDRESS_LINE1}, Virginia Beach. ${HOURS.weekdays.label} ${HOURS.weekdays.time.toLowerCase()}. ${HOURS.saturday.label} ${HOURS.saturday.time.toLowerCase()}.`}
      />
      <Contact />
      <CtaBand
        title="Have a question?"
        text="We can help you pick a car and walk you through deposit and payment before you come in."
      />
    </PageLayout>
  )
}
