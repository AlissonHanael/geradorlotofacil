export default function headers() {
  // pega o valor do token de autorização do local storage.
  const token = localStorage.getItem('token')

  //define as headers e passa o token como parametro de autorização para post.
  if (token != null && token !== undefined) {
    const headers = {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json'
    }
    return headers
  }
}
