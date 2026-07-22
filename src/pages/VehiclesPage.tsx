import { FleetSection } from '../components/FleetSection'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'

export function VehiclesPage() {
  return (
    <PageLayout>
      <PageHero
        compact
        label="Fleet"
        title="Available vehicles"
        lead="Choose Gold or Silver, select your date, and call us to reserve."
      />
      <FleetSection variant="page" />
    </PageLayout>
  )
}
