import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { fetchStartups, logOut } from '../../action/admin'
import { supabaseAdmin } from '@/src/lib/supabaseAdmin'
import StartupList from '@/src/components/StartupListAdmin'


export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_session')?.value === 'true'
  if (!isLoggedIn) redirect('/admin')

  const data  = await fetchStartups(0);

  return (
    <div className="min-h-screen bg-[#F8F3E7] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black uppercase text-gray-900">Database Manager</h1>
          <form action={logOut}>
            <button className="flex items-center gap-2 px-4 py-2 border-2 text-gray-900 border-gray-900 bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                <LogOut size={16} /> Logout
            </button>
          </form>
        </div>

        <StartupList initialData={data || []}/>

      </div>
    </div>
  )
}