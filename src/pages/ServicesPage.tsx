import { Link } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PageLayout } from '../components/PageLayout'
import { Reveal } from '../components/Reveal'
import { Services } from '../components/Services'

export function ServicesPage() {
  return (
    <PageLayout>
      <PageHero
        label="Our services"
        title="Flexible, affordable, and reliable"
        lead="Daily rentals, same-day availability, and straightforward pickup at our Virginia Beach location."
      />
      <Reveal delay={80}>
        <div className="container services-quick-cta">
          <Link className="btn btn-primary" to="/vehicles">
            View available vehicles
          </Link>
          <a className="btn btn-outline" href="tel:+17035631125">
            Call 703-563-1125
          </a>
        </div>
      </Reveal>
      <Services showIntro={false} />
      <CtaBand />
    </PageLayout>
  )
}
