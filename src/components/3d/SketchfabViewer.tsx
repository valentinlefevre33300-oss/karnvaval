import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SketchfabViewerProps {
  modelId: string;
  title: string;
  author?: string;
  className?: string;
  height?: string;
  transparent?: boolean;
  showInfo?: boolean;
}

export const SketchfabViewer: React.FC<SketchfabViewerProps> = ({
  modelId,
  title,
  author,
  className = '',
  height = '400px',
  transparent = true,
  showInfo = false
}) => {
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed${transparent ? '?transparent=1' : ''}`;
  
  return (
    <div className={`sketchfab-embed-wrapper ${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative" style={{ height }}>
            <iframe
              title={title}
              frameBorder="0"
              allowFullScreen
              mozAllowFullScreen="true"
              webkitAllowFullScreen="true"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              xr-spatial-tracking=""
              execution-while-out-of-viewport=""
              execution-while-not-rendered=""
              web-share=""
              src={embedUrl}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          
          {showInfo && (
            <div className="p-4 border-t bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-primary">{title}</strong>
                {author && (
                  <>
                    {' '}par{' '}
                    <span className="text-primary font-medium">{author}</span>
                  </>
                )}
                {' '}sur{' '}
                <a 
                  href={`https://sketchfab.com/3d-models/${title.toLowerCase().replace(/\s+/g, '-')}-${modelId}`}
                  target="_blank" 
                  rel="nofollow" 
                  className="text-primary font-medium hover:underline"
                >
                  Sketchfab
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant spécialisé pour les produits
interface Product3DViewerProps {
  modelId?: string;
  productName: string;
  imageUrl?: string;
  className?: string;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelId,
  productName,
  imageUrl,
  className = ''
}) => {
  // Si pas de modelId, on affiche seulement l'image
  if (!modelId) {
    return (
      <div className={`aspect-square bg-muted rounded-lg overflow-hidden ${className}`}>
        <img 
          src={imageUrl || '/placeholder.svg'} 
          alt={productName} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs defaultValue="3d" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3d">Vue 3D</TabsTrigger>
          <TabsTrigger value="image">Photo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="3d" className="mt-4">
          <SketchfabViewer
            modelId={modelId}
            title={productName}
            height="500px"
            transparent={true}
            showInfo={false}
          />
        </TabsContent>
        
        <TabsContent value="image" className="mt-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={imageUrl || '/placeholder.svg'} 
              alt={productName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
