import { useEffect, useState } from 'react'

let showFn = null

export function notify(message) {
  showFn?.(message)
}

export default function Notification() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    showFn = (msg) => {
      setMessage(msg)
      setVisible(true)
      window.clearTimeout(showFn._timer)
      showFn._timer = window.setTimeout(() => setVisible(false), 2000)
    }
    return () => {
      showFn = null
    }
  }, [])

  return (
    <div className={`custom-notification${visible ? ' show' : ''}`}>{message}</div>
  )
}
