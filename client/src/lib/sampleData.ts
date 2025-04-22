import { ImpactArea, RelatedDocument, AnalysisResponse } from './types';

export const sampleImpactAreas: ImpactArea[] = [
  {
    name: "Authentication Service",
    impactLevel: "High",
    description: "The proposed changes to the user signup flow will significantly impact the authentication service. Updates to password requirements and 2FA integration require coordination.",
    conflict: "Current OAuth implementation does not support the suggested password complexity requirements.",
    contact: {
      name: "Sarah Johnson",
      title: "Auth Team Lead",
      email: "sarah.johnson@example.com"
    }
  },
  {
    name: "User Management API",
    impactLevel: "Medium",
    description: "The user profile updates described in the PRD will require modifications to several API endpoints in the User Management service.",
    recommendation: "Coordinate with the User Management team to ensure backward compatibility for existing clients.",
    contact: {
      name: "Michael Chen",
      title: "API Team Lead",
      email: "michael.chen@example.com"
    }
  },
  {
    name: "Dashboard UI",
    impactLevel: "Low",
    description: "The proposed changes include minor updates to the user dashboard UI to accommodate new profile sections.",
    contact: {
      name: "Jessica Park",
      title: "UI Design Lead",
      email: "jessica.park@example.com"
    }
  },
  {
    name: "Notification System",
    impactLevel: "Medium",
    description: "New notification types will need to be supported for the enhanced user actions described in the PRD.",
    conflict: "The proposed real-time notifications may exceed current system capacity during peak usage.",
    contact: {
      name: "David Rodriguez",
      title: "Notifications Team Lead",
      email: "d.rodriguez@example.com"
    }
  }
];

export const sampleRelatedDocuments: RelatedDocument[] = [
  {
    title: "Authentication Service Design Document",
    type: "Design",
    lastUpdated: "2023-12-15",
    tags: ["authentication", "security", "user-management", "api"]
  },
  {
    title: "User Management API Specification v2.3",
    type: "Tech Spec",
    lastUpdated: "2024-01-22",
    tags: ["api", "user-management", "rest", "documentation"]
  },
  {
    title: "Dashboard Redesign Research",
    type: "Research",
    lastUpdated: "2024-02-10",
    tags: ["ui", "ux", "dashboard", "research"]
  },
  {
    title: "Notification System Architecture",
    type: "Tech Spec",
    lastUpdated: "2023-11-05",
    tags: ["notifications", "architecture", "real-time", "websockets"]
  },
  {
    title: "GDPR Compliance Requirements",
    type: "Legal",
    lastUpdated: "2023-10-20",
    tags: ["legal", "compliance", "user-data", "privacy"]
  }
];

// Convert the sample analysis data to be compatible with our schema
export const sampleAnalysisResponse = {
  id: 123,
  documentId: 1,
  impactLevel: "Medium",
  impactedAreas: sampleImpactAreas,
  relatedDocuments: sampleRelatedDocuments,
  analysisDate: new Date("2024-04-22T15:30:00Z")
};