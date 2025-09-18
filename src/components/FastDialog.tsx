import React, { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/improved-dialog';
import { Product } from '@/lib/types';
import FastProductForm from './FastProductForm';

interface FastDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  editingProduct?: Product;
  onComplete: (product?: Product) => void;
}

const FastDialog: React.FC<FastDialogProps> = memo(({
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  editingProduct,
  onComplete
}) => {
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
        <FastProductForm 
          editingProduct={editingProduct} 
          onEditComplete={onComplete} 
        />
      </DialogContent>
    </Dialog>
  );
});

FastDialog.displayName = 'FastDialog';

export default FastDialog;
