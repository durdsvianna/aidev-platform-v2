# AI Development Platform - User Guide

This user guide provides step-by-step instructions for using the AI Development Platform application effectively.

## Table of Contents

1. [Accessing the Application](#accessing-the-application)
2. [Navigation Options](#navigation-options)
3. [Managing Profiles](#managing-profiles)
4. [Managing Stacks](#managing-stacks)
5. [Managing Technologies](#managing-technologies)
6. [Using AI Assistant](#using-ai-assistant)
7. [Managing Prompts](#managing-prompts)
8. [User Settings](#user-settings)
9. [Troubleshooting](#troubleshooting)

## Accessing the Application

To access the AI Development Platform:

1. Open your preferred web browser
2. Navigate to the application URL (e.g., `http://localhost:3000` for local development)
3. The application will load the homepage with the default layout

## Navigation Options

The application offers two layout options:

### Base Layout (Clean/Minimalist)

The Base Layout provides a clean, minimalist interface:

1. **Accessing Base Layout**:
   - Navigate to `/home`, `/projects`, or `/admin/profile`
   - The layout features a top navigation bar without a sidebar

2. **Base Layout Navigation**:
   - Click the **Home** link to access the home page
   - Click the **Projects** link to view and manage AI projects
   - Click your profile icon to access profile settings

### Sidebar Layout (Dashboard)

The Sidebar Layout provides a dashboard-like experience:

1. **Accessing Sidebar Layout**:
   - Navigate to any page with the `/sidelayout/` prefix
   - The layout features a left sidebar for navigation

2. **Sidebar Navigation**:
   - Click **Dashboard** to view the main dashboard
   - Click **AI Assistant** to access the AI chat interface
   - Click **Profiles** to manage developer profiles
   - Click **Technologies** to manage tech stack components
   - Click **Stacks** to manage technology stacks
   - Click **Prompts** to manage AI prompts
   - Click **Users** to manage user accounts
   - Click **Settings** to access application settings

## Managing Profiles

Profiles represent developer profiles in the system.

### Viewing All Profiles

1. Navigate to `/sidelayout/profiles`
2. The Profiles page displays all available profiles in a table
3. Use the search box to filter profiles by name
4. Click on a profile name to view its details

### Creating a New Profile

1. Navigate to `/sidelayout/profiles`
2. Click the **+ New Profile** button
3. Complete the profile form:
   - **Name**: Enter the profile name
   - **Description**: Enter a description
   - **Stacks**: Select one or more technology stacks from the dropdown
4. Click **Save** to create the profile

### Viewing Profile Details

1. Navigate to `/sidelayout/profiles`
2. Click on a profile name in the table
3. The Profile Detail page displays:
   - Profile name and description
   - Associated technology stacks
   - Creation and last update dates
   - Options to edit or delete the profile

### Editing a Profile

1. Navigate to the Profile Detail page
2. Click the **Edit Profile** button
3. Update the profile information
4. Modify the selected stacks by checking/unchecking options in the dropdown
5. Click **Save** to update the profile

### Deleting a Profile

1. Navigate to the Profile Detail page
2. Click the **Delete Profile** button
3. Confirm the deletion in the confirmation dialog
4. The profile will be permanently deleted

## Managing Stacks

Stacks represent technology stacks that combine multiple technologies.

### Viewing All Stacks

1. Navigate to `/sidelayout/stacks`
2. The Stacks page displays all available stacks in a table
3. Use the search box to filter stacks by name
4. Click on a stack name to view its details

### Creating a New Stack

1. Navigate to `/sidelayout/stacks`
2. Click the **+ New Stack** button
3. Complete the stack form:
   - **Name**: Enter the stack name
   - **Code**: Enter a unique code for the stack
   - **Technologies**: Select one or more technologies from the dropdown
   - **Profiles**: Select one or more profiles to associate with this stack
4. Click **Save** to create the stack

### Viewing Stack Details

1. Navigate to `/sidelayout/stacks`
2. Click on a stack name in the table
3. The Stack Detail page displays:
   - Stack name and code
   - Associated technologies
   - Profiles using this stack
   - Creation and last update dates
   - Options to edit or delete the stack

### Editing a Stack

1. Navigate to the Stack Detail page
2. Click the **Edit Stack** button
3. Update the stack information
4. Modify the technologies and profiles by checking/unchecking options
5. Click **Save** to update the stack

### Deleting a Stack

1. Navigate to the Stack Detail page
2. Click the **Delete Stack** button
3. Confirm the deletion in the confirmation dialog
4. The stack will be permanently deleted

## Managing Technologies

Technologies represent individual technologies that can be combined into stacks.

### Viewing All Technologies

1. Navigate to `/sidelayout/technologies`
2. The Technologies page displays all available technologies in a table
3. Use the search box to filter technologies by name
4. Click on a technology name to view its details

### Creating a New Technology

1. Navigate to `/sidelayout/technologies`
2. Click the **+ New Technology** button
3. Complete the technology form:
   - **Name**: Enter the technology name
   - **Description**: Enter a description
   - **Category**: Select a category (e.g., Frontend, Backend, Database)
4. Click **Save** to create the technology

### Editing a Technology

1. Navigate to the Technology Detail page
2. Click the **Edit Technology** button
3. Update the technology information
4. Click **Save** to update the technology

## Using AI Assistant

The AI Assistant provides intelligent conversational assistance for development tasks.

### Accessing AI Assistant

1. Navigate to `/sidelayout/ai-assistant`
2. The AI Assistant interface will appear with a chat window

### Configuring AI Models

1. Click the **Settings** button in the AI Assistant interface
2. Select your preferred AI model from the dropdown
3. You can choose from models like:
   - GPT-4
   - Claude 3
   - Other available models
4. Configuration changes are applied immediately

### Creating a Chat Session

1. Enter your question or request in the input field
2. Press Enter or click the Send button
3. The AI Assistant will process your request and respond
4. Continue the conversation by typing additional messages

### Saving Prompts

1. After receiving a useful response in the AI Assistant
2. Click the **Save Prompt** button next to the message
3. Enter a name and optional description for the prompt
4. Click **Save** to store the prompt for future use

## Managing Prompts

Prompts allow you to save and reuse AI interaction patterns.

### Viewing All Prompts

1. Navigate to `/sidelayout/prompts`
2. The Prompts page displays all saved prompts in a table
3. Use the search box to filter prompts by name
4. Click on a prompt name to view its details

### Creating a New Prompt

1. Navigate to `/sidelayout/prompts`
2. Click the **+ New Prompt** button
3. Complete the prompt form:
   - **Name**: Enter a descriptive name
   - **Content**: Enter the prompt content/text
   - **Description**: Add an optional description
   - **Tags**: Add optional tags for categorization
4. Click **Save** to create the prompt

### Using a Saved Prompt

1. Navigate to the Prompt Detail page
2. Click the **Use in AI Assistant** button
3. The system will navigate to the AI Assistant with the prompt pre-loaded
4. Click Send to execute the prompt

## User Settings

### Viewing Your Profile

1. Click your user icon in the top navigation bar
2. Select **Profile** from the dropdown menu
3. Your profile page will display:
   - User information
   - Account settings
   - API key management (if applicable)

### Editing Your Profile

1. Navigate to your profile page
2. Click the **Edit Profile** button
3. Update your information
4. Click **Save** to apply changes

### Managing API Keys

1. Navigate to `/sidelayout/settings/models`
2. The AI Models page displays all configured AI service providers
3. To add a new API key:
   - Click **Add API Key**
   - Select the provider (OpenAI, Anthropic, etc.)
   - Enter your API key
   - Click **Save**
4. To update an existing API key:
   - Click the Edit button next to the provider
   - Update the API key
   - Click **Save**

## Troubleshooting

### Common Issues

#### Profiles or Stacks Not Loading

- Check your internet connection
- Refresh the page
- Ensure MongoDB is running (for local development)

#### Form Submission Errors

- Ensure all required fields are filled
- Check that data formats are correct
- Look for validation error messages

#### Navigation Issues

- Verify you're using the correct URL format
- Ensure the server is running
- Try clearing your browser cache if links don't work

### Getting Help

- Check the browser console for error messages
- Refer to the `README.md` file for setup instructions
- File an issue on the project repository with:
  - Description of the problem
  - Steps to reproduce
  - Expected vs. actual behavior
  - Browser and OS information 