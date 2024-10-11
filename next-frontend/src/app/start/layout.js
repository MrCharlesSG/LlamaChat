import StartNavigationClient from '@/components/client/start/navigation/StartNavigationClient'
import React from 'react'

function StartLayout({children}) {
  return (
    <div className=" scroll-smooth">
    <StartNavigationClient />
    <div className="w-full">{children}</div>
    </div>
  )
}

export default StartLayout