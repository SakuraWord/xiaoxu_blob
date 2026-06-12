import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Skills from '@/components/skills'
import Interests from '@/components/interests'
import Projects from '@/components/projects'
import Repos from '@/components/repos'
import Activity from '@/components/activity'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Skills />
      <Interests />
      <Projects />
      <Repos />
      <Activity />
      <Footer />
    </main>
  )
}
