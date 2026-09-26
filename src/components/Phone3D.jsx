import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function PhoneModel() {
  const { scene } = useGLTF('/models/phone.glb')

  return (
    <primitive
        object={scene}
        scale={15}
        rotation={[0, 0.5, 0]}
    />
  )
}

function Phone3D() {
  return (
    <div className="phone-3d">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={3} />

        <directionalLight
          position={[3, 3, 3]}
          intensity={5}
        />

        <PhoneModel />

        <OrbitControls
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  )
}

export default Phone3D