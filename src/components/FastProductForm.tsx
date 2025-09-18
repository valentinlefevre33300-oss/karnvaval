import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

interface FastProductFormProps {
  editingProduct?: Product;
  onEditComplete?: (product?: Product) => void;
}

const FastProductForm: React.FC<FastProductFormProps> = ({ 
  editingProduct, 
  onEditComplete 
}) => {
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Memoize the sizes parsing to avoid recalculation
  const parseSizes = useCallback((sizes: string | string[] | undefined) => {
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
  }, []);

  // Load product data when editing - optimized
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category || '',
        colors_general: editingProduct.colors_general || '',
        image_url: editingProduct.image_url || '',
        stock_quantity: editingProduct.stock_quantity || '',
        sizes: parseSizes(editingProduct.sizes)
      });
    }
  }, [editingProduct, parseSizes]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
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
          stock_quantity: formData.stock_quantity || '0',
          sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null
        };

        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('product_id', editingProduct.product_id);

        if (error) throw error;

        setMessage('Produit modifié avec succès !');
        toast.success('Produit modifié avec succès !');
        
        // Return the updated product
        const updatedProduct = {
          ...editingProduct,
          ...productData
        };
        onEditComplete?.(updatedProduct);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Erreur lors de la modification du produit');
      toast.error('Erreur lors de la modification du produit');
    } finally {
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

      <div className="grid gap-4 md:grid-cols-3">
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
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ex: Chaussures"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock</Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={handleChange}
            placeholder="10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
          <Label htmlFor="sizes">Tailles (séparées par des virgules)</Label>
          <Input
            id="sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Ex: 38, 39, 40, 41, 42"
          />
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
        {loading ? 'Modification...' : 'Modifier le produit'}
      </Button>
    </form>
  ), [formData, handleChange, handleSubmit, loading]);

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

export default FastProductForm;
