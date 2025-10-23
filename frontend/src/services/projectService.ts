import http from "./httpService"
import type { ApiProject } from "@/types/api.ts"

const apiEndpoint = import.meta.env.VITE_API_URL + "/projects"

type GetProjectsResponse = {
  status: number
  data: { projects: ApiProject[] }
  results: number
}

/** Create or update a project */
export async function saveProject(project: Partial<ApiProject>) {
  if (project._id) {
    const payload = { ...project }
    delete (payload as Partial<ApiProject>)._id

    const { data } = await http.patch<{ project: ApiProject }>(
      `${apiEndpoint}/${project._id}`,
      payload
    )
    return data.project
  } else {
    const { data } = await http.post<{ project: ApiProject }>(
      apiEndpoint,
      project
    )
    return data.project
  }
}

/** Get list of projects (supports query params e.g. sort, page, limit, fields) */
export async function getProjects(params: Record<string, unknown> = {}) {
  const {
    data: { data: apiData, results },
  } = await http.get<GetProjectsResponse>(apiEndpoint, { params })
  return { projects: apiData.projects, results: results }
}
/** Get a single project by id */
export async function getProjectById(id: string) {
  const { data } = await http.get<{ project: ApiProject }>(
    `${apiEndpoint}/${id}`
  )
  return data.project
}

/** Delete a project by id */
export async function deleteProject(id: string) {
  const { data } = await http.delete<{ status: string; data: unknown }>(
    `${apiEndpoint}/${id}`
  )
  // if backend responds 204 (no content), axios `data` will be undefined
  return data ?? { status: "success", data: null }
}
