import { useEffect, useState } from "react"
import type { Project } from "@/types/Project"
import {
  Github,
  Linkedin,
  Mail,
  Briefcase,
  Calendar,
  Rocket,
  Award,
} from "lucide-react"
import ProjectCard from "./ProjectCard"
import { getProjects } from "@/services/projectService.ts"
import { getOwner } from "@/services/userService.ts"
import { toUIProject } from "@/helpers/toUIProject.ts"
import type { UserType } from "@/types/User.ts"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import cameronPhoto from "@/assets/cameron_loh_photo.png"
import "@fontsource/press-start-2p/index.css"

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [owner, setOwner] = useState<UserType | null>(null)

  const current_class = import.meta.env.VITE_CURRENT_CLASS
  const current_quest = import.meta.env.VITE_CURRENT_QUEST

  const [activeTab, setActiveTab] = useState("projects")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [{ projects: apiProjects }, apiOwner] = await Promise.all([
          getProjects(),
          getOwner(),
        ])
        setProjects((apiProjects ?? []).map(toUIProject))
        setOwner(apiOwner)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayName = owner?.name ?? "Trainer"

  const filteredProjects = {
    projects: projects.filter((p) => p.type === "project"),
    experience: projects.filter((p) => p.type === "experience"),
    event: projects.filter((p) => p.type === "event"),
    certificates: projects.filter((p) => p.type === "certificate"),
  }

  // Retro Grid Background Component
  const RetroGrid = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  )

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white font-['Press_Start_2P'] gap-6">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-emerald-500 animate-spin rounded-none"></div>
        <p className="text-xs text-gray-900">LOADING SAVE FILE...</p>
      </div>
    )

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-mono selection:bg-emerald-300">
      <RetroGrid />

      {/* --- HERO SECTION: "THE TRAINER CARD" --- */}
      <header className="relative pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Card Container */}
          <div className="bg-white border-4 border-gray-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 relative">
            {/* Decorative Corner Screws */}
            <div className="absolute top-3 left-3 w-3 h-3 border-2 border-gray-900 bg-gray-200"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-2 border-gray-900 bg-gray-200"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-2 border-gray-900 bg-gray-200"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-2 border-gray-900 bg-gray-200"></div>

            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
              {/* Left: Avatar Box */}
              <div className="shrink-0 flex flex-col gap-4">
                <div className="w-48 h-48 bg-emerald-50 border-4 border-gray-900 p-2 relative">
                  <img
                    src={cameronPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover contrast-125 hover:grayscale-0 transition-all duration-500"
                    style={{ imageRendering: "pixelated" }}
                  />
                  {/* Badge */}
                  <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white text-[10px] font-['Press_Start_2P'] px-2 py-1 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    AVAILABLE
                  </div>
                </div>

                {/* Social Inventory */}
                <div className="flex gap-2 justify-center">
                  {[
                    { icon: Github, link: owner?.github },
                    { icon: Linkedin, link: owner?.linkedin },
                    { icon: Mail, link: `mailto:${owner?.email}` },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-white border-2 border-gray-900 flex items-center justify-center hover:bg-emerald-200 hover:-translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <item.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h2 className="font-['Press_Start_2P'] text-emerald-600 text-xs mb-2 tracking-wider">
                    TRAINER CARD
                  </h2>
                  <h1 className="font-['Press_Start_2P'] text-2xl md:text-3xl leading-relaxed text-gray-900">
                    {displayName}
                  </h1>
                </div>

                <div className="font-mono text-sm md:text-base leading-relaxed border-l-4 border-emerald-500 pl-4 bg-emerald-50/30 py-3 text-gray-700">
                  {owner?.description}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 border-2 border-gray-900">
                    <div className="font-['Press_Start_2P'] text-[8px] text-gray-500 mb-2">
                      CURRENT QUEST
                    </div>
                    <div className="font-bold font-mono text-sm">
                      {current_quest}
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 border-2 border-gray-900">
                    <div className="font-['Press_Start_2P'] text-[8px] text-gray-500 mb-2">
                      CLASS
                    </div>
                    <div className="font-bold font-mono text-sm">
                      {current_class}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT SECTION: "INVENTORY" --- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="mb-8 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {[
                { id: "projects", label: "PROJECTS", icon: Rocket },
                { id: "experience", label: "EXP", icon: Briefcase },
                { id: "event", label: "EVENTS", icon: Calendar },
                { id: "certificates", label: "BADGES", icon: Award },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                                flex items-center gap-2 px-4 py-3 border-2 border-gray-900 font-['Press_Start_2P'] text-[10px] transition-all
                                ${
                                  isActive
                                    ? "bg-emerald-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                                    : "bg-white text-gray-500 hover:bg-emerald-50"
                                }
                            `}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="bg-white/50 p-6 border-4 border-dashed border-gray-300 min-h-[400px]">
            {["projects", "experience", "event", "certificates"].map((type) => (
              <TabsContent key={type} value={type} className="mt-0">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects[type as keyof typeof filteredProjects]
                    .length > 0 ? (
                    filteredProjects[type as keyof typeof filteredProjects].map(
                      (p) => <ProjectCard key={p.title} p={p} />,
                    )
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                      <div className="font-['Press_Start_2P'] text-xs mb-4 text-gray-500">
                        NO DATA FOUND
                      </div>
                      <div className="w-12 h-12 border-4 border-gray-400"></div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t-4 border-gray-900 bg-white">
        <p className="font-['Press_Start_2P'] text-[10px] text-gray-400 uppercase">
          © {new Date().getFullYear()} {displayName}
        </p>
      </footer>
    </main>
  )
}

export default Home
