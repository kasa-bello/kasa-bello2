
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, ImageIcon } from 'lucide-react';

interface ActionButtonsProps {
  bucketInfo: any | null;
  isCheckingImages: boolean;
  isCreatingBucket: boolean;
  onCreateBucket: () => void;
  onCheckImages: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  bucketInfo,
  isCheckingImages,
  isCreatingBucket,
  onCreateBucket,
  onCheckImages
}) => {
  return (
    <div className="flex gap-2">
      {bucketInfo && !bucketInfo.hasProductImagesBucket && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCreateBucket}
          disabled={isCreatingBucket}
        >
          {isCreatingBucket ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Bucket
            </>
          )}
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCheckImages}
        disabled={isCheckingImages}
      >
        {isCheckingImages ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Check Images
          </>
        )}
      </Button>
    </div>
  );
};
