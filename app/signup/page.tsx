'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to sign up')
      }

      // Add success alert
      alert('Signup successful! Your profile is now created, redirecting to the login page!')
      router.push('/login')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-300">Sign up to get started</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="first-name" className="sr-only">First Name</label>
              <input 
                id="first-name" 
                name="first_name" 
                type="text" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50 transition-colors duration-200 ease-in-out hover:bg-opacity-75" 
                placeholder="First Name" 
              />
            </div>
            <div>
              <label htmlFor="last-name" className="sr-only">Last Name</label>
              <input 
                id="last-name" 
                name="last_name" 
                type="text" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50 transition-colors duration-200 ease-in-out hover:bg-opacity-75" 
                placeholder="Last Name" 
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50 transition-colors duration-200 ease-in-out hover:bg-opacity-75" 
                placeholder="Email address" 
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50 transition-colors duration-200 ease-in-out hover:bg-opacity-75" 
                placeholder="Password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" /> : 
                  <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                }
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div>
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-300">
            Already have an account? {' '}
            <Link href="/login" className="font-medium text-blue-300 hover:text-blue-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}