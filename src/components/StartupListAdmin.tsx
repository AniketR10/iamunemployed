'use client'

import { useState } from 'react'
import StartupRow from '../app/admin/dashboard/StartupRow'
import { fetchStartups } from '../app/action/admin'
import { Loader2 } from 'lucide-react'

export default function StartupList({ initialData }: { initialData: any[] }) {
  const [startups, setStartups] = useState(initialData)
  const [offset, setOffset] = useState(10)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialData.length === 10)

  const loadMore = async () => {
    setLoading(true)
    const newStartups = await fetchStartups(offset)
    
    setStartups((prev) => [...prev, ...newStartups])
    
    setOffset((prev) => prev + 10)
    
    if (newStartups.length < 10) setHasMore(false)
    setLoading(false)
  }

  return (
    <div className="bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase font-black border-b-2 border-gray-900 text-gray-900">
            <tr>
              <th className="px-4 py-3 border-r-2 border-gray-900">Website</th>
              <th className="px-4 py-3 border-r-2 border-gray-900 w-24">Amount</th>
              <th className="px-4 py-3 border-r-2 border-gray-900">Round</th>
              <th className="px-4 py-3 border-r-2 border-gray-900">Date</th>
              <th className="px-4 py-3 border-r-2 border-gray-900 w-64">Socials</th>
              <th className="px-4 py-3 border-r-2 border-gray-900">Source</th>
              <th className="px-4 py-3 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-100">
            {startups.map((startup) => (
              <StartupRow key={startup.id} startup={startup} />
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-4 border-t-2 border-gray-900 bg-gray-50 flex justify-center">
          <button 
            onClick={loadMore} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-bold uppercase text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16}/> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}