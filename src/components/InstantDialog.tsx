import React, { memo, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/improved-dialog';
import { Product } from '@/lib/types';
import InstantProductForm from './InstantProductForm';

interface InstantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  editingProduct?: Product;
  onComplete: (product?: Product) => void;
}

const InstantDialog: React.FC<InstantDialogProps> = memo(({
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  editingProduct,
  onComplete
}) => {
  // Memoize the form to prevent re-creation on every render
  const formComponent = useMemo(() => (
    <InstantProductForm 
      editingProduct={editingProduct} 
      onEditComplete={onComplete} 
    />
  ), [editingProduct, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border shadow-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {formComponent}
      </DialogContent>
    </Dialog>
  );
});

InstantDialog.displayName = 'InstantDialog';

export default InstantDialog;
