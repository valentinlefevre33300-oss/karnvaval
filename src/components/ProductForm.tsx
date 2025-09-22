import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

type EditingProduct = {
  product_id: string;
  name?: string;
  brand?: string;
  description?: string;
  price?: string;
  category?: string;
  colors_general?: string;
  image_url?: string;
  stock_quantity?: string;
  sizes?: string | string[];
};

const ProductForm = ({ editingProduct, onEditComplete }: { editingProduct?: EditingProduct, onEditComplete?: () => void }) => {
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

  // Load product data when editing
  useEffect(() => {
    if (editingProduct) {
      console.log('Editing product sizes:', editingProduct.sizes, 'Type:', typeof editingProduct.sizes);
      setFormData({
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category || '',
        colors_general: editingProduct.colors_general || '',
        image_url: editingProduct.image_url || '',
        stock_quantity: editingProduct.stock_quantity || '',
        sizes: (() => {
          try {
            if (Array.isArray(editingProduct.sizes)) {
              return editingProduct.sizes.join(', ');
            } else if (typeof editingProduct.sizes === 'string') {
              // Try to parse as JSON first
              if (editingProduct.sizes.startsWith('[')) {
                const parsed = JSON.parse(editingProduct.sizes);
                return Array.isArray(parsed) ? parsed.join(', ') : '';
              }
              // If it's just a string, return as is
              return editingProduct.sizes;
            }
            return '';
          } catch (error) {
            console.error('Error parsing sizes:', error, 'Raw sizes:', editingProduct.sizes);
            // If JSON parsing fails, treat as comma-separated string
            return typeof editingProduct.sizes === 'string' ? editingProduct.sizes : '';
          }
        })()
      });
    }
  }, [editingProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateProductId = () => {
    return 'PROD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingProduct) {
        // Mode édition
        const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
        
        const productData = {
          ...formData,
          sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
          price: parseFloat(formData.price) ? formData.price : '0',
          stock_quantity: formData.stock_quantity || '0'
        };

        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('product_id', editingProduct.product_id);

        if (error) {
          throw error;
        }

        setMessage('Produit modifié avec succès !');
        toast.success('Produit modifié avec succès !');
        
        // Return the updated product
        const updatedProduct = {
          ...editingProduct,
          ...productData
        };
        onEditComplete?.(updatedProduct);
      } else {
        // Mode ajout
        const productId = generateProductId();
        
        const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
        
        const productData = {
          ...formData,
          product_id: productId,
          sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
          price: parseFloat(formData.price) ? formData.price : '0',
          stock_quantity: formData.stock_quantity || '0'
        };

        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          throw error;
        }

        setMessage('Produit ajouté avec succès !');
        toast.success('Produit ajouté avec succès !');
        
        // Return the new product
        const newProduct = {
          ...productData,
          product_id: productId
        };
        onEditComplete?.(newProduct);
        
        // Reset du formulaire
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
      }

    } catch (error) {
      console.error('Erreur lors de l\'opération:', error);
      setMessage('Erreur lors de l\'opération');
      toast.error('Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
        {message && (
          <Alert variant={message.includes('Erreur') ? 'destructive' : 'default'} className="mb-4">
            {message}
          </Alert>
        )}
        
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
              <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Ex: Femme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homme">Homme</SelectItem>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="enfant">Enfant</SelectItem>
                  <SelectItem value="unisexe">Unisexe</SelectItem>
                </SelectContent>
              </Select>
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
            {loading ? (editingProduct ? 'Modification...' : 'Ajout en cours...') : (editingProduct ? 'Modifier le produit' : 'Ajouter le produit')}
          </Button>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;