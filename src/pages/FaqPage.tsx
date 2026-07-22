import { CtaBand } from '../components/CtaBand'
import { FAQ } from '../components/FAQ'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'

export function FaqPage() {
  return (
    <PageLayout>
      <PageHero
        label="FAQ"
        title="Frequently asked questions"
        lead="Rental terms, payment, deposits, and what to bring when you pick up your vehicle."
      />
      <FAQ showIntro={false} />
      <CtaBand
        title="Still have questions?"
        text="Call us at 703-563-1125 or visit our location during business hours."
      />
    </PageLayout>
  )
}
