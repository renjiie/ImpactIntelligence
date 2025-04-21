import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
import { ImpactArea } from "@/lib/types";

interface TaskQuickCreateProps {
  documentId: number;
  impactAreas: ImpactArea[];
  onCreateTask: (impactArea: ImpactArea) => void;
}

const TaskQuickCreate = ({ documentId, impactAreas, onCreateTask }: TaskQuickCreateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-col items-end gap-2 z-20">
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg p-2 mb-2 w-56">
          <h4 className="text-sm font-medium px-2 py-1">Create Task For</h4>
          {impactAreas.map((area, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left my-1"
              onClick={() => {
                onCreateTask(area);
                setIsExpanded(false);
              }}
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${
                area.impactLevel === "High" ? "bg-red-500" :
                area.impactLevel === "Medium" ? "bg-yellow-500" : "bg-green-500"
              }`}></span>
              {area.name}
            </Button>
          ))}
        </div>
      )}
      
      <Button
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-[var(--color-success-main)] hover:bg-[var(--color-success-dark)]"
        onClick={toggleExpanded}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default TaskQuickCreate;