import { CtaBand } from '../components/CtaBand'
import { Hero } from '../components/Hero'
import { Packages } from '../components/Packages'
import { PageLayout } from '../components/PageLayout'
import { RentalProcess } from '../components/RentalProcess'

export function HomePage() {
  return (
    <PageLayout>
      <Hero />
      <RentalProcess />
      <Packages compact />
      <CtaBand />
    </PageLayout>
  )
}
