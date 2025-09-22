import React, { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/lib/types';

interface InstantProductFormProps {
  editingProduct?: Product;
  onEditComplete?: (product?: Product) => void;
}

const InstantProductForm: React.FC<InstantProductFormProps> = ({ 
  editingProduct, 
  onEditComplete 
}) => {
  // Initialize form data immediately with product data or defaults
  const initialFormData = useMemo(() => {
    if (editingProduct) {
      const parseSizes = (sizes: string | string[] | undefined) => {
        try {
          if (Array.isArray(sizes)) {
            return sizes.join(', ');
          } else if (typeof sizes === 'string') {
            if (sizes.startsWith('[')) {
              const parsed = JSON.parse(sizes);
              return Array.isArray(parsed) ? parsed.join(', ') : sizes;
            }
            return sizes;
          }
          return '';
        } catch (error) {
          console.error('Error parsing sizes:', error);
          return typeof sizes === 'string' ? sizes : '';
        }
      };

      return {
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category || '',
        colors_general: editingProduct.colors_general || '',
        image_url: editingProduct.image_url || '',
        stock_quantity: editingProduct.stock_quantity || '',
        sizes: parseSizes(editingProduct.sizes)
      };
    }
    
    return {
      name: '',
      brand: '',
      description: '',
      price: '',
      category: '',
      colors_general: '',
      image_url: '',
      stock_quantity: '',
      sizes: ''
    };
  }, [editingProduct]);

  const [formData, setFormData] = useState(initialFormData);
  const [perSizeStock, setPerSizeStock] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Update form data when editingProduct changes (for switching between products)
  React.useEffect(() => {
    console.time('[InstantProductForm] init values');
    setFormData(initialFormData);
    console.timeEnd('[InstantProductForm] init values');
    setPerSizeStock({});
  }, [initialFormData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  // Derived sizes from category
  const normalizedCategory = React.useMemo(() => (formData.category || '').toLowerCase(), [formData.category]);
  const generatedSizes = React.useMemo(() => {
    const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
    if (normalizedCategory === 'enfant') return range(16, 37);
    if (normalizedCategory === 'femme') return range(35, 42);
    if (normalizedCategory === 'homme') return range(38, 47);
    if (normalizedCategory === 'unisexe') return range(35, 47);
    return [];
  }, [normalizedCategory]);

  React.useEffect(() => {
    if (generatedSizes.length === 0) return;
    console.log('[InstantProductForm] generatedSizes', generatedSizes);
    setPerSizeStock(prev => {
      const next = { ...prev };
      generatedSizes.forEach(sz => { if (!(sz in next)) next[sz] = 0; });
      Object.keys(next).forEach(k => { if (!generatedSizes.includes(k)) delete next[k]; });
      console.log('[InstantProductForm] perSizeStock:ensureAllSizes', next);
      return next;
    });
    setFormData(prev => ({ ...prev, sizes: generatedSizes.join(', ') }));
  }, [generatedSizes]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.time('[InstantProductForm] submit->update');
      if (editingProduct) {
        const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
        
        const productData = {
          name: formData.name,
          brand: formData.brand,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          colors_general: formData.colors_general,
          image_url: formData.image_url,
          stock_quantity: String(Object.values(perSizeStock).reduce((a, b) => a + (Number(b) || 0), 0)),
          sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
          // @ts-expect-error JSONB column
          stock_by_size: perSizeStock
        };
        console.log('[InstantProductForm] submit:update payload', productData);

        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('product_id', editingProduct.product_id);

        if (error) {
          console.error('[InstantProductForm] submit:update error', error);
          throw error;
        }

        setMessage('Produit modifié avec succès !');
        toast.success('Produit modifié avec succès !');
        
        // Return the updated product
        const updatedProduct = {
          ...editingProduct,
          ...productData
        };
        console.log('[InstantProductForm] submit:update success', updatedProduct);
        onEditComplete?.(updatedProduct);
      } else {
        // Add mode
        const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
        const newProductId = 'PROD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        const productData = {
          name: formData.name,
          brand: formData.brand,
          description: formData.description,
          price: formData.price || '0',
          category: formData.category,
          colors_general: formData.colors_general,
          image_url: formData.image_url,
          stock_quantity: String(Object.values(perSizeStock).reduce((a, b) => a + (Number(b) || 0), 0)),
          sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
          product_id: newProductId,
          // @ts-expect-error JSONB column
          stock_by_size: perSizeStock
        };
        console.log('[InstantProductForm] submit:insert payload', productData);

        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          console.error('[InstantProductForm] submit:insert error', error);
          throw error;
        }

        setMessage('Produit ajouté avec succès !');
        toast.success('Produit ajouté avec succès !');

        onEditComplete?.(productData as unknown as Product);

        // Reset form
        setFormData({
          name: '',
          brand: '',
          description: '',
          price: '',
          category: '',
          colors_general: '',
          image_url: '',
          stock_quantity: '',
          sizes: ''
        });
        setPerSizeStock({});
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Erreur lors de la modification du produit');
      toast.error('Erreur lors de la modification du produit');
    } finally {
      console.timeEnd('[InstantProductForm] submit->update');
      setLoading(false);
    }
  }, [editingProduct, formData, onEditComplete]);

  // Memoize the form to prevent unnecessary re-renders
  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Air Max 90"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marque *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Ex: Nike"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description du produit..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 items-start">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="99.99"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            name="category"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Sélectionner…</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Unisexe">Unisexe</option>
            <option value="Enfant">Enfant</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock total (auto)</Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            value={Object.values(perSizeStock).reduce((a, b) => a + (Number(b) || 0), 0)}
            readOnly
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 items-start">
        <div className="space-y-2">
          <Label htmlFor="colors_general">Couleurs</Label>
          <Input
            id="colors_general"
            name="colors_general"
            value={formData.colors_general}
            onChange={handleChange}
            placeholder="Ex: Noir, Blanc, Rouge"
          />
        </div>

        <div className="space-y-2">
          <Label>Stock par taille</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {generatedSizes.map((sz) => (
              <div key={sz} className="flex items-center gap-2">
                <span className="w-10 text-sm text-muted-foreground">{sz}</span>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={perSizeStock[sz] ?? 0}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(999, Number(e.target.value) || 0));
                    console.log('[InstantProductForm] change stock', { size: sz, val });
                    setPerSizeStock(prev => ({ ...prev, [sz]: val }));
                  }}
                  className="h-9 w-20 rounded-md border border-input bg-background px-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {loading ? (editingProduct ? 'Modification...' : 'Ajout en cours...') : (editingProduct ? 'Modifier le produit' : 'Ajouter le produit')}
      </Button>
    </form>
  ), [formData, handleChange, handleSubmit, loading, generatedSizes, perSizeStock]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Modifier le produit
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {message && (
            <Alert variant={message.includes('Erreur') ? 'destructive' : 'default'} className="mb-4">
              {message}
            </Alert>
          )}
          {formContent}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantProductForm;
