import { Button } from "@/components/ui/button";
import { ImpactArea } from "@/lib/types";
import { Filter, Printer, Eye, PlusCircle, CheckSquare } from "lucide-react";

interface AnalysisResultsProps {
  impactAreas: ImpactArea[];
  onCreateTask: (impactArea: ImpactArea) => void;
}

const AnalysisResults = ({ impactAreas, onCreateTask }: AnalysisResultsProps) => {
  const getImpactBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getImpactIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "info";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Impact Analysis</h2>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="px-4 py-1 text-sm rounded-full bg-[var(--color-primary-main)] hover:bg-[var(--color-primary-dark)]"
            onClick={() => {
              if (impactAreas.length > 0) {
                onCreateTask(impactAreas[0]);
              }
            }}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Create New Task
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-4 py-1 text-sm border border-[var(--color-grey-300)] rounded-full hover:bg-[var(--color-grey-100)]"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-4 py-1 text-sm border border-[var(--color-grey-300)] rounded-full hover:bg-[var(--color-grey-100)]"
          >
            <Printer className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {impactAreas.map((item, index) => (
        <div key={index} className="bg-white rounded-lg elevation-1 p-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className={`inline-flex items-center px-2 py-1 mr-2 rounded-full text-xs font-medium ${getImpactBadgeColor(item.impactLevel)}`}>
                  <span className="material-icons text-sm mr-1">{getImpactIcon(item.impactLevel)}</span>
                  {item.impactLevel} Impact
                </span>
                <h3 className="font-medium">{item.name}</h3>
              </div>
              <p className="text-[var(--color-grey-600)]">{item.description}</p>

              {(item.conflict || item.recommendation) && (
                <div className="mt-3 p-3 bg-[var(--color-grey-50)] rounded border border-[var(--color-grey-200)]">
                  <p className="text-sm text-[var(--color-grey-700)] font-medium">
                    {item.conflict ? "Potential Conflict:" : "Recommendation:"}
                  </p>
                  <p className="text-sm text-[var(--color-grey-600)]">
                    {item.conflict || item.recommendation}
                  </p>
                </div>
              )}

              <div className="mt-3">
                <div className="flex items-center">
                  <span className="material-icons text-sm text-[var(--color-grey-600)] mr-1">person</span>
                  <p className="text-sm text-[var(--color-grey-600)]">
                    Contact: <span className="font-medium">{item.contact.name} ({item.contact.title})</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-sm text-[var(--color-grey-600)] mr-1">mail</span>
                  <p className="text-sm text-[var(--color-grey-600)}">{item.contact.email}</p>
                </div>
              </div>
            </div>
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-[var(--color-primary-main)] hover:bg-blue-50 rounded"
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[var(--color-primary-main)] hover:bg-blue-50 rounded"
                onClick={() => onCreateTask(item)}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalysisResults;
