# Document Impact Analysis Platform

A web application for analyzing the impact of product requirement documents (PRDs) against existing knowledge bases using AWS Bedrock LLMs.

## Features

- Upload and analyze PRD documents to assess their impact on existing systems
- AI-powered analysis with AWS Bedrock's foundation models
- Identify affected business areas and potential conflicts
- Create and manage tasks directly from impact analysis results
- Visualize document relationships and dependencies
- Interactive chat interface for document-specific queries

## Tech Stack

- **Frontend**: React with TypeScript, TailwindCSS, and Shadcn UI components
- **Backend**: Express.js server with in-memory storage
- **AI Integration**: AWS Bedrock API (Claude model)
- **Task Management**: Google Drive API integration

## Dashboard Features

- **Impact Analysis**: View detailed impact assessments by area with severity levels
- **Related Documents**: Discover connections to existing documentation
- **Task Management**: Create and track follow-up tasks from analysis findings
- **Document Relationships**: Interactive graph visualization of document connections

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open the application at http://localhost:5000

## Environment Variables

The application requires the following environment variables:

- `AWS_ACCESS_KEY_ID` - AWS access key for Bedrock API
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key for Bedrock API
- `GOOGLE_API_KEY` - Google API key for Drive integration

## Demo

A visual preview of the dashboard can be accessed at the `/preview` route.