import { Hero } from '../components/Hero'
import { HomeFleetPreview } from '../components/HomeFleetPreview'
import { PageFoot } from '../components/PageFoot'
import { PageLayout } from '../components/PageLayout'
import { RentalProcess } from '../components/RentalProcess'

export function HomePage() {
  return (
    <PageLayout>
      <Hero />
      <RentalProcess variant="home" />
      <HomeFleetPreview />
      <div className="container home-foot-wrap">
        <PageFoot
          title="Ready to rent?"
          text="Call during business hours. Debit or credit card required at pickup."
        />
      </div>
    </PageLayout>
  )
}
