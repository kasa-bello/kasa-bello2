
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface StorageActionButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const StorageActionButton: React.FC<StorageActionButtonProps> = ({ 
  isLoading, 
  onClick 
}) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full mb-4"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking Storage...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Storage Health
        </>
      )}
    </Button>
  );
};
