
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { getUsers, deleteUser, addUser, updateUser } from '../services/userService'

function UsersPage() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  })
  const [editingUserId, setEditingUserId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // fetching users on page load
  useEffect(() => {
    const fetchUsers = async() => {
      try{
        setLoading(true)
        // clearing previous errors
        setError('')

        const data = await getUsers()
        //storing users
        setUsers(data)
      }
      catch(err){
        setError('Failed to load users')
      }
      finally{
        setLoading(false)
      }
    }
    fetchUsers()
  },[])

  // function to filter users by name || email || department
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase()
    return(
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)||
      user.company?.name?.toLowerCase().includes(searchTerm)
    )
  })

  //function to sorte users asc or desc
  const sortedUsers = [...filteredUsers].sort((a,b) =>{
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if(sortOrder === 'asc'){
      return nameA.localeCompare(nameB)
    }
    else{
      return nameB.localeCompare(nameA)
    }
  })

  // function to handle delete
  const handleDelete = async(id) => {
    try{
      await deleteUser(id)
      const updatedUsers = users.filter(user => user.id !== id)

      setUsers(updatedUsers)
    }
    catch{
      setError('Failed to delete user')
    }
  }

 
  // function to handle add user
  const handleAddUser = async() =>{
    try{
      // finding highest existing user id 
      const maxId = Math.max(...users.map(user => user.id))

      const newUser = {
        // generating next unique id
        id: maxId + 1,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: {name: formData.department}
      }

      const response = await addUser(newUser)
      setUsers([...users, response])

      // resetting form after adding
      resetForm()
      setShowAddForm(false)
    }
    catch(err){
      setError('Failed to add user')
    }
  }

  //function to handle edit 
  const handleEditUser = (user) =>{
    const parts = user.name.split(" ")

    setFormData({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: user.email || '',
      department: user.company?.name || ''
    })
    setEditingUserId(user.id)
    setIsEditing(true)
    setShowAddForm(true)
  }

  // function to handle user update
  const handleUpdateUser = async() =>{
    try{
      const updatedUser = {
        id: editingUserId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: {name: formData.department}
      }
       await updateUser(editingUserId, updatedUser)

       //updating user inside state
      const updatedUsers = users.map(user => 
        user.id === editingUserId ? updatedUser : user
      )

      setUsers(updatedUsers)

      // resetting form after updating
      resetForm()
      setShowAddForm(false)
    }
    catch(err){
      setError('Failed to update user')
    }
  }

  // function to reset form state
  const resetForm = () =>{
    setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: ''
      })
      setIsEditing(false)
      setEditingUserId(null)
  }

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
          <button onClick={() =>{
            resetForm()
            setShowAddForm(true)
          }}
          className="w-full md:w-auto rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200">
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
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                    className='w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 outline-none transition-all 
                    focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                Filter
              </button>
              <button className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
               onClick={() => setSortOrder(prev => (prev==='asc'? 'desc': 'asc'))}
               >
                Sort : {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
              </button>
            </div>
          </div>
        </div>
        {/* add user form */}
        {showAddForm && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? 'Edit User' : 'Add User'}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input type="text"
                     placeholder='First Name'
                     value={formData.firstName}
                     onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                     className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
               />
               <input type="text"
                      placeholder='Last Name'
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
               />
               <input type="email" 
                      placeholder='Email'
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
               />
               <input type="text"
                      placeholder='Department'
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
               />
            </div>
            <div className='mt-6 flex gap-3'>
              <button  onClick={isEditing ? handleUpdateUser: handleAddUser}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">
                {isEditing ? 'Update User' : 'Save User'}
              </button>
              <button onClick={() =>{
                resetForm()
                setShowAddForm(false)
              }}
                      className="rounded-xl border border-slate-300 px-5 py-3" 
                >
                  Cancel
              </button>
            </div>
          </div>
        )}
        {/* user count */}
        <p className="mt-6 text-sm text-slate-600">
          Total Users: {filteredUsers.length}
        </p>
        {/* users section */}
        <div className='mt-8 rounded-3xl border border-slate-200 bg-white overflow-hidden'>
          <div className='border-b border-slate-200 px-6 py-5'>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Viewing and managing registered users
              </p>
            </div>
            </div>
            {/* loading state */}
            {loading && (
              <div className='flex justify-center py-20'>
                <p className='text-slate-500'>
                  Loading users...
                </p>
              </div>
            )}
            {/* error state */}
            {error && !loading && (
              <div className='px-6 py-20 text-center'>
                <p className="font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}
            {/* empty state */}
            {!loading && !error && sortedUsers.length ===0 &&(
              <div className='px-6 py-20 text-center'>
                <p className="text-lg font-medium text-slate-700">
                  No users found
                </p>
                <p className="mt-2 text-slate-500">
                  try again with your search term
                </p>
              </div>
            )}
            {/* displaying users */}
            {!loading && !error && sortedUsers.length > 0 && (
            <div className='grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3'>
              {/* user cards */}
              {sortedUsers.map(user => {
                const parts = user.name.split(" ")
                const firstName = parts[0]
                const lastName = parts[parts.length - 1]

                const department = user.company?.name || 'N/A'

                return(
                  <div key={user.id}
                       className='rounded-2xl border border-slate-200 p-5 
                       transition-all hover:-translate-y-1 hover:shadow-lg'
                  >
                    {/* user header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {user.email}
                        </p>
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
                    {/* user actions */}
                    <div className="mt-6 flex gap-3">
                      <button  onClick={() => handleEditUser(user)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        Edit
                      </button>
                      <button  onClick={() => handleDelete(user.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            )}
            
          </div>
        </div>
      </div>
  )
}

export default UsersPage