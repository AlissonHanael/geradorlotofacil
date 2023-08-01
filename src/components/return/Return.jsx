import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const Return = () => {
  const [response, setResponse] = useState({})

  async function getReturn() {
    try {
      const apiResponse = await api.get(`/latest`)
      setResponse(apiResponse.data)
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    getReturn()
  }, [])

  console.log(response)

  return (
    <div className="m-8">
      <h1>Dezenas sorteadas</h1>
      {Array.isArray(response.dezenas) ? (
        response.dezenas.map(dezena => (
          <div className="" key={dezena}>
            {dezena}
          </div>
        ))
      ) : (
        <div>Nenhum dado disponível.</div>
      )}
    </div>
  )
}

export default Return
