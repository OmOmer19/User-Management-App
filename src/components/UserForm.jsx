function UserForm({showAddForm,isEditing,formData,
                   setFormData,handleAddUser,handleUpdateUser,
                   resetForm,setShowAddForm}){

    if(!showAddForm) return null

    return(
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
                {isEditing ? 'Edit User' : 'Add User'}
            </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <input
          type="text"
          placeholder="Department"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
        />

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={isEditing ? handleUpdateUser : handleAddUser}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
        >
          {isEditing ? 'Update User' : 'Save User'}
        </button>

        <button
          onClick={() => {
            resetForm()
            setShowAddForm(false)
          }}
          className="rounded-xl border border-slate-300 px-5 py-3"
        >
          Cancel
        </button>

      </div>

    </div>
    )
}

export default UserForm