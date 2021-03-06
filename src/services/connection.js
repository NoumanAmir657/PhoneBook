import axios from 'axios'
const baseUrl = '/api/persons'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const config = {
    headers: {Authorization: token},
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const del = (id) => {
  axios.delete(`${baseUrl}/${id}`)
}


export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  del: del,
  setToken: setToken
}