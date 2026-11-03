export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`)
  if (!response.ok) {
    throw new Error(`GET ${path} respondeu ${response.status}`)
  }
  return response.json() as Promise<T>
}