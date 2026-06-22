// for search and sort UI

import { FiSearch } from "react-icons/fi";

function UserToolbar({search, setSearch, sortOrder, setSortOrder, onFilterClick}){
    return(
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* search field */}
                <div className='relative w-full lg:max-w-lg'>
                    <FiSearch
                       size={18}
                       className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                    />

                    <input
                       type="text"
                       placeholder='Search users by name, email or department ...'
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className='w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 outline-none transition-all 
                                  focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                    />
              </div>
              {/* buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={onFilterClick}
                        className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    Filter
                </button>
                <button>
                    Sort : {sortOrder==='asc'? 'A → Z' : 'Z → A'}
                </button>
              </div>
           </div>
        </div>
    )
}
export default UserToolbar