import { About } from '../components/About'
import { CtaBand } from '../components/CtaBand'
import { Features } from '../components/Features'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'

export function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        label="About J&M"
        title="Dependable rentals in Virginia Beach"
        lead="A local business focused on clean vehicles, clear rental terms, and service you can count on."
      />
      <About showHeading={false} />
      <Features />
      <CtaBand
        title="Questions about renting?"
        text="Review our FAQ or call us — we're happy to walk you through requirements and availability."
      />
    </PageLayout>
  )
}
