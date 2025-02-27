import {
    CameraLayers,
    engine,
    TextureCamera,
    Transform,
    AvatarShape,
    type Entity
} from '@dcl/sdk/ecs';
import {Color4, Color3, Quaternion} from "@dcl/sdk/math";
import {getPlayer} from '@dcl/sdk/src/players'
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
import {type URNWithoutTokenId} from "../../utils/definitions";

// TODO apply correct PBAvatarBase from GetPlayerDataRes.avatar into AvatarShape.skinColor,etc.

type AvatarPreview = {
    avatarEntity: Entity
    cameraEntity: Entity
}

const avatarPreview: AvatarPreview = {
    avatarEntity: engine.RootEntity,
    cameraEntity: engine.RootEntity
}

export const getAvatarCamera: () => Entity = () => avatarPreview.cameraEntity;

export function updateAvatarPreview(wearables: URNWithoutTokenId[]): void {
    AvatarShape.getMutable(avatarPreview.avatarEntity).wearables = wearables
}

export function createAvatarPreview(): void {
    const avatarEntity: Entity = avatarPreview.avatarEntity = engine.addEntity();
    const camera = avatarPreview.cameraEntity = engine.addEntity();
    const playerData = getPlayer();
console.log("playerData?.avatar?.skinColor", playerData?.avatar?.skinColor)
    AvatarShape.create(avatarEntity, {
        bodyShape: playerData?.avatar?.bodyShapeUrn,
        emotes: [], // TODO review
        expressionTriggerId: undefined,
        expressionTriggerTimestamp: undefined,
        eyeColor: playerData?.avatar?.eyesColor,
        hairColor:  playerData?.avatar?.hairColor,
        id: playerData?.userId ?? "", // TODO review if this is ok
        name: undefined,
        skinColor:  playerData?.avatar?.skinColor, // Color3.create(0,0,0)
        talking: false,
        wearables: playerData?.wearables ?? []
    })

    CameraLayers.create(avatarEntity, {
        layers: [1]
    })

    TextureCamera.create(camera, {
        width: 850 * getCanvasScaleRatio(),
        height: 2000 * getCanvasScaleRatio(),
        layer: 1,
        clearColor: Color4.create(0.4, 0.4, 1.0, 0.3),
        mode: {
            $case: "perspective",
            perspective: {fieldOfView: .75},
        }
    });

    Transform.create(avatarEntity, {
        position: {x: 8, y: 0, z: 8},
        rotation: Quaternion.fromEulerDegrees(0, 180, 0),
        scale: {x: 2, y: 2, z: 2}
    });

    Transform.create(camera, {
        position: {x: 8, y: 2.5, z: 8 - 6},
        rotation: Quaternion.fromEulerDegrees(4, 0, 0),
    });
}