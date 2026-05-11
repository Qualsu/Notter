export const pages = {
  ROOT: "/",
  URL: "https://notter.su",
  AUTH: "/auth/sign-in",
  BUY: "/buy",
  DASHBOARD: (id?: string) => (id ? `/dashboard/${id}` : "/dashboard"),
  VIEW: (id: string) => `/view/${id}`,
  VIEW_URL: (id: string) => `https://notter.su${pages.VIEW(id)}`,
  PROFILE: (team: boolean, id: string) => (team ? `/profile/org/${id}` : `/profile/${id}`),
  PROFILE_URL: (team: boolean, id: string) => `https://notter.su${pages.PROFILE(team, id)}`,
}
