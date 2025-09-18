import React, { memo, useMemo, useEffect, useRef } from 'react';
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
  // Instrumentation: measure open/render
  const startedRef = useRef(false);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    if (isOpen && !startedRef.current) {
      startedRef.current = true;
      startRef.current = performance.now();
    }
    return () => {
      if (startedRef.current && startRef.current != null) {
        const dt = performance.now() - startRef.current;
        console.log('[InstantDialog] open->render:', dt.toFixed(2), 'ms');
        startedRef.current = false;
        startRef.current = null;
      }
    };
  }, [isOpen]);

  // Memoize the form to prevent re-creation on every render
  const formComponent = useMemo(() => (
    <InstantProductForm 
      editingProduct={editingProduct} 
      onEditComplete={onComplete} 
    />
  ), [editingProduct, onComplete]);

  const isSafari = useMemo(() => /^((?!chrome|android).)*safari/i.test(navigator.userAgent), []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={!isSafari}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border shadow-lg transition-none"
        aria-hidden={false}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          requestAnimationFrame(() => {
            const el = document.getElementById('name') as HTMLInputElement | null;
            el?.focus();
          });
        }}
      >
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
