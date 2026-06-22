import axios from "axios";

// creating axios instance for api requests
const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
})

// to fetch all users
 const getUsers = async() => {
    const response = await api.get("/users")

    return response.data
 }

// to delete a user by id
const deleteUser = async(id) =>{
   const response = await api.delete(`/users/${id}`)

   return response.data
}

// to add a new user
const addUser = async(newUser)=> {
    const response = await api.post('/users', newUser)

    return response.data
}

// to update user by id
const updateUser = async(id, updatedUser) => {
    const response = await api.put(`/users/${id}`, updatedUser)

    return response.data
}

 export {getUsers, deleteUser, addUser, updateUser}