import { useEffect, useState } from "react"
import type { Project } from "@/types/Project"
import {
  Github,
  Linkedin,
  Mail,
  Briefcase,
  Calendar,
  Rocket,
} from "lucide-react"
import ProjectCard from "./ProjectCard"
import { getProjects } from "@/services/projectService.ts"
import { getOwner } from "@/services/userService.ts"
import { toUIProject } from "@/helpers/toUIProject.ts"
import type { UserType } from "@/types/User.ts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import cameronPhoto from "@/assets/cameron_loh_photo.png"

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [owner, setOwner] = useState<UserType | null>(null)
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
  }

  const tabCounts = {
    projects: filteredProjects.projects.length,
    experience: filteredProjects.experience.length,
    event: filteredProjects.event.length,
  }

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-white" />
      </div>
    )

  return (
    <main className="min-h-screen bg-black text-white p-10">
      {/* Hero Section */}
      <header className="relative border-zinc-900">
        <div className="relative mx-auto w-full py-20 sm:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-10">
              <div>
                <p className="mb-6 inline-block rounded-full border border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  <span className="inline-block animate-wave origin-bottom-right">
                    👋
                  </span>
                  {"  "}
                  Hello
                </p>
                <h1 className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
                  {displayName}
                </h1>
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-zinc-300">
                {owner?.description
                  ?.split(". ")
                  .filter((s) => s.trim().length > 0)
                  .slice(0, 3)
                  .map((s, i) => (
                    <p key={i} className="text-base sm:text-lg">
                      {s.trim()}
                    </p>
                  ))}
              </div>

              {owner && (
                <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row sm:text-center">
                  <a
                    href={`mailto:${owner.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-white px-6 py-3 font-semibold text-black transition hover:border-zinc-700 hover:bg-zinc-100"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Get in touch</span>
                  </a>
                  <div className="flex items-center gap-3">
                    <a
                      href={owner.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href={owner.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-800/20 to-transparent blur-3xl" />
                <img
                  src={cameronPhoto}
                  alt={displayName}
                  className="relative max-w-[520px] w-full h-auto rounded-3xl object-cover ring-1 ring-zinc-800"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Work Section */}
      <section className="relative border-t border-zinc-900 bg-gradient-to-b from-black to-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 space-y-4">
            <p className="inline-block rounded-full border border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Featured Work
            </p>
            <h2 className="text-5xl font-black tracking-tight sm:text-6xl">
              Projects & Experience
            </h2>
          </div>

          {error && (
            <div className="mb-8 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="inline-flex gap-3 border border-zinc-800 rounded-xl bg-zinc-950/50 p-1 backdrop-blur-sm">
              <TabsTrigger
                value="projects"
                className="flex gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition data-[state=active]:border-zinc-700 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Rocket className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
                <span className="ml-1 text-xs font-bold opacity-60">
                  {tabCounts.projects}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition data-[state=active]:border-zinc-700 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Experience</span>
                <span className="ml-1 text-xs font-bold opacity-60">
                  {tabCounts.experience}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="flex gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition data-[state=active]:border-zinc-700 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
                <span className="ml-1 text-xs font-bold opacity-60">
                  {tabCounts.event}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.projects.length > 0 ? (
                  filteredProjects.projects.map((p) => (
                    <ProjectCard key={p.title} p={p} />
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 px-6 py-20 text-center">
                    <p className="text-zinc-400">No projects yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="mt-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.experience.length > 0 ? (
                  filteredProjects.experience.map((p) => (
                    <ProjectCard key={p.title} p={p} />
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 px-6 py-20 text-center">
                    <p className="text-zinc-400">No experience entries yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="event" className="mt-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.event.length > 0 ? (
                  filteredProjects.event.map((p) => (
                    <ProjectCard key={p.title} p={p} />
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 px-6 py-20 text-center">
                    <p className="text-zinc-400">No events yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}

export default Home
