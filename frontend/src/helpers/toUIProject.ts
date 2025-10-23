import type { ApiLink, ApiProject } from "@/types/api"
import type { Project } from "@/types/Project"

function findLink(
  links: ApiLink[] | undefined,
  kind: string
): ApiLink | undefined {
  if (!links) return undefined
  return links.find((l) => (l.type ?? "").toLowerCase() === kind)
}

export function toUIProject(api: ApiProject): Project {
  const demo = findLink(api.links, "demo")
  const github = findLink(api.links, "github")
  const figma = findLink(api.links, "figma")
  const youtubeLink = findLink(api.links, "youtube")

  const href =
    demo &&
    (demo.inSite || (typeof demo.url === "string" && demo.url.length > 0))
      ? demo.url
      : undefined

  const youtube =
    youtubeLink &&
    (youtubeLink.inSite ||
      (typeof youtubeLink.url === "string" && youtubeLink.url.length > 0))
      ? youtubeLink.url
      : undefined

  const repo =
    github &&
    (github.inSite || (typeof github.url === "string" && github.url.length > 0))
      ? github.url
      : undefined

  const figmaLink =
    figma &&
    (figma.inSite || (typeof figma.url === "string" && figma.url.length > 0))
      ? figma.url
      : undefined

  return {
    title: api.name,
    description: api.description,
    tags: api.tags ?? [],
    href,
    repo,
    youtube,
    figmaLink,
    type: api.type,
  }
}
