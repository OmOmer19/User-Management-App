
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { getUsers, deleteUser, addUser, updateUser } from '../services/userService'
import UserCard from '../components/UserCard'
import UserToolbar from '../components/UserToolbar'
import UserForm from '../components/UserForm'

function UsersPage() {
  // states
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
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)

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
   
  // search + filter combined
  // function to filter users by name || email || department
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase()

    const parts = user.name.split(" ")
    const firstName = parts[0]
    const lastName = parts[parts.length - 1]

    // search match
    const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                          user.email.toLowerCase().includes(searchTerm)||
                          user.company?.name?.toLowerCase().includes(searchTerm)
    
    // filter panel match  - each filter is optional
    const matchesFilter =  // first name filter
                           (filters.firstName === '' ||
                           firstName.toLowerCase().includes(filters.firstName.toLowerCase()))
                           &&
                           //lastname filter
                           (filters.lastName === '' || 
                            lastName.toLowerCase().includes(filters.lastName.toLowerCase()))
                           &&
                           //email filter
                           (filters.email === '' ||
                            user.email.toLowerCase().includes(filters.email.toLowerCase()))
                            &&
                           // department filter
                           (filters.department === '' ||
                            user.company?.name.toLowerCase().includes(filters.department.toLowerCase()))
     
    return matchesSearch && matchesFilter
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

  // pagination 
  // last index of curr page
  const indexOfLastUser = currentPage * usersPerPage
  // first index of curr
  const indexOfFirstUser = indexOfLastUser - usersPerPage

  // extracting only users for curr page
  const paginatedUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser)

  // calculating total pages
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)

  // resetting page when filter or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, sortOrder])

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

  // function to reset filters
  const resetFilters = () =>{
    setFilters({
        firstName: '',
        lastName: '',
        email: '',
        department: ''
      })
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
        {showFilter && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            {/* filter grid */}
            <div className='grid md:grid-cols-4 gap-3'>
              <input placeholder='first name'
                     value={filters.firstName}
                     onChange={(e) => setFilters({...filters, firstName: e.target.value})}
                     className="border rounded-lg px-3 py-2"
               />
               <input placeholder='last name'
                     value={filters.lastName}
                     onChange={(e) => setFilters({...filters, lastName: e.target.value})}
                     className="border rounded-lg px-3 py-2"
               />
               <input placeholder='email'
                     value={filters.email}
                     onChange={(e) => setFilters({...filters, email: e.target.value})}
                     className="border rounded-lg px-3 py-2"
               />
               <input placeholder='department'
                     value={filters.department}
                     onChange={(e) => setFilters({...filters, department: e.target.value})}
                     className="border rounded-lg px-3 py-2"
               />
            </div>
            {/* action buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={resetFilters}
                      className='px-4 py-2 border rounded-lg'>
                Clear
              </button>
              <button onClick={() => setShowFilter(false)}
                      className="px-4 py-2 border rounded-lg"
                >
                Close
              </button>
            </div>
          </div>
        )}
        {/* dashboard action bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <UserToolbar search={search}
                       setSearch={setSearch}
                       sortOrder={sortOrder}
                       setSortOrder={setSortOrder}
                       onFilterClick={() => {
                        // toggeling filter panel open/close
                        setShowFilter(prev => !prev)
                       }}
          />
        </div>
        {/* add user form */}
        {showAddForm && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserForm 
                showAddForm={showAddForm}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                handleAddUser={handleAddUser}
                handleUpdateUser={handleUpdateUser}
                resetForm={resetForm}
                setShowAddForm={setShowAddForm}
            />
          </div>
        )}
        {/* user count */}
        <p className="mt-6 text-sm text-slate-600">
          Total Users: {filteredUsers.length}
        </p>
        {/* page size controller */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-slate-600">
            Users per page:
          </span>
          <select value={usersPerPage}
                  onChange={(e) => {
                    //updatng page size and resetting page
                    setUsersPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border rounded-lg px-3 py-1"
            >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
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
              {paginatedUsers.map(user => (
                <UserCard key={user.id} user={user}
                          onEdit={handleEditUser}
                          onDelete={handleDelete}
                />          
              ))}
            </div>
            )}
            {/* pagination controls section */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <button onClick={() => setCurrentPage(prev => prev - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Prev
              </button>
              {/* page info */}
              <span className='text-sm text-slate-600'>
                Page {currentPage} of {totalPages}
              </span>
              {/* next button */}
              <button onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
  )
}

export default UsersPage