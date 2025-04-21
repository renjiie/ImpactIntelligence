import { Button } from "@/components/ui/button";
import { RelatedDocument } from "@/lib/types";
import { FileText } from "lucide-react";

interface RelatedDocumentsProps {
  documents: RelatedDocument[];
}

const RelatedDocuments = ({ documents }: RelatedDocumentsProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Related Documents</h2>
        <Button
          variant="link"
          className="text-[var(--color-primary-main)] hover:bg-blue-50 px-3 py-1 rounded text-sm"
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="bg-white rounded-lg elevation-1 p-4">
            <div className="flex items-start">
              <FileText className="text-[var(--color-grey-500)] mr-3 h-5 w-5" />
              <div>
                <h3 className="font-medium text-[var(--color-grey-900)]">{doc.title}</h3>
                <p className="text-sm text-[var(--color-grey-600)] mb-2">Last updated: {doc.lastUpdated}</p>
                <div className="flex gap-1 flex-wrap">
                  {doc.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-grey-100)] text-[var(--color-grey-800)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDocuments;
