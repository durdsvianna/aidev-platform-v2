import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PromptForm from '../PromptForm'
import { promptService, stackService, userService } from '@/lib/services'
import Stack from '@/models/Stack'
import Prompt from '@/models/Prompt'

// Mock the services
jest.mock('@/lib/services', () => ({
  promptService: {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  stackService: {
    getAll: jest.fn()
  },
  userService: {
    getCurrentUser: jest.fn()
  }
}))

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation(param => {
      if (param === 'description') return null;
      return null;
    })
  })
}))

// Mock the useEffect to prevent infinite loops
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useEffect: jest.fn().mockImplementation((callback, deps) => {
      // Call the callback only once
      originalReact.useEffect(() => {
        callback();
      }, []);
    })
  };
});

describe('PromptForm', () => {
  const mockStack = new Stack({
    id: 'stack1',
    name: 'Test Stack',
    code: 'TEST',
    technologies: []
  })

  const mockPrompt = new Prompt({
    id: 'prompt1',
    title: 'Test Prompt',
    description: 'Test Description',
    stack: mockStack,
    copyCount: 0
  })

  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(stackService.getAll as jest.Mock).mockReturnValue([mockStack])
    ;(userService.getCurrentUser as jest.Mock).mockReturnValue({ id: 'user1' })
  })

  it('should render the form in create mode', () => {
    render(<PromptForm onCancel={mockOnCancel} />)
    
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stack/i)).toBeInTheDocument()
    expect(screen.getByText(/Create Prompt/i)).toBeInTheDocument()
  })

  it('should render the form in edit mode with prompt data', async () => {
    ;(promptService.getById as jest.Mock).mockReturnValue(mockPrompt)
    
    render(<PromptForm promptId="prompt1" onCancel={mockOnCancel} />)
    
    // Wait for the form to load with the mock data
    await waitFor(() => {
      expect(promptService.getById).toHaveBeenCalledWith('prompt1')
    })
  })

  it('should validate required fields', async () => {
    render(<PromptForm onCancel={mockOnCancel} />)
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByText(/Create Prompt/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument()
    })
    
    // promptService.create should not be called
    expect(promptService.create).not.toHaveBeenCalled()
  })

  it('should create a new prompt when form is valid', async () => {
    ;(promptService.create as jest.Mock).mockImplementation(data => ({
      ...data,
      id: 'new-prompt-id'
    }))
    
    render(<PromptForm onCancel={mockOnCancel} />)
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'New Prompt' }
    })
    
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'New Description' }
    })
    
    // Submit the form
    fireEvent.click(screen.getByText(/Create Prompt/i))
    
    await waitFor(() => {
      expect(promptService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Prompt',
          description: 'New Description',
          createdBy: 'user1'
        })
      )
    })
  })

  it('should update an existing prompt when form is valid', async () => {
    ;(promptService.getById as jest.Mock).mockReturnValue(mockPrompt)
    ;(promptService.update as jest.Mock).mockImplementation((id, data) => ({
      ...mockPrompt,
      ...data
    }))
    
    render(<PromptForm promptId="prompt1" onCancel={mockOnCancel} />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Prompt')).toBeInTheDocument()
    })
    
    // Change the title
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Updated Prompt' }
    })
    
    // Submit the form
    fireEvent.click(screen.getByText('Update Prompt'))
    
    await waitFor(() => {
      expect(promptService.update).toHaveBeenCalledWith(
        'prompt1',
        expect.objectContaining({
          title: 'Updated Prompt',
          description: 'Test Description'
        })
      )
    })
  })

  it('should call onCancel when cancel button is clicked', () => {
    render(<PromptForm onCancel={mockOnCancel} />)
    
    fireEvent.click(screen.getByText(/Cancel/i))
    
    expect(mockOnCancel).toHaveBeenCalled()
  })
}) 