import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense } from 'react';
import { SneakerModel } from './SneakerModel';

interface SneakerSceneProps {
  className?: string;
  autoRotate?: boolean;
}

export const SneakerScene = ({ className = "", autoRotate = true }: SneakerSceneProps) => {
  return (
    <div className={`w-full h-full min-h-screen ${className}`}>
      <Canvas
        camera={{ position: [8, 4, 8], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Éclairage */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Environnement */}
          <Environment preset="studio" />

          {/* Modèles de chaussures */}
          <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
            <SneakerModel 
              position={[0, 0, 0]} 
              rotation={[0, Math.PI / 4, 0]}
              scale={1.2}
              color="#3b82f6"
            />
          </Float>

          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
            <SneakerModel 
              position={[4, 2, -3]} 
              rotation={[0, -Math.PI / 3, 0]}
              scale={0.9}
              color="#10b981"
            />
          </Float>

          <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.6}>
            <SneakerModel 
              position={[-4, -1, -2]} 
              rotation={[0, Math.PI / 6, 0]}
              scale={1.0}
              color="#6366f1"
            />
          </Float>

          <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.4}>
            <SneakerModel 
              position={[6, -2, 1]} 
              rotation={[0, Math.PI / 2, 0]}
              scale={0.7}
              color="#f59e0b"
            />
          </Float>

          {/* Contrôles */}
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};