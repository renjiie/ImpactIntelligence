import { Card, CardContent } from "@/components/ui/card";
import { Document, AnalysisResult } from "@shared/schema";
import { FileText, Calendar, Folder, MoreVertical, AlertTriangle, Brain, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentOverviewProps {
  document: Document;
  analysisResult: AnalysisResult;
  tasksCount: number;
}

const DocumentOverview = ({ document, analysisResult, tasksCount }: DocumentOverviewProps) => {
  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-orange-50 border-orange-100 text-warning-main";
      case "medium":
        return "bg-orange-50 border-orange-100 text-warning-main";
      case "low":
        return "bg-green-50 border-green-100 text-success-main";
      default:
        return "bg-blue-50 border-blue-100 text-primary-main";
    }
  };

  const impactedAreas = Array.isArray(analysisResult.impactedAreas) 
    ? analysisResult.impactedAreas 
    : [];

  const conflictCount = impactedAreas.length;

  return (
    <Card className="bg-white elevation-2 mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-medium">{document.title}</h2>
            <p className="text-[var(--color-grey-600)]">{document.description}</p>
            <div className="flex mt-2 gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-grey-100)] text-[var(--color-grey-800)]">
                <FileText className="h-3 w-3 mr-1" />
                {document.fileType}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-grey-100)] text-[var(--color-grey-800)]">
                <Folder className="h-3 w-3 mr-1" />
                Document
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-grey-100)] text-[var(--color-grey-800)]">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(document.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-[var(--color-grey-100)]">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-[var(--color-grey-200)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 ${getImpactColor(analysisResult.impactLevel)} rounded-lg border`}>
              <div className="flex items-center">
                <AlertTriangle className="text-xl text-[var(--color-warning-main)] mr-2 h-5 w-5" />
                <h3 className="font-medium">Impact Level</h3>
              </div>
              <p className="text-3xl font-bold text-[var(--color-warning-main)]">
                {analysisResult.impactLevel}
              </p>
              <p className="text-sm text-[var(--color-grey-600)]">
                {conflictCount} potential conflicts identified
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <Brain className="text-xl text-[var(--color-primary-main)] mr-2 h-5 w-5" />
                <h3 className="font-medium">Knowledge Base</h3>
              </div>
              <p className="text-3xl font-bold text-[var(--color-primary-main)]">
                {Array.isArray(analysisResult.relatedDocuments) ? analysisResult.relatedDocuments.length : 0}
              </p>
              <p className="text-sm text-[var(--color-grey-600)]">Related documents</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <CheckCircle className="text-xl text-[var(--color-success-main)] mr-2 h-5 w-5" />
                <h3 className="font-medium">Tasks</h3>
              </div>
              <p className="text-3xl font-bold text-[var(--color-success-main)]">{tasksCount}</p>
              <p className="text-sm text-[var(--color-grey-600)]">Created from this document</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentOverview;
