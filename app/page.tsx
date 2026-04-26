import HeroSection from '@/components/sections/HeroSection'
import DrawSection from '@/components/sections/DrawSection'
import DonateSection from '@/components/sections/DonateSection'
import TodaySection from '@/components/sections/TodaySection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div id="draw">
        <DrawSection badge="하루 3회" />
      </div>
      <DonateSection />
      <TodaySection />
      <CTASection />
    </main>
  )
}
