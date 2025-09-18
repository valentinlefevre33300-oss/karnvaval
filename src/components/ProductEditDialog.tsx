import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/improved-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ProductEditDialogProps {
  trigger: React.ReactNode;
  product: Product;
  brandOptions?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updated: Product) => void;
}

export const ProductEditDialog: React.FC<ProductEditDialogProps> = ({ trigger, product, brandOptions = [], open, onOpenChange, onUpdated }) => {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(() => ({
    name: product.name || '',
    brand: product.brand || '',
    description: product.description || '',
    price: product.price || '',
    category: product.category || '',
    colors_general: product.colors_general || '',
    image_url: product.image_url || '',
    stock_quantity: product.stock_quantity || '',
    sizes: Array.isArray(product.sizes) ? (product.sizes as string[]).join(', ') : (product.sizes || ''),
  }));

  useEffect(() => {
    if (open) {
      console.log('[ProductEditDialog] open', { productId: product.product_id });
    }
  }, [open, product.product_id]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    console.log('[ProductEditDialog] save:start', { productId: product.product_id, form });
    setSaving(true);
    try {
      const sizesArray = form.sizes
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        brand: form.brand,
        description: form.description,
        price: form.price,
        category: form.category,
        colors_general: form.colors_general,
        image_url: form.image_url,
        stock_quantity: form.stock_quantity || '0',
        sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
      };

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('product_id', product.product_id)
        .select()
        .maybeSingle();

      if (error) throw error;
      const updated: Product = { ...product, ...payload } as Product;
      console.log('[ProductEditDialog] save:success', { productId: product.product_id });
      toast('Produit modifié', { description: updated.name });
      onUpdated(updated);
      onOpenChange(false);
    } catch (err) {
      console.error('[ProductEditDialog] save:error', err);
      toast('Erreur lors de la modification', { description: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setSaving(false);
    }
  }, [form, product, onOpenChange, onUpdated]);

  const brandList = useMemo(() => Array.from(new Set(brandOptions.filter(Boolean).map(b => b.trim()).filter(Boolean))), [brandOptions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl transition-none">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>Mettre à jour les informations du produit.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" name="name" autoComplete="off" value={form.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Marque *</Label>
            {brandList.length > 0 ? (
              <select id="brand" name="brand" className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.brand} onChange={handleChange}>
                <option value="">Sélectionner…</option>
                {brandList.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            ) : (
              <Input id="brand" name="brand" autoComplete="organization" value={form.brand} onChange={handleChange} required />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" autoComplete="off" value={form.description} onChange={handleChange} rows={3} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€) *</Label>
            <Input id="price" name="price" type="number" step="0.01" inputMode="decimal" autoComplete="off" value={form.price} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input id="category" name="category" autoComplete="off" value={form.category} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock</Label>
            <Input id="stock_quantity" name="stock_quantity" type="number" inputMode="numeric" autoComplete="off" value={form.stock_quantity} onChange={handleChange} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="colors_general">Couleurs (CSV)</Label>
            <Input id="colors_general" name="colors_general" autoComplete="off" value={form.colors_general} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sizes">Tailles (CSV)</Label>
            <Input id="sizes" name="sizes" autoComplete="off" value={form.sizes} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">URL image</Label>
          <Input id="image_url" name="image_url" autoComplete="off" value={form.image_url} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;


