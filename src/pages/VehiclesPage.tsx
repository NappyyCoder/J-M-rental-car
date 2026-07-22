import { CtaBand } from '../components/CtaBand'
import { FleetSection } from '../components/FleetSection'
import { Packages } from '../components/Packages'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'

export function VehiclesPage() {
  return (
    <PageLayout>
      <PageHero
        label="Our fleet"
        title="Browse vehicles & availability"
        lead="Filter by Gold or Silver package, vehicle type, and date. Call us to confirm your reservation."
      />
      <Packages />
      <FleetSection showHead={false} />
      <CtaBand
        title="Found the right vehicle?"
        text="Call during business hours to reserve. Debit or credit card required — no cash."
      />
    </PageLayout>
  )
}
