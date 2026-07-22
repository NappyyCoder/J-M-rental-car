import { CtaBand } from '../components/CtaBand'
import { FAQ } from '../components/FAQ'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'
import { PHONE_DISPLAY } from '../lib/contact'

export function FaqPage() {
  return (
    <PageLayout>
      <PageHero
        label="FAQ"
        title="Common questions"
        lead="Answers about deposits, payment, age requirements, and what to bring when you pick up."
      />
      <FAQ showIntro={false} />
      <CtaBand
        title="Still need help?"
        text={`Call us at ${PHONE_DISPLAY} or stop by during business hours.`}
      />
    </PageLayout>
  )
}
