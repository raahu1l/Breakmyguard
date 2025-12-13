'use client'
import { useEffect, useState } from 'react'

export function usePlayer() {
  const [playerId, setPlayerId] = useState(null)

  useEffect(() => {
    let id = localStorage.getItem('player_id')

    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('player_id', id)

      fetch('/api/player/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ playerId: id })
      })
    }

    setPlayerId(id)
  }, [])

  return playerId
}
