// to display user info and handle edit/delete

function UserCard({user, onEdit, onDelete}){
    // extracting name parts 
    const parts = user.name.split(" ")
    const firstName = parts[0]
    const lastName = parts[parts.length - 1]
    const department = user.company?.name || "N/A"

    return(
        <div  className='rounded-2xl border border-slate-200 p-5 
              transition-all hover:-translate-y-1 hover:shadow-lg'
          >
            {/* user headeer */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                </div>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                     #{user.id}
                </span>
            </div>
            {/* user details */}
            <div className="mt-5 space-y-3 text-sm">
                <div>
                  <span className="font-medium text-slate-700">
                     First Name:
                  </span>{' '}
                  <span className="text-slate-600">
                    {firstName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">
                     Last Name:
                  </span>{' '}
                  <span className="text-slate-600">
                    {lastName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">
                     Department:
                  </span>{' '}
                  <span className="text-slate-600">
                    {department}
                  </span>
                </div>
            </div>
            {/* actions buttons */}
            <div className="mt-6 flex gap-3">
                <button onClick={() => onEdit(user)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Edit
                </button>
                <button onClick={() => onDelete(user.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default UserCard