import { useRef, useEffect, useState } from "react";
import { RelatedDocument } from "@/lib/types";
import { Document } from "@shared/schema";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocumentNode {
  id: string;
  label: string;
  type: string;
  color: string;
  x?: number;
  y?: number;
}

interface DocumentLink {
  source: string;
  target: string;
  strength: number;
}

interface DocumentRelationshipGraphProps {
  currentDocument: Document;
  relatedDocuments: RelatedDocument[];
}

const DocumentRelationshipGraph = ({ 
  currentDocument, 
  relatedDocuments 
}: DocumentRelationshipGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<DocumentNode[]>([]);
  const [links, setLinks] = useState<DocumentLink[]>([]);
  const isMobile = useIsMobile();
  const [selectedNode, setSelectedNode] = useState<DocumentNode | null>(null);

  useEffect(() => {
    if (!currentDocument || !relatedDocuments.length) return;

    // Create nodes
    const documentNodes: DocumentNode[] = [
      {
        id: `doc-${currentDocument.id}`,
        label: currentDocument.title,
        type: 'current',
        color: '#4f46e5' // indigo-600
      }
    ];

    relatedDocuments.forEach((doc, index) => {
      documentNodes.push({
        id: `related-${index}`,
        label: doc.title,
        type: doc.type,
        color: getColorByType(doc.type)
      });
    });

    // Create links between documents
    const documentLinks: DocumentLink[] = [];
    relatedDocuments.forEach((doc, index) => {
      documentLinks.push({
        source: `doc-${currentDocument.id}`,
        target: `related-${index}`,
        strength: getRelationshipStrength(doc.tags)
      });
    });

    // Create links between related documents if they share tags
    for (let i = 0; i < relatedDocuments.length; i++) {
      for (let j = i + 1; j < relatedDocuments.length; j++) {
        const sharedTags = getSharedTags(relatedDocuments[i].tags, relatedDocuments[j].tags);
        if (sharedTags.length > 0) {
          documentLinks.push({
            source: `related-${i}`,
            target: `related-${j}`,
            strength: sharedTags.length / 3 // Normalize strength
          });
        }
      }
    }

    setNodes(documentNodes);
    setLinks(documentLinks);
  }, [currentDocument, relatedDocuments]);

  useEffect(() => {
    if (!containerRef.current || !nodes.length || !links.length) return;

    // Here's where we'd typically initialize D3 for a real implementation
    // For this demo, we'll use a simpler approach with SVG
    renderSimpleGraph();
  }, [nodes, links, containerRef.current]);

  const renderSimpleGraph = () => {
    // This is a simplified implementation without D3
    // In a production app, you'd use D3 force simulation for better layouts
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Position nodes in a circle layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // Position the current document in the center
    const currentDocNode = nodes.find(node => node.type === 'current');
    if (currentDocNode) {
      currentDocNode.x = centerX;
      currentDocNode.y = centerY;
    }
    
    // Position related documents in a circle around the center
    const relatedNodes = nodes.filter(node => node.type !== 'current');
    relatedNodes.forEach((node, i) => {
      const angle = (i / relatedNodes.length) * Math.PI * 2;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });
  };

  const getColorByType = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'prd':
      case 'product requirement':
        return '#4f46e5'; // indigo-600
      case 'design':
      case 'design document':
        return '#0891b2'; // cyan-600
      case 'tech spec':
      case 'technical specification':
        return '#0d9488'; // teal-600
      case 'research':
      case 'research document':
        return '#7c3aed'; // violet-600
      case 'legal':
      case 'compliance':
        return '#b91c1c'; // red-700
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getRelationshipStrength = (tags: string[]): number => {
    // Higher number of matching tags means stronger relationship
    return Math.min(1, tags.length / 5); // Normalize between 0-1
  };

  const getSharedTags = (tags1: string[], tags2: string[]): string[] => {
    return tags1.filter(tag => tags2.includes(tag));
  };

  const handleNodeClick = (node: DocumentNode) => {
    setSelectedNode(node === selectedNode ? null : node);
  };

  // Simple SVG graph rendering
  return (
    <div className="relative w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium mb-4">Document Relationships</h3>
      
      <div 
        ref={containerRef} 
        className="w-full h-72 relative border border-gray-100 rounded-md bg-gray-50"
      >
        {nodes.length > 0 && (
          <svg width="100%" height="100%" className="absolute top-0 left-0">
            {/* Draw links first so they appear behind nodes */}
            {links.map((link, i) => {
              const source = nodes.find(n => n.id === link.source);
              const target = nodes.find(n => n.id === link.target);
              if (!source || !target || !source.x || !target.x) return null;
              
              const strokeWidth = 1 + link.strength * 2;
              
              return (
                <line 
                  key={`link-${i}`}
                  x1={source.x} 
                  y1={source.y} 
                  x2={target.x} 
                  y2={target.y} 
                  stroke="rgba(156, 163, 175, 0.5)" 
                  strokeWidth={strokeWidth}
                />
              );
            })}
            
            {/* Draw nodes on top of links */}
            {nodes.map((node) => {
              if (!node.x || !node.y) return null;
              const isCurrentDoc = node.type === 'current';
              const isSelected = selectedNode?.id === node.id;
              const radius = isCurrentDoc ? 20 : 14;
              
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer"
                >
                  <circle 
                    r={radius} 
                    fill={node.color} 
                    stroke={isSelected ? "#000" : "white"}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={0.8}
                  />
                  {!isMobile && (
                    <text 
                      textAnchor="middle" 
                      dy=".3em" 
                      fill="white" 
                      fontSize="10px"
                      fontWeight="bold"
                    >
                      {node.label.substring(0, 3)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
      
      {/* Node details panel */}
      {selectedNode && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="font-medium">{selectedNode.label}</h4>
          <p className="text-sm text-gray-600 mt-1">Type: {selectedNode.type}</p>
          {selectedNode.type !== 'current' && (
            <button className="mt-2 text-xs text-blue-600 hover:underline">
              View document
            </button>
          )}
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap gap-2">
        {/* Legend */}
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 inline-block rounded-full bg-[#4f46e5]"></span>
          <span className="text-xs text-gray-600">PRD</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 inline-block rounded-full bg-[#0891b2]"></span>
          <span className="text-xs text-gray-600">Design</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 inline-block rounded-full bg-[#0d9488]"></span>
          <span className="text-xs text-gray-600">Tech Spec</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 inline-block rounded-full bg-[#7c3aed]"></span>
          <span className="text-xs text-gray-600">Research</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 inline-block rounded-full bg-[#b91c1c]"></span>
          <span className="text-xs text-gray-600">Legal</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentRelationshipGraph;