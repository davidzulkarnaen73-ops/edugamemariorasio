import * as THREE from 'three';
import { sounds } from '../utils/soundEffects';

export interface EngineCallbacks {
  onCoinCollected: (scoreAdd: number, totalCoinsAdd: number) => void;
  onEducationalCoinTriggered: (questionNumber: number) => void;
  onLevelCompleted: () => void;
  onPlayerFallOutOfBounds: () => void;
}

export interface PlatformBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  mesh?: THREE.Mesh | THREE.Group;
}

export interface MysteryBlockItem {
  id: string;
  x: number;
  y: number;
  z: number;
  mesh: THREE.Group;
  bumped: boolean;
  questionNumber?: number;
  initialY: number;
  bumpAnim: number;
}

export interface CoinItem {
  id: string;
  x: number;
  y: number;
  z: number;
  mesh: THREE.Group;
  collected: boolean;
  isEducational: boolean;
  questionNumber?: number;
  initialY: number;
}

export class CoinQuestEngine {
  private container: HTMLElement;
  private callbacks: EngineCallbacks;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;

  // Animation & State
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;
  public isPaused: boolean = false;
  private currentLevel: 1 | 2 | 3 = 1;

  // Player Character
  private playerGroup: THREE.Group;
  private playerBodyMesh!: THREE.Mesh;
  private playerHeadGroup!: THREE.Group;
  private leftArmGroup!: THREE.Group;
  private rightArmGroup!: THREE.Group;
  private leftLegGroup!: THREE.Group;
  private rightLegGroup!: THREE.Group;
  private backpackMesh!: THREE.Mesh;

  // Player Physics
  public playerPos = { x: 0, y: 3, z: 0 };
  public playerVel = { x: 0, y: 0, z: 0 };
  public isGrounded: boolean = false;
  public isCrouching: boolean = false;
  public facingDirection: 1 | -1 = 1; // 1 = right, -1 = left
  public isCelebrating: boolean = false;
  public celebrationTimer: number = 0;

