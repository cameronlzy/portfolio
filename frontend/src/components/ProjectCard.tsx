import { ArrowUpRight, Github, Globe, Youtube } from "lucide-react"
import { Link } from "react-router-dom"
import type { Project } from "@/types/Project.ts"
import { useEffect, useRef, useState } from "react"

const ProjectCard = ({ p }: { p: Project }) => {
  const [isActive, setIsActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // For tap-vs-scroll detection
  const startPos = useRef<{ x: number; y: number; id: number | null }>({
    x: 0,
    y: 0,
    id: null,
  })
  const moved = useRef(false)
  const THRESHOLD = 10 // px

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsActive(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("touchstart", handleOutside, { passive: true })
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      startPos.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
      moved.current = false
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" && startPos.current.id === e.pointerId) {
      const dx = Math.abs(e.clientX - startPos.current.x)
      const dy = Math.abs(e.clientY - startPos.current.y)
      if (dx > THRESHOLD || dy > THRESHOLD) moved.current = true
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" && !moved.current) {
      // This was a tap, not a scroll
      setIsActive((v) => !v)
    }
    startPos.current.id = null
  }

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setIsActive(false)
  }

  return (
    <div
      ref={ref}
      className={`group relative h-full rounded-2xl border bg-white overflow-hidden transition-all duration-300 cursor-pointer touch-pan-y ${
        isActive
          ? "border-teal-500 shadow-xl -translate-y-1"
          : "border-gray-200 hover:border-teal-500 hover:shadow-xl hover:-translate-y-1"
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {/* Gradient overlay now ignores pointer events */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 transition-opacity duration-300 pointer-events-none ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header with title and icons */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-left font-bold text-lg md:text-xl text-gray-900 leading-tight">
            {p.title}
          </h3>

          {/* Action icons */}
          <div className="flex items-center gap-2 shrink-0">
            {p.repo && (
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 active:border-teal-500 active:bg-teal-50 active:text-teal-600"
                title="GitHub Repository"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {p.youtube && (
              <a
                href={p.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 active:border-teal-500 active:bg-teal-50 active:text-teal-600"
                title="YouTube Video"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {p.href &&
              (p.href.startsWith("/") ? (
                <Link
                  to={p.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 active:border-teal-500 active:bg-teal-50 active:text-teal-600"
                  title="View Project"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 active:border-teal-500 active:bg-teal-50 active:text-teal-600"
                  title="Visit Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              ))}
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm text-gray-600 text-left flex-grow">
          {p.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {p.tags.map((t) => (
            <span
              key={t}
              className={`inline-flex rounded-lg border px-3 py-1 text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-teal-100 bg-teal-50/50 text-teal-700 group-hover:border-teal-200 group-hover:bg-teal-50"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle border glow on hover/tap */}
      <div
        className={`absolute inset-0 rounded-2xl ring-1 transition-all duration-300 pointer-events-none ${
          isActive
            ? "ring-teal-500/20"
            : "ring-transparent group-hover:ring-teal-500/20"
        }`}
      />
    </div>
  )
}

export default ProjectCard
