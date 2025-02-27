import {
    CameraLayers,
    CameraLayer,
    engine,
    TextureCamera,
    Transform,
    AvatarShape,
    type Entity
} from '@dcl/sdk/ecs';
import {Color4, Quaternion} from "@dcl/sdk/math";
import {getPlayer} from '@dcl/sdk/src/players'
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
import {type URNWithoutTokenId} from "../../utils/definitions";

// TODO apply different camera positions for each selected category

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
    const cameraEntity = avatarPreview.cameraEntity = engine.addEntity();
    const playerData = getPlayer();

    AvatarShape.create(avatarEntity, {
        bodyShape: "urn:decentraland:off-chain:base-avatars:BaseMale",
        emotes: [], // TODO review
        expressionTriggerId: undefined,
        expressionTriggerTimestamp: undefined,
        eyeColor: playerData?.avatar?.eyesColor,
        hairColor:  playerData?.avatar?.hairColor,
        id: playerData?.userId ?? "", // TODO review if this is ok
        name: undefined,
        skinColor:  playerData?.avatar?.skinColor,
        talking: false,
        wearables: playerData?.wearables ?? []
    })

    CameraLayers.create(avatarEntity, {
        layers: [1]
    })
    CameraLayer.create(cameraEntity, {
        layer: 1,
        directionalLight: false,
        showAvatars: false,
        showSkybox: false,
        showFog: false,
        ambientBrightnessOverride: 5
    });

    TextureCamera.create(cameraEntity, {
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

    Transform.create(cameraEntity, {
        position: {x: 8, y: 2.5, z: 8 - 6},
        rotation: Quaternion.fromEulerDegrees(4, 0, 0),
    });
}