'use client'

import { ReactNode } from "react"
import { Scrollbars } from "react-custom-scrollbars-2"

interface ScrollbarProps {
  className?: string
  children?: ReactNode
}

export default function Scrollbar({ className, children, ...rest }: ScrollbarProps) {
  return (
    <Scrollbars
      autoHide
      renderThumbVertical={() => {
        return (
          <div className="w-1.5 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors" />
        )
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  )
}
