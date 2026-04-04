'use client'
import { useEffect, useState } from 'react'

function getInitialPlayerState() {
  if (typeof window === 'undefined') {
    return { id: null, isNew: false }
  }

  let id = localStorage.getItem('player_id')
  let isNew = false

  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('player_id', id)
    isNew = true
  }

  return { id, isNew }
}

export function usePlayer() {
  const [playerState] = useState(getInitialPlayerState)

  useEffect(() => {
    if (!playerState.isNew || !playerState.id) return

    fetch('/api/player/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ playerId: playerState.id })
    })
  }, [playerState.id, playerState.isNew])

  return playerState.id
}
