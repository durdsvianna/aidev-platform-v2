'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaUsers, 
  FaClipboardList, 
  FaLayerGroup, 
  FaMicrochip, 
  FaUserTag,
  FaChartBar,
  FaRobot
} from 'react-icons/fa'
import { 
  promptService, 
  stackService, 
  technologyService, 
  profileService, 
  userService,
  aiModelService 
} from '@/lib/services'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    promptCount: 0,
    stackCount: 0,
    technologyCount: 0,
    profileCount: 0,
    modelCount: 0
  })
  const [mostCopiedPrompts, setMostCopiedPrompts] = useState<any[]>([])
  const [mostUsedStacks, setMostUsedStacks] = useState<any[]>([])
  const [aiModels, setAiModels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get counts
        const users = userService.getAll()
        const prompts = promptService.getAll()
        const stacks = stackService.getAll()
        const technologies = technologyService.getAll()
        const profiles = profileService.getAll()
        const models = await aiModelService.getAll()

        setStats({
          userCount: users.length,
          promptCount: prompts.length,
          stackCount: stacks.length,
          technologyCount: technologies.length,
          profileCount: profiles.length,
          modelCount: models.length
        })

        // Get most copied prompts
        const topPrompts = promptService.getMostCopied(5)
        setMostCopiedPrompts(topPrompts)

        // Get most recent stacks (replacing the removed getMostUsed method)
        const allStacks = stackService.getAll()
        // Sort by updated date, newest first and take the first 5
        const topStacks = allStacks
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5)
        setMostUsedStacks(topStacks)

        // Set AI models
        setAiModels(models)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full px-2 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Overview of the AIDev Platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard 
          title="Users" 
          count={stats.userCount} 
          icon={<FaUsers className="h-6 w-6 text-blue-500" />} 
          href="/sidelayout/admin/users"
        />
        <StatCard 
          title="Prompts" 
          count={stats.promptCount} 
          icon={<FaClipboardList className="h-6 w-6 text-green-500" />} 
          href="/sidelayout/prompts"
        />
        <StatCard 
          title="Stacks" 
          count={stats.stackCount} 
          icon={<FaLayerGroup className="h-6 w-6 text-purple-500" />} 
          href="/sidelayout/admin/stacks"
        />
        <StatCard 
          title="Technologies" 
          count={stats.technologyCount} 
          icon={<FaMicrochip className="h-6 w-6 text-yellow-500" />} 
          href="/sidelayout/admin/technologies"
        />
        <StatCard 
          title="Profiles" 
          count={stats.profileCount} 
          icon={<FaUserTag className="h-6 w-6 text-red-500" />} 
          href="/sidelayout/admin/profiles"
        />
        <StatCard 
          title="AI Models" 
          count={stats.modelCount} 
          icon={<FaRobot className="h-6 w-6 text-indigo-500" />} 
          href="/sidelayout/settings/models"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Most Copied Prompts */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
            <div className="flex items-center">
              <FaChartBar className="mr-2 h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Most Copied Prompts</h2>
            </div>
          </div>
          <div className="p-4">
            {mostCopiedPrompts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No prompts have been copied yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {mostCopiedPrompts.map(prompt => (
                  <li key={prompt.id} className="py-3">
                    <Link 
                      href={`/sidelayout/prompts/${prompt.id}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <p className="font-medium text-gray-900 dark:text-white">{prompt.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {prompt.stack?.name || 'No Stack'}
                          </p>
                        </div>
                        <div className="ml-2 flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {prompt.copyCount} copies
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Most Used Stacks */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
            <div className="flex items-center">
              <FaLayerGroup className="mr-2 h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Most Used Stacks</h2>
            </div>
          </div>
          <div className="p-4">
            {mostUsedStacks.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No stacks have been created yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {mostUsedStacks.map(stack => (
                  <li key={stack.id} className="py-3">
                    <Link 
                      href={`/sidelayout/admin/stacks/${stack.id}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{stack.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {stack.technologies.length} technologies
                          </p>
                        </div>
                        <div className="ml-2 flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {stack.code}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* AI Models Section */}
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaRobot className="mr-2 h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">AI Models</h2>
            </div>
            <Link
              href="/sidelayout/settings/models"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Manage Models
            </Link>
          </div>
        </div>
        <div className="p-4">
          {aiModels.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No AI models have been configured.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Provider</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Model</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {aiModels.map((model, index) => (
                    <tr key={model._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">{model.name}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400">{model.provider}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {model.defaultParameters?.model || 'Default'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          model.active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {model.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  count: number
  icon: React.ReactNode
  href: string
}

function StatCard({ title, count, icon, href }: StatCardProps) {
  return (
    <Link 
      href={href}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center">
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
        </div>
      </div>
    </Link>
  )
} 