  // Input states
  private input = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
  };

  // World objects
  private platforms: PlatformBox[] = [];
  private coins: CoinItem[] = [];
  private mysteryBlocks: MysteryBlockItem[] = [];
  private clouds: THREE.Group[] = [];
  private particles: { mesh: THREE.Mesh; vel: THREE.Vector3; life: number; maxLife: number }[] = [];
  private goalFlagMesh: THREE.Group | null = null;
  private flagMesh: THREE.Mesh | null = null;
  private isFlagSliding: boolean = false;
  private goalReached: boolean = false;
  private levelEndX: number = 75;

  // Materials & Geometries cache for clean disposal
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  constructor(container: HTMLElement, level: 1 | 2 | 3, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.currentLevel = level;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // 2. Camera: 2.5D / 3D platformer angle
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    this.camera.position.set(0, 5.5, 14);

    // 3. Renderer with hardware detection & ACES tone mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Build Hero Player
    this.playerGroup = new THREE.Group();
    this.buildVoxelCharacter();
    this.scene.add(this.playerGroup);

    // 6. Build Level World
    this.buildLevelWorld(level);

    // 7. Events
    window.addEventListener('resize', this.onWindowResize);

    // 8. Start Loop
    this.tick = this.tick.bind(this);
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  // ==========================================================
  // LIGHTING & ENVIRONMENT
  // ==========================================================
  private setupLighting() {
    // Ambient & Hemisphere
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x446644, 0.7);
    this.scene.add(hemiLight);

    // Key directional light (casting soft shadows)
    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    dirLight.position.set(15, 25, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 70;
    const d = 25;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0004;
    this.scene.add(dirLight);

    // Soft fill rim light
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.4);
    rimLight.position.set(-20, 10, -10);
    this.scene.add(rimLight);
  }

  // ==========================================================
  // VOXEL HERO BUILDER ("Kiko the Math Explorer")
  // ==========================================================
  private buildVoxelCharacter() {
    // Procedural pixel-art styled materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.8 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }); // Royal Blue Cap
    const capVisorMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 }); // Blue Tunic
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }); // Navy explorer pants
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }); // Leather boots
    const packMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }); // Leather backpack

    this.disposables.push(skinMat, hairMat, capMat, capVisorMat, goldMat, shirtMat, pantsMat, bootMat, packMat);

    // 1. Torso (0.7 x 0.8 x 0.45)
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.8, 0.45);
    this.playerBodyMesh = new THREE.Mesh(torsoGeo, shirtMat);
    this.playerBodyMesh.position.y = 1.0;
    this.playerBodyMesh.castShadow = true;
    this.playerBodyMesh.receiveShadow = true;
    this.playerGroup.add(this.playerBodyMesh);

    // Belt and gold buckle
    const beltGeo = new THREE.BoxGeometry(0.72, 0.16, 0.47);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.7 });
    const beltMesh = new THREE.Mesh(beltGeo, beltMat);
    beltMesh.position.y = -0.32;
    this.playerBodyMesh.add(beltMesh);

    const buckleGeo = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    const buckleMesh = new THREE.Mesh(buckleGeo, goldMat);
    buckleMesh.position.y = -0.32;
    this.playerBodyMesh.add(buckleMesh);

    // 2. Backpack on torso's back (-Z in local coords)
    const packGeo = new THREE.BoxGeometry(0.55, 0.6, 0.3);
    this.backpackMesh = new THREE.Mesh(packGeo, packMat);
    this.backpackMesh.position.set(0, 0.05, -0.35);
    this.backpackMesh.castShadow = true;
    this.playerBodyMesh.add(this.backpackMesh);

    // Sleeping roll on top of backpack
    const rollGeo = new THREE.BoxGeometry(0.58, 0.16, 0.22);
    const rollMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });
    const rollMesh = new THREE.Mesh(rollGeo, rollMat);
    rollMesh.position.set(0, 0.36, -0.35);
    this.playerBodyMesh.add(rollMesh);

    // 3. Head & Cap
    this.playerHeadGroup = new THREE.Group();
    this.playerHeadGroup.position.set(0, 1.7, 0);

    const headGeo = new THREE.BoxGeometry(0.65, 0.65, 0.6);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.playerHeadGroup.add(headMesh);

    // Hair voxels (back and sides)
    const hairGeo = new THREE.BoxGeometry(0.68, 0.4, 0.35);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.1, -0.16);
    this.playerHeadGroup.add(hairMesh);

    // Explorer Cap
    const capGeo = new THREE.BoxGeometry(0.68, 0.25, 0.65);
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, 0.36, 0);
    capMesh.castShadow = true;
    this.playerHeadGroup.add(capMesh);

    // Cap visor (pointing front: +Z)
    const visorGeo = new THREE.BoxGeometry(0.64, 0.08, 0.32);
    const visorMesh = new THREE.Mesh(visorGeo, capVisorMat);
    visorMesh.position.set(0, 0.26, 0.42);
    this.playerHeadGroup.add(visorMesh);

    // Cap badge (Golden Star)
    const badgeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.08);
    const badgeMesh = new THREE.Mesh(badgeGeo, goldMat);
    badgeMesh.position.set(0, 0.36, 0.34);
    this.playerHeadGroup.add(badgeMesh);

    // Face Details: Pixel Eyes
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.12, 0.04);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.16, 0.02, 0.31);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.16, 0.02, 0.31);
    this.playerHeadGroup.add(leftEye, rightEye);

    this.playerGroup.add(this.playerHeadGroup);

    // 4. Arms (Pivoted at shoulder: Y = 1.35)
    const armGeo = new THREE.BoxGeometry(0.22, 0.65, 0.25);
    armGeo.translate(0, -0.28, 0); // pivot at shoulder

    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.48, 1.35, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.castShadow = true;
    this.leftArmGroup.add(leftArmMesh);
    this.playerGroup.add(this.leftArmGroup);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.48, 1.35, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.castShadow = true;
    this.rightArmGroup.add(rightArmMesh);
    this.playerGroup.add(this.rightArmGroup);

    // 5. Legs (Pivoted at hip: Y = 0.6)
    const legGeo = new THREE.BoxGeometry(0.28, 0.65, 0.3);
    legGeo.translate(0, -0.3, 0); // pivot at hip

    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.18, 0.6, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.castShadow = true;
    this.leftLegGroup.add(leftLegMesh);

    // Boot foot
    const footGeo = new THREE.BoxGeometry(0.3, 0.22, 0.4);
    const leftFootMesh = new THREE.Mesh(footGeo, bootMat);
    leftFootMesh.position.set(0, -0.5, 0.05);
    this.leftLegGroup.add(leftFootMesh);
    this.playerGroup.add(this.leftLegGroup);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.18, 0.6, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.castShadow = true;
    this.rightLegGroup.add(rightLegMesh);

    const rightFootMesh = new THREE.Mesh(footGeo, bootMat);
    rightFootMesh.position.set(0, -0.5, 0.05);
    this.rightLegGroup.add(rightFootMesh);
    this.playerGroup.add(this.rightLegGroup);

    // Contact shadow plane underneath
    const shadowGeo = new THREE.PlaneGeometry(1.2, 0.9);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    this.playerGroup.add(shadowMesh);

    // Scale character nicely
    this.playerGroup.scale.set(1.2, 1.2, 1.2);
  }

  // ==========================================================
  // LEVEL BUILDER (Levels 1, 2, 3)
  // ==========================================================
  public buildLevelWorld(level: 1 | 2 | 3) {
    this.currentLevel = level;
    this.clearLevelObjects();
    this.goalReached = false;

    // Reset player position
    this.playerPos = { x: 0, y: 3, z: 0 };
    this.playerVel = { x: 0, y: 0, z: 0 };
    this.isCelebrating = false;

    // Sky & Fog based on level
    if (level === 1) {
      this.scene.background = new THREE.Color(0x60a5fa); // Sky Blue
      this.scene.fog = new THREE.Fog(0x60a5fa, 30, 85);
      this.buildLevel1Meadow();
    } else if (level === 2) {
      this.scene.background = new THREE.Color(0xf59e0b); // Sunset Amber
      this.scene.fog = new THREE.Fog(0xf59e0b, 30, 90);
      this.buildLevel2Canyon();
    } else {
      this.scene.background = new THREE.Color(0x312e81); // Royal Indigo / Twilight Castle
      this.scene.fog = new THREE.Fog(0x312e81, 30, 95);
      this.buildLevel3Castle();
    }

    // Background floating voxel clouds
    this.createBackgroundClouds();
  }

  private clearLevelObjects() {
    // Remove old platforms, coins, blocks, goal
    this.platforms.forEach((p) => {
      if (p.mesh) this.scene.remove(p.mesh);
    });
    this.platforms = [];

    this.coins.forEach((c) => {
      this.scene.remove(c.mesh);
    });
    this.coins = [];

    this.mysteryBlocks.forEach((b) => {
      this.scene.remove(b.mesh);
    });
    this.mysteryBlocks = [];

    this.clouds.forEach((c) => {
      this.scene.remove(c);
    });
    this.clouds = [];

    if (this.goalFlagMesh) {
      this.scene.remove(this.goalFlagMesh);
      this.goalFlagMesh = null;
    }

    this.particles.forEach((p) => {
      this.scene.remove(p.mesh);
    });
    this.particles = [];
  }

  // --- Helper to add a voxel platform ---
  private addPlatform(
    x: number,
    y: number,
    w: number,
    h: number,
    d: number = 3,
    topColor: number = 0x22c55e,
    sideColor: number = 0x78350f
  ) {
    const group = new THREE.Group();

    // Top grass layer
    const topGeo = new THREE.BoxGeometry(w, 0.4, d);
    const topMat = new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.7 });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.set(x + w / 2, y - 0.2, 0);
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    group.add(topMesh);

    // Body/Dirt layer
    if (h > 0.4) {
      const bodyGeo = new THREE.BoxGeometry(w, h - 0.4, d);
      const bodyMat = new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.8 });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.set(x + w / 2, y - 0.2 - (h - 0.4) / 2, 0);
      bodyMesh.receiveShadow = true;
      bodyMesh.castShadow = true;
      group.add(bodyMesh);
    }

    this.scene.add(group);

    const box: PlatformBox = {
      minX: x,
      maxX: x + w,
      minY: y - h,
      maxY: y,
      minZ: -d / 2,
      maxZ: d / 2,
      mesh: group,
    };
    this.platforms.push(box);
    return box;
  }

  // --- Helper to add a question mark mystery block ---
  private addMysteryBlock(x: number, y: number, questionNumber?: number) {
    const group = new THREE.Group();
    group.position.set(x, y, 0);

    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold/amber block
      metalness: 0.3,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Darker corner bolts
    const boltGeo = new THREE.BoxGeometry(0.15, 0.15, 1.24);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 });
    [-0.45, 0.45].forEach((bx) => {
      [-0.45, 0.45].forEach((by) => {
        const bolt = new THREE.Mesh(boltGeo, boltMat);
        bolt.position.set(bx, by, 0);
        group.add(bolt);
      });
    });

    // Embossed '?' on front face (+Z)
    const qGeo = new THREE.BoxGeometry(0.3, 0.6, 0.1);
    const qMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const qMesh = new THREE.Mesh(qGeo, qMat);
    qMesh.position.set(0, 0, 0.62);
    group.add(qMesh);

    this.scene.add(group);

    const item: MysteryBlockItem = {
      id: `mb_${x}_${y}`,
      x,
      y,
      z: 0,
      mesh: group,
      bumped: false,
      questionNumber,
      initialY: y,
      bumpAnim: 0,
    };
    this.mysteryBlocks.push(item);

    // Also register as a solid platform
    this.platforms.push({
      minX: x - 0.6,
      maxX: x + 0.6,
      minY: y - 0.6,
      maxY: y + 0.6,
      minZ: -0.6,
      maxZ: 0.6,
      mesh: group,
    });
  }

  // --- Helper to add a coin (Regular or Educational) ---
  private addCoin(x: number, y: number, isEducational: boolean, questionNumber?: number) {
    const group = new THREE.Group();
    group.position.set(x, y, 0);

    if (isEducational) {
      // Shimmering Golden Star Emblem Coin
      const coinGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 16);
      coinGeo.rotateX(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
      });
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.castShadow = true;
      group.add(coinMesh);

      // Star emblem inside
      const starGeo = new THREE.BoxGeometry(0.5, 0.5, 0.24);
      starGeo.rotateZ(Math.PI / 4);
      const starMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2,
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      group.add(starMesh);

      // Radiant glowing ring
      const ringGeo = new THREE.TorusGeometry(0.85, 0.05, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      group.add(ringMesh);
    } else {
      // Regular Spinning Gold Coin
      const coinGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 12);
      coinGeo.rotateX(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.85,
        roughness: 0.2,
      });
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.castShadow = true;
      group.add(coinMesh);
    }

    this.scene.add(group);

    this.coins.push({
      id: `coin_${x}_${y}_${isEducational ? 'edu' : 'reg'}`,
      x,
      y,
      z: 0,
      mesh: group,
      collected: false,
      isEducational,
      questionNumber,
      initialY: y,
    });
  }

  // --- Helper to build Castle Finish Gate ---
  private addCastleGoal(x: number, y: number) {
    const group = new THREE.Group();
    group.position.set(x, y, 0);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const portalMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });

    // 1. Left Turret
    const turretGeo = new THREE.BoxGeometry(1.6, 7.5, 2.0);
    const leftTurret = new THREE.Mesh(turretGeo, stoneMat);
    leftTurret.position.set(-2.4, 3.75, 0);
    leftTurret.castShadow = true;
    leftTurret.receiveShadow = true;
    group.add(leftTurret);

    const roofGeo = new THREE.ConeGeometry(1.6, 2.2, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const leftRoof = new THREE.Mesh(roofGeo, roofMat);
    leftRoof.position.set(-2.4, 8.6, 0);
    group.add(leftRoof);

    // 2. Right Turret
    const rightTurret = new THREE.Mesh(turretGeo, stoneMat);
    rightTurret.position.set(2.4, 3.75, 0);
    rightTurret.castShadow = true;
    rightTurret.receiveShadow = true;
    group.add(rightTurret);

    const rightRoof = new THREE.Mesh(roofGeo, roofMat);
    rightRoof.position.set(2.4, 8.6, 0);
    group.add(rightRoof);

    // 3. Overhead Archway Lintel (Height Y = 5.2 to 6.8, player height is 1.8 so walking underneath is 100% free)
    const archGeo = new THREE.BoxGeometry(4.0, 1.8, 1.8);
    const arch = new THREE.Mesh(archGeo, stoneMat);
    arch.position.set(0, 5.8, 0);
    arch.castShadow = true;
    group.add(arch);

    // 4. Glowing Magical Castle Portal inside doorway
    const portalGeo = new THREE.PlaneGeometry(2.4, 3.8);
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalMesh.position.set(0, 1.9, 0.1);
    group.add(portalMesh);

    // Glowing Portal Rings
    const portalRingGeo = new THREE.TorusGeometry(1.2, 0.08, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const portalRing = new THREE.Mesh(portalRingGeo, ringMat);
    portalRing.position.set(0, 2.2, 0.15);
    group.add(portalRing);

    // 5. Classic Super Mario Style Flagpole in front of the castle entrance at x - 3.5
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 7.0);
    const pole = new THREE.Mesh(poleGeo, goldMat);
    pole.position.set(-3.5, 3.5, 0.4);
    pole.castShadow = true;
    group.add(pole);

    // Gold Top Ball
    const ballGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const ball = new THREE.Mesh(ballGeo, goldMat);
    ball.position.set(-3.5, 7.0, 0.4);
    group.add(ball);

    // Checkered / Red Victory Flag
    const flagGeo = new THREE.PlaneGeometry(1.6, 1.0);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      roughness: 0.4,
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(-2.7, 6.2, 0.4);
    group.add(flag);
    this.flagMesh = flag;
    this.isFlagSliding = false;

    // 6. Arch Crest / Banner: Golden Badge
    const crestGeo = new THREE.BoxGeometry(1.8, 0.8, 0.4);
    const crest = new THREE.Mesh(crestGeo, goldMat);
    crest.position.set(0, 7.0, 0.8);
    group.add(crest);

    this.scene.add(group);
    this.goalFlagMesh = group;
    this.levelEndX = x;

    // 7. SOLID COLLISIONS ONLY FOR SIDE TURRETS & OVERHEAD - CENTER DOORWAY IS 100% OPEN!
    // Left Turret solid box
    this.platforms.push({
      minX: x - 3.2,
      maxX: x - 1.6,
      minY: y,
      maxY: y + 7.5,
      minZ: -1.5,
      maxZ: 1.5,
      mesh: group,
    });

    // Right Turret solid box
    this.platforms.push({
      minX: x + 1.6,
      maxX: x + 3.2,
      minY: y,
      maxY: y + 7.5,
      minZ: -1.5,
      maxZ: 1.5,
      mesh: group,
    });

    // Overhead Arch lintel (solid from y + 4.9 upwards, player can freely walk under!)
    this.platforms.push({
      minX: x - 1.6,
      maxX: x + 1.6,
      minY: y + 4.9,
      maxY: y + 7.5,
      minZ: -1.5,
      maxZ: 1.5,
      mesh: group,
    });

    // Back wall behind portal (stops player at x + 2.5)
    this.platforms.push({
      minX: x + 2.2,
      maxX: x + 3.2,
      minY: y,
      maxY: y + 7.5,
      minZ: -1.5,
      maxZ: 1.5,
      mesh: group,
    });
  }

  // --- Background Decorative Voxel Clouds ---
  private createBackgroundClouds() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < 12; i++) {
      const cloudGroup = new THREE.Group();
      const x = -10 + i * 10 + (Math.random() - 0.5) * 5;
      const y = 8 + (i % 3) * 2.5 + Math.random();
      const z = -6 - Math.random() * 8;

      // 3-4 voxel blocks per cloud
      const baseGeo = new THREE.BoxGeometry(2.5, 0.8, 1.2);
      const m1 = new THREE.Mesh(baseGeo, cloudMat);
      cloudGroup.add(m1);

      const topGeo = new THREE.BoxGeometry(1.4, 0.7, 1.0);
      const m2 = new THREE.Mesh(topGeo, cloudMat);
      m2.position.set(0.3, 0.6, 0);
      cloudGroup.add(m2);

      cloudGroup.position.set(x, y, z);
      this.scene.add(cloudGroup);
      this.clouds.push(cloudGroup);
    }
  }

  // ==========================================================
  // LEVEL 1: DUNIA EKSPLORASI (Soal 1 - 5)
  // Pemahaman Konsep Rasio & Bahasa Rasio
  // ==========================================================
  private buildLevel1Meadow() {
    // Ground sections & floating islands
    // Starting ground
    this.addPlatform(-5, 0, 16, 4, 4, 0x22c55e, 0x78350f);

    // Coins & Mystery Block on start
    this.addCoin(2, 1.5, false);
    this.addCoin(4, 1.5, false);
    this.addMysteryBlock(6, 3.5, 1); // Triggers Q1 if hit, or coin!
    this.addCoin(6, 5.0, true, 1);   // Edu Coin Q1 right above block

    // First jump: Island 1
    this.addPlatform(13, 1.5, 6, 4, 4, 0x22c55e, 0x78350f);
    this.addCoin(15, 3.0, false);
    this.addCoin(16.5, 3.0, true, 2); // Edu Coin Q2
    this.addMysteryBlock(17.5, 4.5);

    // Second jump: High Island 2
    this.addPlatform(21, 3.5, 7, 4, 4, 0x22c55e, 0x78350f);
    this.addCoin(22.5, 5.0, false);
    this.addCoin(24.5, 5.0, true, 3); // Edu Coin Q3
    this.addCoin(26.5, 5.0, false);

    // Stone Steps & Mystery Block
    this.addPlatform(30, 2.0, 5, 4, 4, 0x94a3b8, 0x475569);
    this.addMysteryBlock(32, 5.0, 4);
    this.addCoin(32, 6.5, true, 4); // Edu Coin Q4

    // Pipe / Brick Bridge
    this.addPlatform(37, 3.5, 8, 4, 4, 0x22c55e, 0x78350f);
    this.addCoin(39, 5.0, false);
    this.addCoin(41, 5.0, false);
    this.addCoin(43, 5.0, false);

    // Final Hill Platform with Edu Coin Q5
    this.addPlatform(47, 4.5, 9, 5, 4, 0x22c55e, 0x78350f);
    this.addMysteryBlock(50, 7.5);
    this.addCoin(52, 6.0, true, 5); // Edu Coin Q5
    this.addCoin(54, 6.0, false);

    // Castle Goal Platform (Seamless connection from X = 55 to 75)
    this.addPlatform(55, 4.5, 20, 5, 6, 0x94a3b8, 0x475569);
    this.addCastleGoal(65, 4.5);
  }

  // ==========================================================
  // LEVEL 2: JEMBATAN TANTANGAN (Soal 6 - 10)
  // Kesamaan Rasio, Tabel Rasio & Rasio Satuan
  // ==========================================================
  private buildLevel2Canyon() {
    // Starting plateau
    this.addPlatform(-5, 0, 14, 4, 4, 0xd97706, 0x78350f);
    this.addCoin(2, 1.5, false);
    this.addCoin(4, 1.5, false);
    this.addCoin(6, 2.0, true, 6); // Edu Coin Q6

    // Suspension Bridge Section 1 (Wooden Planks)
    this.addPlatform(11, 1.0, 4, 0.6, 3, 0xb45309, 0x78350f);
    this.addCoin(13, 2.5, false);

    this.addPlatform(17, 2.0, 4, 0.6, 3, 0xb45309, 0x78350f);
    this.addMysteryBlock(19, 5.0, 7);
    this.addCoin(19, 6.5, true, 7); // Edu Coin Q7

    // Canyon Pillar
    this.addPlatform(23, 3.5, 5, 6, 4, 0xd97706, 0x78350f);
    this.addCoin(24.5, 5.0, false);
    this.addCoin(26.0, 5.0, true, 8); // Edu Coin Q8

    // Floating Stepping Stones
    this.addPlatform(30, 4.5, 3.5, 0.8, 3, 0xb45309, 0x78350f);
    this.addCoin(31.5, 6.0, false);

    this.addPlatform(35, 3.0, 3.5, 0.8, 3, 0xb45309, 0x78350f);
    this.addMysteryBlock(36.5, 6.0, 9);
    this.addCoin(36.5, 7.5, true, 9); // Edu Coin Q9

    // Canyon High Arch
    this.addPlatform(40, 4.0, 7, 5, 4, 0xd97706, 0x78350f);
    this.addCoin(42, 5.5, false);
    this.addCoin(44, 5.5, true, 10); // Edu Coin Q10
    this.addCoin(46, 5.5, false);

    // Final Bridge to Castle
    this.addPlatform(49, 3.5, 6, 1.0, 3, 0xb45309, 0x78350f);
    this.addCoin(52, 5.0, false);

    // Goal Platform (Seamless connection from X = 54 to 74)
    this.addPlatform(54, 3.5, 20, 5, 6, 0xd97706, 0x78350f);
    this.addCastleGoal(64, 3.5);
  }

  // ==========================================================
  // LEVEL 3: KASTEL JUARA (Soal 11 - 15)
  // Rasio Bagian-ke-Keseluruhan & Masalah Kontekstual
  // ==========================================================
  private buildLevel3Castle() {
    // Castle Courtyard
    this.addPlatform(-5, 0, 14, 4, 5, 0x64748b, 0x334155);
    this.addCoin(2, 1.5, false);
    this.addCoin(4, 1.5, false);
    this.addMysteryBlock(6, 3.5, 11);
    this.addCoin(6, 5.0, true, 11); // Edu Coin Q11

    // Grand Castle Stone Steps
    this.addPlatform(11, 1.5, 5, 4, 4, 0x64748b, 0x334155);
    this.addCoin(13, 3.0, false);
    this.addCoin(14.5, 3.0, true, 12); // Edu Coin Q12

    this.addPlatform(18, 3.0, 6, 5, 4, 0x64748b, 0x334155);
    this.addMysteryBlock(21, 6.0, 13);
    this.addCoin(21, 7.5, true, 13); // Edu Coin Q13

    // Rampart Battlements
    this.addPlatform(26, 4.5, 8, 6, 4, 0x64748b, 0x334155);
    this.addCoin(28, 6.0, false);
    this.addCoin(30, 6.0, false);
    this.addCoin(32, 6.0, true, 14); // Edu Coin Q14

    // Floating Royal Balcony
    this.addPlatform(36, 5.5, 5, 1.2, 3, 0xf59e0b, 0x78350f); // Golden balcony
    this.addMysteryBlock(38.5, 8.5);
    this.addCoin(38.5, 10.0, true, 15); // Edu Coin Q15 (Grand Challenge!)

    // High Watchtower Steps
    this.addPlatform(43, 4.0, 6, 5, 4, 0x64748b, 0x334155);
    this.addCoin(45, 5.5, false);
    this.addCoin(47, 5.5, false);

    // Throne Room / Castle Goal (Seamless connection from X = 48 to 68)
    this.addPlatform(48, 4.0, 20, 6, 6, 0x64748b, 0x334155);
    this.addCastleGoal(60, 4.0);
  }

  // ==========================================================
  // INPUT HANDLING (Touch & Keyboard)
  // ==========================================================
  public setInput(control: 'left' | 'right' | 'up' | 'down' | 'jump', active: boolean) {
    this.input[control] = active;
    if (control === 'jump' && active && !this.isPaused) {
      this.triggerJump();
    }
  }

  public triggerJump() {
    if (this.isGrounded && !this.isPaused) {
      this.playerVel.y = 13.5; // Crisp jump impulse
      this.isGrounded = false;
      sounds.playJump();
    }
  }

  // ==========================================================
  // GAME PHYSICS & TICK LOOP
  // ==========================================================
  private tick() {
    if (this.isDestroyed) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (!this.isPaused) {
      this.updatePhysics(delta);
      this.updateEntities(delta);
    }

    this.updateCharacterAnimations(delta);
    this.updateCamera(delta);
    this.updateParticles(delta);

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  private updatePhysics(dt: number) {
    const moveSpeed = 8.5;
    const accel = 40.0;
    const friction = 25.0;
    const gravity = -32.0;

    // 1. Horizontal movement
    let targetVx = 0;
    if (this.input.left) {
      targetVx -= moveSpeed;
      this.facingDirection = -1;
    }
    if (this.input.right) {
      targetVx += moveSpeed;
      this.facingDirection = 1;
    }

    // Accelerate or decelerate smoothly
    if (targetVx !== 0) {
      if (this.playerVel.x < targetVx) {
        this.playerVel.x = Math.min(targetVx, this.playerVel.x + accel * dt);
      } else if (this.playerVel.x > targetVx) {
        this.playerVel.x = Math.max(targetVx, this.playerVel.x - accel * dt);
      }
    } else {
      if (this.playerVel.x > 0) {
        this.playerVel.x = Math.max(0, this.playerVel.x - friction * dt);
      } else if (this.playerVel.x < 0) {
        this.playerVel.x = Math.min(0, this.playerVel.x + friction * dt);
      }
    }

    // 2. Gravity
    this.playerVel.y += gravity * dt;
    if (this.playerVel.y < -22) this.playerVel.y = -22; // Terminal velocity

    // 3. Move X and check collisions
    const nextX = this.playerPos.x + this.playerVel.x * dt;
    const halfW = 0.45;
    const playerH = 1.8;

    let blockedX = false;
    for (const p of this.platforms) {
      // Overlaps vertically?
      if (this.playerPos.y + playerH > p.minY && this.playerPos.y < p.maxY) {
        // Approaching from left to right
        if (this.playerVel.x > 0 && this.playerPos.x + halfW <= p.minX && nextX + halfW >= p.minX) {
          this.playerPos.x = p.minX - halfW;
          this.playerVel.x = 0;
          blockedX = true;
          break;
        }
        // Approaching from right to left
        if (this.playerVel.x < 0 && this.playerPos.x - halfW >= p.maxX && nextX - halfW <= p.maxX) {
          this.playerPos.x = p.maxX + halfW;
          this.playerVel.x = 0;
          blockedX = true;
          break;
        }
      }
    }
    if (!blockedX) {
      this.playerPos.x = nextX;
    }

    // 4. Move Y and check collisions
    const nextY = this.playerPos.y + this.playerVel.y * dt;
    let groundedThisFrame = false;

    for (const p of this.platforms) {
      // Check X overlap
      if (this.playerPos.x + halfW > p.minX && this.playerPos.x - halfW < p.maxX) {
        // Falling onto a platform
        if (this.playerVel.y <= 0 && this.playerPos.y >= p.maxY - 0.2 && nextY <= p.maxY) {
          this.playerPos.y = p.maxY;
          this.playerVel.y = 0;
          groundedThisFrame = true;
          break;
        }

        // Jumping and hitting head from below
        if (this.playerVel.y > 0 && this.playerPos.y + playerH <= p.minY + 0.3 && nextY + playerH >= p.minY) {
          this.playerPos.y = p.minY - playerH;
          this.playerVel.y = -2.0; // Bounce back down

          // Check if this was a Mystery Block hit!
          this.checkMysteryBlockHit(p);
          break;
        }
      }
    }

    if (groundedThisFrame) {
      this.isGrounded = true;
    } else {
      this.playerPos.y = nextY;
      this.isGrounded = false;
    }

    // Out of bounds check (fell into pit)
    if (this.playerPos.y < -12) {
      this.callbacks.onPlayerFallOutOfBounds();
      this.respawnAtLastSafeGround();
    }

    // Check Goal Reached (Super Mario Flagpole & Castle Entrance)
    if (!this.goalReached && this.playerPos.x >= this.levelEndX - 3.8) {
      this.goalReached = true;
      this.isFlagSliding = true;
      this.triggerCelebration(3.5);
      sounds.playLevelComplete();
      this.callbacks.onLevelCompleted();
    }
  }

  private respawnAtLastSafeGround() {
    this.playerPos = { x: Math.max(0, this.playerPos.x - 10), y: 4, z: 0 };
    this.playerVel = { x: 0, y: 0, z: 0 };
  }

  // --- Check if jump bumped a mystery block from underneath ---
  private checkMysteryBlockHit(platform: PlatformBox) {
    for (const mb of this.mysteryBlocks) {
      if (Math.abs(mb.x - (platform.minX + platform.maxX) / 2) < 0.8) {
        if (!mb.bumped) {
          mb.bumped = true;
          mb.bumpAnim = 1.0;
          sounds.playMysteryBlock();

          // Spawn celebratory coin burst
          this.spawnParticles(mb.x, mb.y + 0.8, 0xfbbf24, 8);

          // If linked to question
          if (mb.questionNumber !== undefined) {
            this.callbacks.onEducationalCoinTriggered(mb.questionNumber);
          } else {
            // Regular mystery block gives +10 coin
            this.callbacks.onCoinCollected(10, 1);
          }
        }
        break;
      }
    }
  }

  // --- Entities update (coins spin, mystery blocks bump, flagpole animation) ---
  private updateEntities(dt: number) {
    // Flagpole flag sliding down (Super Mario style)
    if (this.isFlagSliding && this.flagMesh) {
      if (this.flagMesh.position.y > 1.2) {
        this.flagMesh.position.y = Math.max(1.2, this.flagMesh.position.y - dt * 4.5);
      }
    }

    // 1. Coins
    for (const c of this.coins) {
      if (c.collected) continue;

      // Spin coin
      c.mesh.rotation.y += dt * 3.5;
      // Gentle float bob
      c.mesh.position.y = c.initialY + Math.sin(this.clock.elapsedTime * 4.0 + c.x) * 0.15;

      // Check collision with player
      const dx = this.playerPos.x - c.x;
      const dy = this.playerPos.y + 0.9 - c.mesh.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1.1) {
        c.collected = true;
        c.mesh.visible = false;

        if (c.isEducational) {
          sounds.playEduCoin();
          this.spawnParticles(c.x, c.y, 0xfde047, 16);
          // Pause and trigger Quiz!
          if (c.questionNumber !== undefined) {
            this.callbacks.onEducationalCoinTriggered(c.questionNumber);
          }
        } else {
          sounds.playCoin();
          this.spawnParticles(c.x, c.y, 0xf59e0b, 6);
          this.callbacks.onCoinCollected(10, 1);
        }
      }
    }

    // 2. Mystery block bump spring animation
    for (const mb of this.mysteryBlocks) {
      if (mb.bumpAnim > 0) {
        mb.bumpAnim -= dt * 4.0;
        const offset = Math.sin(Math.max(0, mb.bumpAnim) * Math.PI) * 0.45;
        mb.mesh.position.y = mb.initialY + offset;
      }
    }

    // 3. Clouds drifting slowly
    for (const cl of this.clouds) {
      cl.position.x += dt * 0.4;
      if (cl.position.x > this.levelEndX + 20) {
        cl.position.x = -25;
      }
    }
  }

  // --- Player character animation: Idle, Run, Jump, Celebrate ---
  private updateCharacterAnimations(dt: number) {
    this.playerGroup.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);

    // Smooth facing direction rotation (facing right = 0 deg, facing left = 180 deg)
    const targetRotY = this.facingDirection === 1 ? 0 : Math.PI;
    this.playerGroup.rotation.y = THREE.MathUtils.damp(this.playerGroup.rotation.y, targetRotY, 15, dt);

    const time = this.clock.elapsedTime;

    if (this.isCelebrating) {
      // Victory celebration: jump joyfully with arms in the air!
      this.celebrationTimer -= dt;
      if (this.celebrationTimer <= 0) {
        this.isCelebrating = false;
      }
      this.leftArmGroup.rotation.z = Math.PI * 0.85 + Math.sin(time * 12) * 0.2;
      this.rightArmGroup.rotation.z = -Math.PI * 0.85 - Math.sin(time * 12) * 0.2;
      this.leftArmGroup.rotation.x = 0;
      this.rightArmGroup.rotation.x = 0;
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
      this.playerBodyMesh.position.y = 1.0 + Math.abs(Math.sin(time * 8)) * 0.3;
      return;
    }

    if (!this.isGrounded) {
      // Jumping / Air pose
      this.leftLegGroup.rotation.x = -0.5;
      this.rightLegGroup.rotation.x = 0.4;
      this.leftArmGroup.rotation.x = 0.8;
      this.rightArmGroup.rotation.x = -0.8;
      this.leftArmGroup.rotation.z = 0.3;
      this.rightArmGroup.rotation.z = -0.3;
      this.playerBodyMesh.position.y = 1.0;
    } else if (Math.abs(this.playerVel.x) > 0.4) {
      // Running animation
      const runCycle = time * 12.0;
      this.leftLegGroup.rotation.x = Math.sin(runCycle) * 0.8;
      this.rightLegGroup.rotation.x = -Math.sin(runCycle) * 0.8;
      this.leftArmGroup.rotation.x = -Math.sin(runCycle) * 0.75;
      this.rightArmGroup.rotation.x = Math.sin(runCycle) * 0.75;
      this.leftArmGroup.rotation.z = 0.15;
      this.rightArmGroup.rotation.z = -0.15;
      this.playerBodyMesh.position.y = 1.0 + Math.abs(Math.sin(runCycle)) * 0.12;
    } else {
      // Idle breathing animation
      const breath = Math.sin(time * 3.0);
      this.playerBodyMesh.position.y = 1.0 + breath * 0.04;
      this.playerHeadGroup.position.y = 1.7 + breath * 0.03;
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
      this.leftArmGroup.rotation.x = 0;
      this.rightArmGroup.rotation.x = 0;
      this.leftArmGroup.rotation.z = 0.1 + breath * 0.03;
      this.rightArmGroup.rotation.z = -0.1 - breath * 0.03;
    }
  }

  public triggerCelebration(duration: number = 2.0) {
    this.isCelebrating = true;
    this.celebrationTimer = duration;
    this.spawnParticles(this.playerPos.x, this.playerPos.y + 1.5, 0xfde047, 24);
  }

  // --- Smooth Camera Tracking ---
  private updateCamera(dt: number) {
    // Follow player smoothly on X and slightly on Y
    const targetCamX = this.playerPos.x + 2.5;
    const targetCamY = Math.max(5.5, this.playerPos.y + 2.8);

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 6.0, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 4.0, dt);
    this.camera.position.z = 13.5;

    this.camera.lookAt(this.camera.position.x - 1.5, this.camera.position.y - 1.2, 0);
  }

  // --- Particle FX (stars, dust, sparkles) ---
  private spawnParticles(x: number, y: number, color: number, count: number) {
    const geo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const mat = new THREE.MeshBasicMaterial({ color });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x + (Math.random() - 0.5) * 0.6, y + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.4);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8.0,
        Math.random() * 6.0 + 2.0,
        (Math.random() - 0.5) * 3.0
      );
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        vel,
        life: 0.8,
        maxLife: 0.8,
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        this.particles.splice(i, 1);
        continue;
      }
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= 14.0 * dt; // gravity
      const scale = p.life / p.maxLife;
      p.mesh.scale.set(scale, scale, scale);
    }
  }

  private onWindowResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onWindowResize);

    this.clearLevelObjects();
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
