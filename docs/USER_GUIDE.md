# Task Manager User Guide

This user guide provides step-by-step instructions for using the Task Manager application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigation](#navigation)
3. [Managing Tasks](#managing-tasks)
4. [User Profile](#user-profile)
5. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Application

You can access the Task Manager application in two ways:

1. **Base Layout**: A clean, minimal interface
   - URL: `http://localhost:3000/`

2. **Sidebar Layout**: A dashboard-like experience with navigation sidebar
   - URL: `http://localhost:3000/sidelayout/dashboard`

### Choosing a Layout

- For a clean, minimal experience: Use the base layout
- For a dashboard-like experience with quick navigation: Use the sidebar layout

Both layouts provide access to the same features and functionality but with different navigation experiences.

## Navigation

### Base Layout Navigation

In the base layout, navigation is provided through the top header bar:

1. **Header Menu**: Click on the menu icon in the top right to access different sections
2. **Direct URLs**:
   - Home: `/home`
   - Tasks: `/tasks`
   - Create Task: `/tasks/create`
   - User Profile: `/admin/profile`

### Sidebar Layout Navigation

The sidebar layout provides a persistent navigation panel on the left side:

1. **Dashboard**: Overview of the application
2. **Home**: Home page
3. **User Management**: 
   - User List
   - User Profile
4. **Task Management**:
   - All Tasks
   - Create Task
5. **Settings**: Application settings

On mobile devices, the sidebar can be toggled by clicking the menu icon in the top left corner.

## Managing Tasks

### Viewing Tasks

1. Navigate to the Tasks page:
   - Base Layout: Click "Tasks" in the header menu or go to `/tasks`
   - Sidebar Layout: Click "All Tasks" in the sidebar or go to `/sidelayout/tasks`

2. The Tasks page displays a list of all tasks with the following information:
   - Task title and description
   - Company
   - Reward amount
   - Due date
   - Status
   - Actions (View, Edit)

3. **Filtering Tasks**:
   - Use the search box to search by title, description, or company
   - Use the status dropdown to filter by status (Open, In Progress, Completed)
   - Use the tag dropdown to filter by specific tags

### Creating a New Task

1. Navigate to the Create Task page:
   - Base Layout: Click "Create Task" button on the Tasks page or go to `/tasks/create`
   - Sidebar Layout: Click "Create Task" in the sidebar or go to `/sidelayout/tasks/create`

2. Fill in the task details:
   - **Title**: Enter a descriptive title (required)
   - **Company**: Enter the company name (required)
   - **Description**: Provide detailed information about the task (required)
   - **Reward**: Enter the reward amount (required, must be a positive number)
   - **Due Date**: Select the deadline for the task (required)
   - **Tags**: Add relevant tags (optional, separate with commas)
   - **Status**: Select the initial status (defaults to "Open")

3. Click "Create Task" to submit the form.

4. If successful, you'll be redirected to the task list with a success notification.

### Viewing Task Details

1. From the task list, click "View" on any task.

2. The Task Detail page displays:
   - All task information
   - Status and tags
   - Creation and due dates
   - Options to edit or delete the task

### Editing a Task

1. Access the Edit Task page in one of these ways:
   - From the task list, click "Edit" on the task
   - From the task detail page, click the "Edit" button
   - Go directly to `/tasks/[id]/edit` or `/sidelayout/tasks/[id]/edit`

2. Update the task details as needed.

3. Click "Update Task" to save your changes.

### Deleting a Task

1. From the task detail page, click the "Delete" button.

2. Confirm the deletion in the confirmation dialog.

3. If successful, you'll be redirected to the task list with a confirmation message.

## User Profile

### Viewing Your Profile

1. Navigate to the User Profile page:
   - Base Layout: Click your user icon in the header or go to `/admin/profile`
   - Sidebar Layout: Click "User Profile" in the sidebar or go to `/sidelayout/admin/profile`

2. The User Profile page displays:
   - Profile information
   - Profile picture
   - Bio and contact details

### Editing Your Profile

1. On the User Profile page, click "Edit Profile".

2. Update your profile information.

3. Click "Save Changes" to update your profile.

## Troubleshooting

### Common Issues

#### Tasks Not Loading

If tasks don't load:

1. Check your internet connection
2. Refresh the page
3. Ensure MongoDB is running (if using local development)

#### Form Submission Errors

If you encounter errors when submitting forms:

1. Check that all required fields are filled in
2. Ensure the data format is correct (e.g., numbers for reward)
3. Check for any validation error messages

#### Navigation Issues

If links don't work or pages don't load:

1. Ensure you're using the correct URL format
2. Check that the server is running
3. Clear your browser cache and try again

### Getting Help

If you continue to experience issues:

1. Check the console for error messages (F12 in most browsers)
2. Refer to the [README.md](../README.md) for setup instructions
3. File an issue on the project repository with detailed information about the problem 