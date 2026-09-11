import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'
import { Services } from '../components/Services'
import { ADDRESS_LINE1 } from '../lib/contact'

export function ServicesPage() {
  return (
    <PageLayout>
      <PageHero
        compact
        label="Services"
        title="What we offer"
        lead={`Daily rentals, online availability, and pickup at ${ADDRESS_LINE1} in Virginia Beach.`}
      />
      <Services variant="page" />
    </PageLayout>
  )
}
