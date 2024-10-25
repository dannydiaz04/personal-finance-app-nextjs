'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransparent, setIsTransparent] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsTransparent(true)
      } else {
        setIsTransparent(false)
      }
    }

    const handleMouseEnter = () => {
      setIsTransparent(false)
    }

    const handleMouseLeave = () => {
      if (window.scrollY > 10) {
        setIsTransparent(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    navRef.current?.addEventListener('mouseenter', handleMouseEnter)
    navRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      navRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      navRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    if (response.ok) {
      router.push('/login')
    }
  }

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isTransparent ? 'bg-transparent' : 'bg-opacity-30 bg-blue-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded={isOpen}
              >
                <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={menuRef}
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
          } fixed top-16 right-0 bottom-0 w-64 bg-opacity-80 bg-blue-900 shadow-lg overflow-y-auto`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/home" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition duration-150 ease-in-out">
              Home
            </Link>
            <Link href="/manage-categories" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition duration-150 ease-in-out">
              Manage Categories
            </Link>
            <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition duration-150 ease-in-out">
              Dashboard
            </Link>
            <Link href="/expenses" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition duration-150 ease-in-out">
              Expenses
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" aria-hidden="true" onClick={toggleMenu} />
      )}
    </>
  )
}
