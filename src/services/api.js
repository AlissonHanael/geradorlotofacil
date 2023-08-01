import axios from 'axios'

const baseURL = 'https://loteriascaixa-api.herokuapp.com/api/lotofacil'

const api = axios.create({
  baseURL
})

export default api
