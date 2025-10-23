import { ArrowUpRight, Github, Globe, Youtube } from "lucide-react"
import { Link } from "react-router-dom"
import type { Project } from "@/types/Project.ts"

const ProjectCard = ({ p }: { p: Project }) => (
  <div className="group relative rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 transition hover:border-zinc-700 hover:shadow-2xl">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />

    <div className="relative z-10">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-xl text-left font-bold text-white">{p.title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {p.youtube && (
            <a
              href={p.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
            >
              <Youtube className="h-4 w-4" />
            </a>
          )}
          {p.href &&
            (p.href.startsWith("/") ? (
              <Link
                to={p.href}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
              >
                <Globe className="h-4 w-4" />
              </a>
            ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-zinc-400 text-left">{p.description}</p>

      <div className="flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span
            key={t}
            className="inline-flex rounded-full border border-zinc-800 bg-zinc-950/50 px-3 py-1 text-xs font-medium text-zinc-300 transition group-hover:border-zinc-700"
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-white/10" />
  </div>
)

export default ProjectCard
