import { Outlet } from 'react-router'
import { NavBar } from './nav-bar'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      <div className="h-[3px] shrink-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600" />
      <NavBar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
