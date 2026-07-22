import { About } from '../components/About'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'

export function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        label="About us"
        title="J&amp;M Car Rental LLC"
        lead="We are a local Virginia Beach rental shop with clear terms, Gold and Silver packages, and friendly service."
      />
      <About />
      <CtaBand
        title="Ready to rent?"
        text="Look at what is open online, then call us during business hours to hold a car."
      />
    </PageLayout>
  )
}
