import React from 'react'
import { render, screen, within } from '@testing-library/react'
import PromptsPage from '../page'
import { promptService, stackService } from '@/lib/services'
import Stack from '@/models/Stack'
import Prompt from '@/models/Prompt'

// Mock the services
jest.mock('@/lib/services', () => ({
  promptService: {
    getByStack: jest.fn(),
    incrementCopyCount: jest.fn(),
    delete: jest.fn()
  },
  stackService: {
    getAll: jest.fn()
  }
}))

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('PromptsPage', () => {
  const mockStack = new Stack({
    id: 'stack1',
    name: 'Test Stack',
    code: 'TEST',
    technologies: []
  })

  const mockPrompts = [
    new Prompt({
      id: 'prompt1',
      title: 'Test Prompt 1',
      description: 'Description 1',
      stack: mockStack,
      copyCount: 5
    }),
    new Prompt({
      id: 'prompt2',
      title: 'Test Prompt 2',
      description: 'Description 2',
      copyCount: 2
    })
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(stackService.getAll as jest.Mock).mockReturnValue([mockStack])
    ;(promptService.getByStack as jest.Mock).mockReturnValue(mockPrompts)
  })

  it('should render the prompts page with prompts', () => {
    render(<PromptsPage />)
    
    // Check for page title
    expect(screen.getByText('Prompts')).toBeInTheDocument()
    
    // Check for "New Prompt" button
    expect(screen.getByText('New Prompt')).toBeInTheDocument()
    
    // Check for filter and search inputs
    expect(screen.getByLabelText('Filter by Stack')).toBeInTheDocument()
    expect(screen.getByLabelText('Search Prompts')).toBeInTheDocument()
    
    // Check for prompt items
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test Prompt 2')).toBeInTheDocument()
    
    // Check for stack name in the table
    const tableRows = screen.getAllByRole('row')
    expect(tableRows.length).toBeGreaterThan(1) // Header row + at least one data row
    
    // Find the row with 'Test Prompt 1'
    const firstRow = tableRows.find(row => 
      within(row).queryByText('Test Prompt 1') !== null
    )
    expect(firstRow).toBeDefined()
    expect(within(firstRow!).getByText('Test Stack')).toBeInTheDocument()
    
    // Find the row with 'Test Prompt 2'
    const secondRow = tableRows.find(row => 
      within(row).queryByText('Test Prompt 2') !== null
    )
    expect(secondRow).toBeDefined()
    expect(within(secondRow!).getByText('No Stack')).toBeInTheDocument()
    
    // Check for copy counts
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should render empty state when no prompts are available', () => {
    ;(promptService.getByStack as jest.Mock).mockReturnValue([])
    
    render(<PromptsPage />)
    
    expect(screen.getByText('No prompts found. Create your first prompt!')).toBeInTheDocument()
  })
}) 