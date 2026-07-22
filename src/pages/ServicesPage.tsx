import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'
import { Services } from '../components/Services'

export function ServicesPage() {
  return (
    <PageLayout>
      <PageHero
        compact
        label="Services"
        title="What we offer"
        lead="Daily rentals, online availability, and pickup at our Virginia Beach location."
      />
      <Services variant="page" />
    </PageLayout>
  )
}
