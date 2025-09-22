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

  // Per-size stock state
  const [perSizeStock, setPerSizeStock] = useState<Record<string, number>>(() => {
    // @ts-expect-error product may carry JSONB
    const raw = (product as any).stock_by_size;
    if (raw && typeof raw === 'object') return Object.fromEntries(Object.entries(raw).map(([k,v]) => [String(k), Number(v) || 0]));
    if (typeof raw === 'string') {
      try { const obj = JSON.parse(raw); return Object.fromEntries(Object.entries(obj).map(([k,v]) => [String(k), Number(v) || 0])); } catch {}
    }
    return {};
  });

  const sizeKeys = useMemo(() => {
    return Object.keys(perSizeStock || {}).sort((a, b) => Number(a) - Number(b));
  }, [perSizeStock]);

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
      const sizesArray = sizeKeys;
      const stockTotal = Object.values(perSizeStock).reduce((a, b) => a + (Number(b) || 0), 0);
      const payload = {
        name: form.name,
        brand: form.brand,
        description: form.description,
        price: form.price,
        category: form.category,
        colors_general: form.colors_general,
        image_url: form.image_url,
        stock_quantity: String(stockTotal),
        sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
        // @ts-expect-error JSONB
        stock_by_size: perSizeStock
      };
      console.log('[ProductEditDialog] save:payload', payload);

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
  }, [form, product, onOpenChange, onUpdated, perSizeStock, sizeKeys]);

  // Brand now always free text; keep prop for future use but don't build a list

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto transition-none">
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
            <Input id="brand" name="brand" autoComplete="organization" value={form.brand} onChange={handleChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" autoComplete="off" value={form.description} onChange={handleChange} rows={3} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-start">
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€) *</Label>
            <Input id="price" name="price" type="number" step="0.01" inputMode="decimal" autoComplete="off" value={form.price} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <select id="category" name="category" className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={handleChange}>
              <option value="">Sélectionner…</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Unisexe">Unisexe</option>
              <option value="Enfant">Enfant</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-1 items-start">
          <div className="space-y-2">
            <Label htmlFor="colors_general">Couleurs (CSV)</Label>
            <Input id="colors_general" name="colors_general" autoComplete="off" value={form.colors_general} onChange={handleChange} />
          </div>
        </div>

        {/* Per size stock editor (vendors and admins) */}
        <div className="space-y-2">
          <Label>Stock par taille</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {sizeKeys.map(raw => {
              const sz = String(raw).replace(/["'\[\]]/g, '').trim();
              const current = perSizeStock[sz] ?? 0;
              return (
              <div key={sz} className="flex items-center gap-2">
                <span className="w-10 text-sm text-muted-foreground">{sz}</span>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    step={1}
                    inputMode="numeric"
                    value={current}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(999, Number(e.target.value) || 0));
                      console.log('[ProductEditDialog] change stock', { size: sz, val });
                      setPerSizeStock(prev => ({ ...prev, [sz]: val }));
                    }}
                    className="h-9 w-24 rounded-md border border-input bg-background pl-2 pr-8 text-sm"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                    <button
                      type="button"
                      className="h-3 w-6 text-xs leading-none rounded-sm border bg-background"
                      onClick={() => {
                        const val = Math.max(0, Math.min(999, current + 1));
                        console.log('[ProductEditDialog] stepper +1', { size: sz, from: current, to: val });
                        setPerSizeStock(prev => ({ ...prev, [sz]: val }));
                      }}
                      aria-label={`Ajouter 1 à la taille ${sz}`}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="mt-0.5 h-3 w-6 text-xs leading-none rounded-sm border bg-background"
                      onClick={() => {
                        const val = Math.max(0, Math.min(999, current - 1));
                        console.log('[ProductEditDialog] stepper -1', { size: sz, from: current, to: val });
                        setPerSizeStock(prev => ({ ...prev, [sz]: val }));
                      }}
                      aria-label={`Retirer 1 de la taille ${sz}`}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 items-start">
          <div className="space-y-2">
            <Label>Stock total (auto)</Label>
            <Input value={Object.values(perSizeStock).reduce((a, b) => a + (Number(b) || 0), 0)} readOnly />
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


