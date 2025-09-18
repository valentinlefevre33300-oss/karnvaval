import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Percent, Euro, Calendar, Users, Trash2 } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  uses_count: number;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
}

export const PromoCodeManagement = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des codes promos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes promos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promoData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
      };

      const { error } = await supabase
        .from('promo_codes')
        .insert([promoData]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Code promo créé avec succès",
      });

      setFormData({
        code: '',
        discount_type: 'percent',
        discount_value: '',
        max_uses: '',
        valid_from: '',
        valid_until: '',
      });
      
      setIsCreating(false);
      await fetchPromoCodes();
    } catch (error: unknown) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: string }).message === 'string' && (error as { message: string }).message.includes('duplicate')) 
          ? "Ce code promo existe déjà" 
          : "Erreur lors de la création du code promo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Aucune limite';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const isMaxUsesReached = (maxUses: number | null, usesCount: number) => {
    if (!maxUses) return false;
    return usesCount >= maxUses;
  };

  const handleDeletePromoCode = async (id: string, code: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le code promo "${code}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Code promo supprimé avec succès",
      });

      await fetchPromoCodes();
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du code promo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Codes Promo
          </CardTitle>
          <Button 
            onClick={() => setIsCreating(!isCreating)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau code
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Créer un code promo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Code promo *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        placeholder="PROMO20"
                        required
                        className="uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount_type">Type de remise *</Label>
                      <Select
                        value={formData.discount_type}
                        onValueChange={(value) => handleChange('discount_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Pourcentage (%)</SelectItem>
                          <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount_value">
                        Valeur * {formData.discount_type === 'percent' ? '(%)' : '(€)'}
                      </Label>
                      <Input
                        id="discount_value"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discount_value}
                        onChange={(e) => handleChange('discount_value', e.target.value)}
                        placeholder={formData.discount_type === 'percent' ? '20' : '10.00'}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_uses">Nombre max d'utilisations</Label>
                      <Input
                        id="max_uses"
                        type="number"
                        min="1"
                        value={formData.max_uses}
                        onChange={(e) => handleChange('max_uses', e.target.value)}
                        placeholder="Illimité si vide"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valid_from">Date de début</Label>
                      <Input
                        id="valid_from"
                        type="datetime-local"
                        value={formData.valid_from}
                        onChange={(e) => handleChange('valid_from', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valid_until">Date de fin</Label>
                      <Input
                        id="valid_until"
                        type="datetime-local"
                        value={formData.valid_until}
                        onChange={(e) => handleChange('valid_until', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Création...' : 'Créer le code'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Codes existants ({promoCodes.length})</h3>
            
            {promoCodes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun code promo créé
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Remise</TableHead>
                      <TableHead className="hidden sm:table-cell">Utilisations</TableHead>
                      <TableHead className="hidden md:table-cell">Validité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promoCodes.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell className="font-mono font-semibold">
                          {promo.code}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {promo.discount_type === 'percent' ? (
                              <>
                                <Percent className="h-3 w-3" />
                                {promo.discount_value}%
                              </>
                            ) : (
                              <>
                                <Euro className="h-3 w-3" />
                                {promo.discount_value}€
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {promo.uses_count}
                            {promo.max_uses && ` / ${promo.max_uses}`}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <div>
                              <div>Début: {formatDate(promo.valid_from)}</div>
                              <div>Fin: {formatDate(promo.valid_until)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isExpired(promo.valid_until) ? (
                            <Badge variant="destructive">Expiré</Badge>
                          ) : isMaxUsesReached(promo.max_uses, promo.uses_count) ? (
                            <Badge variant="secondary">Épuisé</Badge>
                          ) : (
                            <Badge variant="default">Actif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePromoCode(promo.id, promo.code)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};