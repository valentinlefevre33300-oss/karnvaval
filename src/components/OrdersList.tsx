import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, User, Calendar, Euro, Truck, CreditCard, Eye, Edit, Filter, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Order, useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrdersListProps {
  showAllOrders?: boolean;
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-purple-100 text-purple-800';
    case 'shipped':
      return 'bg-orange-100 text-orange-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'processing':
      return 'En préparation';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    case 'refunded':
      return 'Remboursée';
    default:
      return status;
  }
};

const OrdersList: React.FC<OrdersListProps> = ({ showAllOrders = false }) => {
  const { orders, loading, updateOrderStatus, fetchOrders, fetchUserOrders } = useOrders();
  const { authUser, isAdmin, isVendor } = useAuth();
  
  // Memoize admin/vendor checks to prevent unnecessary re-renders
  const isAdminUser = useMemo(() => isAdmin(), [isAdmin]);
  const isVendorUser = useMemo(() => isVendor(), [isVendor]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  const [statusNotes, setStatusNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  React.useEffect(() => {
    if (authUser) {
      if (showAllOrders && (isAdminUser || isVendorUser)) {
        console.log('Fetching all orders for admin/vendor');
        fetchOrders();
      } else {
        console.log('Fetching user orders for user:', authUser.id);
        fetchUserOrders();
      }
    }
  }, [showAllOrders, authUser, fetchOrders, fetchUserOrders, isAdminUser, isVendorUser]);

  // Auto-refresh orders every 30 seconds when showing all orders
  React.useEffect(() => {
    if (showAllOrders && (isAdminUser || isVendorUser)) {
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [showAllOrders, fetchOrders, isAdminUser, isVendorUser]);

  // Filter orders based on status and date range
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(order => new Date(order.created_at) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(order => new Date(order.created_at) <= endDate);
    }

    return filtered;
  }, [orders, statusFilter, startDate, endDate]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder.id, newStatus, statusNotes);
      setEditingStatus(false);
      setStatusNotes('');
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive",
      });
    }
  };

  const canEditStatus = isAdmin() || isVendor();

  // console.log('OrdersList render:', {
  //   loading,
  //   ordersCount: orders.length,
  //   filteredOrdersCount: filteredOrders.length,
  //   showAllOrders,
  //   authUser: !!authUser
  // });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredOrders.length === 0 && orders.length > 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aucune commande trouvée</h3>
          <p className="text-muted-foreground">
            Aucune commande ne correspond aux filtres sélectionnés.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {showAllOrders ? 'Aucune commande trouvée' : 'Aucune commande'}
          </h3>
          <p className="text-muted-foreground">
            {showAllOrders 
              ? 'Il n\'y a encore aucune commande dans le système.'
              : 'Vous n\'avez pas encore passé de commande.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-sm">Filtrer par statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="processing">En préparation</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                  <SelectItem value="refunded">Remboursée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">
                      {startDate ? startDate.toLocaleDateString('fr-FR') : "Sélectionner"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">
                      {endDate ? endDate.toLocaleDateString('fr-FR') : "Sélectionner"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter('all');
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredOrders.length} commande(s) trouvée(s) sur {orders.length} au total
          </div>
        </CardContent>
      </Card>

      {filteredOrders.map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  Commande #{order.order_number}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistance(new Date(order.created_at), new Date(), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
                  {getStatusLabel(order.status)}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Détails</span>
                      <span className="sm:hidden">Voir</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[80vh] overflow-y-auto mx-2">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg">
                        Commande #{order.order_number}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Customer Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            Informations client
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p><strong>Nom:</strong> {order.customer_first_name} {order.customer_last_name}</p>
                          <p className="break-all"><strong>Email:</strong> {order.customer_email}</p>
                          {order.customer_phone && (
                            <p><strong>Téléphone:</strong> {order.customer_phone}</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Shipping Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                            Livraison
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p><strong>Adresse:</strong> {order.shipping_address}</p>
                          <p><strong>Ville:</strong> {order.shipping_postal_code} {order.shipping_city}</p>
                          <p><strong>Pays:</strong> {order.shipping_country}</p>
                          <p><strong>Mode:</strong> {order.shipping_method}</p>
                        </CardContent>
                      </Card>

                      {/* Order Items */}
                      <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                            Articles commandés
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 sm:space-y-4">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                                <img 
                                  src={item.product_image_url || '/placeholder.svg'} 
                                  alt={item.product_name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm sm:text-base truncate">{item.product_name}</h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    {item.product_brand} • {item.product_category}
                                  </p>
                                  {(item.selected_size || item.selected_color) && (
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      {item.selected_size && `Taille: ${item.selected_size}`}
                                      {item.selected_size && item.selected_color && ' • '}
                                      {item.selected_color && `Couleur: ${item.selected_color}`}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-medium text-sm sm:text-base">{item.price.toFixed(2)}€</p>
                                  <p className="text-xs sm:text-sm text-muted-foreground">Qté: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                       {/* Payment & Total */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Paiement
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p><strong>Mode:</strong> {order.payment_method}</p>
                          <p><strong>Statut:</strong> {order.payment_status}</p>
                          {order.promo_code_used && (
                            <p><strong>Code promo:</strong> {order.promo_code_used} (-{order.discount_amount?.toFixed(2)}€)</p>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Euro className="h-5 w-5" />
                            Total
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Sous-total:</span>
                            <span>{order.subtotal.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Livraison:</span>
                            <span>{order.shipping_cost.toFixed(2)}€</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>{order.total.toFixed(2)}€</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Status Management (for admins/vendors) */}
                      {canEditStatus && (
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Edit className="h-5 w-5" />
                              Gestion du statut
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {!editingStatus ? (
                              <div className="flex items-center gap-4">
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusLabel(order.status)}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingStatus(true);
                                    setNewStatus(order.status);
                                  }}
                                >
                                  Modifier le statut
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="status">Nouveau statut</Label>
                                    <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="confirmed">Confirmée</SelectItem>
                                        <SelectItem value="processing">En préparation</SelectItem>
                                        <SelectItem value="shipped">Expédiée</SelectItem>
                                        <SelectItem value="delivered">Livrée</SelectItem>
                                        <SelectItem value="cancelled">Annulée</SelectItem>
                                        <SelectItem value="refunded">Remboursée</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="notes">Notes (optionnel)</Label>
                                  <Textarea
                                    id="notes"
                                    value={statusNotes}
                                    onChange={(e) => setStatusNotes(e.target.value)}
                                    placeholder="Ajouter une note sur ce changement de statut..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button onClick={handleStatusUpdate}>
                                    Mettre à jour
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      setEditingStatus(false);
                                      setStatusNotes('');
                                    }}
                                  >
                                    Annuler
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle>Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{order.notes}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {showAllOrders && (
                <div>
                  <span className="font-medium">Client:</span>
                  <p>{order.customer_first_name} {order.customer_last_name}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium">Total:</span>
                <p>{order.total.toFixed(2)}€</p>
              </div>
              
              <div>
                <span className="font-medium">Articles:</span>
                <p>{order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} article(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersList;