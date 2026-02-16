import {
  Github,
  Globe,
  Youtube,
  ArrowUpRight,
  InfinityIcon,
} from "lucide-react"
import type { Project } from "@/types/Project.ts"
import { Link } from "react-router-dom"
import Tag from "./Tag"

const ProjectCard = ({ p }: { p: Project }) => {
  return (
    <div className="flex flex-col h-full bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150">
      {/* Header: Name & Level */}
      <div className="bg-gray-100 border-b-4 border-gray-900 p-3 flex justify-between items-baseline">
        <h3 className="font-['Press_Start_2P'] text-xs text-gray-900 leading-snug mr-2">
          {p.title}
        </h3>
        <span className="font-['Press_Start_2P'] text-[10px] text-gray-900 shrink-0">
          <span className="text-[8px] mr-0.5">Lv.</span>
          <InfinityIcon width={20} />
        </span>
      </div>

      {/* Body: Description */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        <div className="font-mono text-xs text-gray-600 leading-relaxed min-h-[60px]">
          {p.description}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {p.tags.map((t) => (
            <Tag key={t} text={t} />
          ))}
        </div>
      </div>

      {/* Footer: The "Battle Menu" for Links */}
      <div className="grid grid-cols-3 border-t-4 border-gray-900 divide-x-4 divide-gray-900 bg-gray-50">
        {/* SLOT 1: REPO (GITHUB) */}
        {p.repo ? (
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col items-center justify-center py-3 hover:bg-emerald-100 transition-colors"
            title="View Code"
          >
            <Github className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="font-['Press_Start_2P'] text-[8px]">CODE</span>
          </a>
        ) : (
          <div className="flex flex-col items-center justify-center py-3 opacity-20 cursor-not-allowed">
            <Github className="w-4 h-4 mb-1" />
            <span className="font-['Press_Start_2P'] text-[8px]">-</span>
          </div>
        )}

        {/* SLOT 2: YOUTUBE (DEMO) */}
        {p.youtube ? (
          <a
            href={p.youtube}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col items-center justify-center py-3 hover:bg-red-100 transition-colors"
            title="Watch Demo"
          >
            <Youtube className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span className="font-['Press_Start_2P'] text-[8px]">WATCH</span>
          </a>
        ) : (
          <div className="flex flex-col items-center justify-center py-3 opacity-20 cursor-not-allowed">
            <Youtube className="w-4 h-4 mb-1" />
            <span className="font-['Press_Start_2P'] text-[8px]">-</span>
          </div>
        )}

        {/* SLOT 3: VISIT (LIVE) */}
        {p.href ? (
          p.href.startsWith("/") ? (
            <Link
              to={p.href}
              className="group flex flex-col items-center justify-center py-3 hover:bg-blue-100 transition-colors"
              title="View Project"
            >
              <ArrowUpRight className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-['Press_Start_2P'] text-[8px]">OPEN</span>
            </Link>
          ) : (
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center justify-center py-3 hover:bg-blue-100 transition-colors"
              title="Visit Site"
            >
              <Globe className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-['Press_Start_2P'] text-[8px]">VISIT</span>
            </a>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-3 opacity-20 cursor-not-allowed">
            <Globe className="w-4 h-4 mb-1" />
            <span className="font-['Press_Start_2P'] text-[8px]">-</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
