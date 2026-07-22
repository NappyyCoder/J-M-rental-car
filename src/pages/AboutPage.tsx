import { About } from '../components/About'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'
import { SITE_NAME, VETERAN_OWNED_LABEL } from '../lib/contact'

export function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        label="About us"
        title={SITE_NAME}
        lead={`${VETERAN_OWNED_LABEL}. Local Virginia Beach rentals with clear terms, Gold and Silver packages, and friendly service.`}
      />
      <About />
      <CtaBand
        title="Ready to rent?"
        text="Look at what is open online, then call us during business hours to hold a car."
      />
    </PageLayout>
  )
}
