import {
  LoadingManager,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  CircleGeometry,
  TextureLoader,
  DoubleSide,
} from "three";
import { createNoise2D } from "simplex-noise";

const groundbase = '/img/snowColor.jpg';
const groundnormal = '/img/snowNorm.jpg';
const groundrough = "/img/snowRough.jpg";
const groundam = "/img/snowOCC.jpg";
const snowMesh = "/img/snowMesh.jpg";
const simplexNoise = createNoise2D();

export default class Ground extends Mesh {
  constructor(loadingManager = new LoadingManager()) {
    const geometry = new CircleGeometry(3, 32);
    super();
    
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const noise = simplexNoise(x * 1, y * 1) * 0.1; 
      positions[i + 2] += noise; 
    }
    geometry.attributes.position.needsUpdate = true; 

    const textureLoader = new TextureLoader(loadingManager);
    const baseTexture = textureLoader.load(groundbase);
    const normalMapTexture = textureLoader.load(groundnormal);
    const roughMapTexture = textureLoader.load(groundrough);
    const ambientMapTexture = textureLoader.load(groundam);
    const snowMeshTexture = textureLoader.load(snowMesh);


    const material = new MeshStandardMaterial({
      map: baseTexture,
      normalMap: normalMapTexture,
      roughnessMap: roughMapTexture,
      roughness: 0.5,
      metalness: 0.1,
      aoMap: ambientMapTexture,
      side: DoubleSide,
    });

    // Snow overlay material
    const overlayMaterial = new MeshStandardMaterial({
      map: snowMeshTexture,
      transparent: true,
      opacity: 1,
      side: DoubleSide,
    });


    // Ground mesh
    const groundMesh = new Mesh(geometry, material);
    groundMesh.rotation.x = MathUtils.degToRad(-90);
    groundMesh.receiveShadow = true;

    // Overlay mesh
    const overlayMesh = new Mesh(geometry, overlayMaterial);
    overlayMesh.rotation.x = MathUtils.degToRad(-90);
    overlayMesh.receiveShadow = true;

    this.add(groundMesh);
    this.add(overlayMesh);
  }
}
