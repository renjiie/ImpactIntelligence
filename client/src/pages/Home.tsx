import { useState } from "react";
import { useLocation } from "wouter";
import DocumentUpload from "@/components/DocumentUpload";
import ChatDrawer from "@/components/ChatDrawer";

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [, navigate] = useLocation();
  
  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };
  
  const handleUploadComplete = (documentId: number) => {
    // Using the new tabular dashboard view instead of the scrolling view
    navigate(`/dashboard-tabular/${documentId}`);
  };

  return (
    <>
      <div className="flex-grow p-4 overflow-auto transition-all duration-300 ease-in-out">
        <DocumentUpload onUploadComplete={handleUploadComplete} />
      </div>
      
      <ChatDrawer
        isOpen={drawerOpen}
        onClose={toggleDrawer}
        isFullScreen={false}
      />
    </>
  );
};

export default Home;
