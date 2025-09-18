import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface SneakerModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}

export const SneakerModel = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1,
  color = "#2563eb"
}: SneakerModelProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef}>
        {/* Semelle */}
        <group position={[0, -0.8, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 0.3, 4]} />
            <meshStandardMaterial color="#f8f9fa" />
          </mesh>
          <mesh position={[0, -0.15, 0.5]}>
            <boxGeometry args={[2, 0.2, 3]} />
            <meshStandardMaterial color="#e9ecef" />
          </mesh>
        </group>

        {/* Corps principal de la chaussure */}
        <group position={[0, -0.3, 0]}>
          {/* Base */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 0.8, 3.5]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Côtés arrondis */}
          <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>

          {/* Bout de la chaussure */}
          <mesh position={[0, 0, 1.5]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>

        {/* Languette */}
        <mesh position={[0, 0.2, 0.5]}>
          <boxGeometry args={[1.5, 0.6, 1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Lacets */}
        {Array.from({ length: 5 }, (_, i) => (
          <group key={i} position={[0, 0.4, 0.8 - i * 0.3]}>
            <mesh position={[0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[-0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>
        ))}

        {/* Logo côté */}
        <mesh position={[1.1, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-1.1, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </mesh>
    </group>
  );
};