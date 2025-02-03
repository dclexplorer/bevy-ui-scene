import {
    CameraLayers,
    engine,
    TextureCamera,
    Transform,
    UiCanvasInformation
} from '@dcl/sdk/ecs';
  
  export let avatarCamera = engine.RootEntity;
  
  export function createAvatarPreview():void {
    const avatar = engine.addEntity()
    Transform.create(avatar, {
      position: { x: 13, y: 3.5, z: 5 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.2, y: 0.2, z: 0.2 } 
    })
    
  
    // add camera
    if (avatarCamera === engine.RootEntity) {
      const canvasInfo = UiCanvasInformation.get(engine.RootEntity);
  
      const cam = engine.addEntity();
      Transform.create(cam, { parent: avatar});
      CameraLayers.create(avatar, { layers: [0]})
      TextureCamera.create(cam, {
        width: 512 * 0.4 * canvasInfo.width,
        height: 512 * 0.4 * canvasInfo.height,
        layer: 1,
        mode: {
          $case: "perspective",
          perspective: { fieldOfView: 1.58 },
        }
      });
      avatarCamera = cam;
    }
  
   
  

}
