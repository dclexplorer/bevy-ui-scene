import {
    CameraLayers,
    engine,
    TextureCamera,
    Transform,
    AvatarShape,
    type Entity
} from '@dcl/sdk/ecs';
import { Color4, Quaternion} from "@dcl/sdk/math";
import { getPlayer } from '@dcl/sdk/src/players'
import {getCanvasScaleRatio} from "../../service/canvas-ratio";

let avatarCamera = engine.RootEntity;

export const getAvatarCamera:()=>Entity = () => avatarCamera;

export function createAvatarPreview():void {
    const avatar = engine.addEntity()
    AvatarShape.create(avatar, {
        bodyShape: undefined,
        emotes: [],
        expressionTriggerId: undefined,
        expressionTriggerTimestamp: undefined,
        eyeColor: undefined,
        hairColor: undefined,
        id: "",
        name: undefined,
        skinColor: undefined,
        talking: undefined,
        wearables:getPlayer()?.wearables ?? []})

    Transform.create(avatar, {
        position: { x: 8, y: 0, z: 8 },
        rotation: Quaternion.fromEulerDegrees(0,180,0),
        scale: { x: 2, y: 2, z: 2 }
    });

    // add camera
    if (avatarCamera === engine.RootEntity) {
    //    const canvasInfo = UiCanvasInformation.get(engine.RootEntity);
        const camera = engine.addEntity();
        Transform.create(camera, {
            position:{x:8,y:2,z:8-6},
            rotation:Quaternion.fromEulerDegrees(0,0,0),
        });

        CameraLayers.create(avatar, {
            layers: [1],
        })

        TextureCamera.create(camera, {
            width: 700 * getCanvasScaleRatio(),
            height: 2000 * getCanvasScaleRatio(),
            layer: 1,
            clearColor: Color4.create(0.4, 0.4, 1.0, 0.3),
            mode: {
                $case: "perspective",
                perspective: { fieldOfView: .75 },
            }
        });
        avatarCamera = camera;
    }
}