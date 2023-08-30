import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const History = () => {
  const [concursosAnteriores, setConcursosAnteriores] = useState([])
  const [loading, setLoading] = useState(false)
  const [keysWithMaxValue, setKeysWithMaxValue] = useState([])
  const [jogoGerado, setJogoGerado] = useState([])

  async function getConcurso(concurso) {
    try {
      setLoading(true)
      const res = await api.get(`${concurso}`)
      return res.data
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await api.get('latest')
        const latestConcurso = res.data.concurso
        let concurso = latestConcurso - 7
        const concursosArray = []
        let concursoDezenas = []

        while (concurso <= latestConcurso) {
          const concursoData = await getConcurso(concurso)
          concursosArray.push(concursoData)
          concursoDezenas = concursoDezenas.concat(concursoData.dezenas)
          concurso++
        }
        const counter = {}
        for (const str of concursoDezenas) {
          counter[str] = (counter[str] || 0) + 1
        }
        function getKeysWithMaxValue(obj, count) {
          const sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a])
          return sortedKeys.slice(0, count)
        }
        const keysWithMaxValue = getKeysWithMaxValue(counter, 8)
        setKeysWithMaxValue(keysWithMaxValue.sort())
        setConcursosAnteriores(concursosArray)
      } catch (err) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function gerarJogo() {
    const jogoGerado = new Set() // Usamos um Set para rastrear as strings únicas geradas

    while (jogoGerado.size < 7) {
      // Gere 7 strings únicas
      let random = Math.floor(Math.random() * 25 + 1)
      if (random < 10) {
        random = `0${random}`
      } else {
        random = random.toString()
      }
      jogoGerado.add(random)
    }

    const conjunto = new Set(jogoGerado)

    for (const key of keysWithMaxValue) {
      if (!conjunto.has(key)) {
        conjunto.add(key.toString())
      } else {
        let newRandom
        do {
          newRandom = Math.floor(Math.random() * 25 + 1)
          if (newRandom < 10) {
            newRandom = `0${newRandom}`
          } else {
            newRandom = newRandom.toString()
          }
        } while (conjunto.has(newRandom))
        conjunto.add(newRandom)
      }
    }

    const jogoCompleto = [...conjunto].sort()
    setJogoGerado(jogoCompleto)
  }

  return (
    <div>
      {!loading && concursosAnteriores.length > 0 ? (
        <div className="flex flex-col w-full text-center">
          <table className="w-[50%] m-auto border">
            <tr className="border">
              <th>Concurso</th>
              <th>Dezenas</th>
              <th>Data</th>
            </tr>
            {concursosAnteriores.map(concurso => (
              <tr key={concurso.concurso}>
                <td>{concurso.concurso}</td>
                <td className="flex justify-center">
                  {concurso.dezenas.map(dezena => (
                    <li className="pr-2" key={dezena}>
                      {dezena}
                    </li>
                  ))}
                </td>
                <td>{concurso.data}</td>
              </tr>
            ))}
          </table>
          Números mais repetidos nos últimos 7 jogos:{' '}
          {keysWithMaxValue.join(' ')}
          <button onClick={gerarJogo}>Gerar jogo</button>
          {jogoGerado.length > 0 && (
            <div>Jogo gerado: {jogoGerado.join(' ')}</div>
          )}
        </div>
      ) : (
        <p>Carregando</p>
      )}
    </div>
  )
}

export default History
