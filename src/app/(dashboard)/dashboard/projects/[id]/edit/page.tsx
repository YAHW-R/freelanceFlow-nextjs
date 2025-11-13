'use client'
import { useEffect, useState } from 'react'
import { getProjectById, updateProject } from '@/app/actions/projectsActions'
import { getClients } from '@/app/actions/clientActions'
import { type Project, type Client } from '@/lib/types'
import { useParams, useRouter } from 'next/navigation'

export default function EditProjectPage() {
    const [project, setProject] = useState<Project | null>(null)
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    useEffect(() => {
        async function fetchData() {
            try {
                const [projectData, clientsData] = await Promise.all([
                    getProjectById(id),
                    getClients()
                ])

                if (projectData) {
                    setProject(projectData)
                } else {
                    setError('Project not found')
                }
                setClients(clientsData)
            } catch (err) {
                console.error('Failed to fetch project data', err)
                setError('Failed to fetch data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!project) return
        const { name, value } = e.target
        setProject({ ...project, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!project) return

        try {
            await updateProject(id, project)
            router.push(`/dashboard/projects/${id}`)
        } catch (err) {
            console.error('Failed to update project', err)
            setError('Failed to update project')
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!project) {
        return <div>Project not found.</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={project.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">Client</label>
                    <select
                        name="client_id"
                        id="client_id"
                        value={project.client_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        id="status"
                        value={project.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="in_pause">In Pause</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        value={project.description || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
                    <input
                        type="number"
                        name="budget"
                        id="budget"
                        value={project.budget || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="start_data" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        name="start_data"
                        id="start_data"
                        value={project.start_data ? new Date(project.start_data).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        name="due_date"
                        id="due_date"
                        value={project.due_date ? new Date(project.due_date).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="billing_type" className="block text-sm font-medium text-gray-700">Billing Type</label>
                    <select
                        name="billing_type"
                        id="billing_type"
                        value={project.billing_type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="hourly">Hourly</option>
                        <option value="fixed_price">Fixed Price</option>
                    </select>
                </div>

                {project.billing_type === 'hourly' && (
                    <div>
                        <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                        <input
                            type="number"
                            name="hourly_rate"
                            id="hourly_rate"
                            value={project.hourly_rate || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 bg-background-secondary border border-background-secondary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                )}

                <div className="flex justify-end">
                    <button type="button" onClick={() => router.back()} className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
