import { useEffect, useState } from "react"
import type { Project } from "@/types/Project"
import {
  Github,
  Linkedin,
  Mail,
  Briefcase,
  Calendar,
  Rocket,
  ArrowRight,
  Award,
} from "lucide-react"
import ProjectCard from "./ProjectCard"
import { getProjects } from "@/services/projectService.ts"
import { getOwner } from "@/services/userService.ts"
import { toUIProject } from "@/helpers/toUIProject.ts"
import type { UserType } from "@/types/User.ts"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import cameronPhoto from "@/assets/cameron_loh_photo.png"

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [owner, setOwner] = useState<UserType | null>(null)
  const [activeTab, setActiveTab] = useState("projects")

  const resumeUrl = import.meta.env.VITE_RESUME_URL

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
        setError("Failed to load data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const displayName = owner?.name ?? "Owner"

  const filteredProjects = {
    projects: projects.filter((p) => p.type === "project"),
    experience: projects.filter((p) => p.type === "experience"),
    event: projects.filter((p) => p.type === "event"),
    certificates: projects.filter((p) => p.type === "certificate"),
  }

  const tabCounts = {
    projects: filteredProjects.projects.length,
    experience: filteredProjects.experience.length,
    event: filteredProjects.event.length,
    certificates: filteredProjects.certificates.length,
  }

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-teal-500" />
      </div>
    )

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-48 -mb-48" />

        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10 py-16 md:py-28">
          <div className="grid items-center gap-12 lg:gap-20 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-10 slide-in">
              {/* Greeting Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-600">
                  Available for opportunities
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4">
                  {displayName}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
              </div>

              {/* Description */}
              <div className="space-y-4 text-lg">
                {owner?.description
                  ?.split(". ")
                  .filter((s) => s.trim().length > 0)
                  .slice(0, 3)
                  .map((s, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {s.trim()}
                    </p>
                  ))}
              </div>

              {/* CTA Buttons */}
              {owner && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href={`mailto:${owner.email}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    Get in touch
                    <ArrowRight className="h-5 w-5" />
                  </a>
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-900 font-semibold hover:border-teal-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              )}

              {/* Social Links */}
              {owner && (
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href={owner.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-all duration-300"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  </a>
                  <a
                    href={owner.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-all duration-300"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  </a>
                  <a
                    href={`mailto:${owner.email}`}
                    className="group relative w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-all duration-300"
                    title="Email"
                  >
                    <Mail className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  </a>
                </div>
              )}
            </div>

            {/* Right - Photo Section */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="float relative w-full max-w-sm">
                {/* Decorative shapes */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-3xl" />

                {/* Image container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10" />
                  <img
                    src={cameronPhoto}
                    alt={displayName}
                    className="relative w-full h-auto object-cover"
                  />
                </div>

                {/* Status badge */}
                <div className="absolute bottom-8 right-8 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200 flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-gray-900 text-sm">
                    Open to work
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Work Section */}
      <section className="relative py-20 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          {/* Section Header */}
          <div className="mb-16 slide-in">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-teal-100/50 border border-teal-200">
              <span className="text-sm font-semibold text-teal-700">
                Featured Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Projects & Experience
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-12 flex flex-wrap gap-3">
            {[
              {
                id: "projects",
                label: "Projects",
                icon: Rocket,
                count: tabCounts.projects,
              },
              {
                id: "experience",
                label: "Experience",
                icon: Briefcase,
                count: tabCounts.experience,
              },
              {
                id: "event",
                label: "Events",
                icon: Calendar,
                count: tabCounts.event,
              },
              {
                id: "certificates",
                label: "Certificates",
                icon: Award,
                count: tabCounts.certificates,
              },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  <span className="ml-2 px-2 py-1 rounded-lg bg-white/20 text-sm font-bold">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Projects Grid */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="projects" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.projects.length > 0 ? (
                  filteredProjects.projects.map((p) => (
                    <div
                      key={p.title}
                      className="group h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-teal-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProjectCard p={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                      No projects yet
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.experience.length > 0 ? (
                  filteredProjects.experience.map((p) => (
                    <div
                      key={p.title}
                      className="group h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-teal-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProjectCard p={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                      No experience entries yet
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="event" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.event.length > 0 ? (
                  filteredProjects.event.map((p) => (
                    <div
                      key={p.title}
                      className="group h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-teal-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProjectCard p={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                      No events yet
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.certificates.length > 0 ? (
                  filteredProjects.certificates.map((p) => (
                    <div
                      key={p.title}
                      className="group h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-teal-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProjectCard p={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                      No certificates yet
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 md:px-10 text-center">
          <p className="text-gray-600">
            Crafted with care by {displayName} © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  )
}

export default Home
