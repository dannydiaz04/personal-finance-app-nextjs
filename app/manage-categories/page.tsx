'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ManageCategories from '@/app/components/ManageCategories'
import Navbar from '@/app/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManageCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
        <div className="text-white text-2xl animate-pulse">Loading your category management...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin')
    return null
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <Navbar />
      <main className="pt-20 text-white p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Organizing your financial categories, {session?.user?.name || 'financial wizard'}
            </p>
          </div>

          <Card className="bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm border border-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-white">Category Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ManageCategories />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}