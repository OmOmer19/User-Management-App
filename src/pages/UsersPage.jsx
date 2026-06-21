
import { FiSearch } from 'react-icons/fi'

function UsersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* dashboard header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="mt-2 text-slate-600">
              Manage and organize your team members efficiently
            </p>
          </div>
          <button className="w-full md:w-auto rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200">
            + Add User
          </button>
        </div>
        {/* dashboard action bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          {/* arranging search and action controls */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className='relative w-full lg:max-w-lg'>
              <FiSearch size={18} 
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
              />
              <input type="text" placeholder='Search users by name, email or department...'
                    className='w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 outline-none transition-all 
                    focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                Filter
              </button>
              <button className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                Sort
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersPage