import {
    CameraLayers,
    CameraLayer,
    engine,
    TextureCamera,
    Transform,
    AvatarShape,
    type Entity
} from '@dcl/sdk/ecs';
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import {getPlayer} from '@dcl/sdk/src/players'
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
import {type URNWithoutTokenId} from "../../utils/definitions";
import {type PBAvatarBase} from "@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_base.gen";
import {WEARABLE_CATEGORY_DEFINITIONS, type WearableCategory} from "../../service/wearable-categories";

type AvatarPreview = {
    avatarEntity: Entity
    cameraEntity: Entity
}

const avatarPreview: AvatarPreview = {
    avatarEntity: engine.RootEntity,
    cameraEntity: engine.RootEntity
}

export const getAvatarCamera: () => Entity = () => avatarPreview.cameraEntity;

const AVATAR_CAMERA_POSITION = {
    BODY: Vector3.create(8, 2.5, 8 - 6),
    TOP: Vector3.create(8, 3.5, 8 - 3),
}
const TOP_CAMERA_CATEGORIES: WearableCategory[] = [
    WEARABLE_CATEGORY_DEFINITIONS.hair.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyebrows.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyes.id,
    WEARABLE_CATEGORY_DEFINITIONS.mouth.id,
    WEARABLE_CATEGORY_DEFINITIONS.facial_hair.id,
    WEARABLE_CATEGORY_DEFINITIONS.hat.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyewear.id,
    WEARABLE_CATEGORY_DEFINITIONS.earring.id,
    WEARABLE_CATEGORY_DEFINITIONS.mask.id,
    WEARABLE_CATEGORY_DEFINITIONS.tiara.id,
    WEARABLE_CATEGORY_DEFINITIONS.top_head.id,
    WEARABLE_CATEGORY_DEFINITIONS.helmet.id,
]

export const setAvatarPreviewCameraToWearableCategory = (category: WearableCategory | null):void => {
    console.log("setAvatarPreviewCameraToWearableCategory", category)
    if (category !== null && TOP_CAMERA_CATEGORIES.includes(category)) {
        Transform.getMutable(avatarPreview.cameraEntity).position = AVATAR_CAMERA_POSITION.TOP;
    } else {
        Transform.getMutable(avatarPreview.cameraEntity).position = AVATAR_CAMERA_POSITION.BODY;
    }
}

export function updateAvatarPreview(wearables: URNWithoutTokenId[], avatarBase: PBAvatarBase): void {
    AvatarShape.getMutable(avatarPreview.avatarEntity).wearables = wearables
    AvatarShape.getMutable(avatarPreview.avatarEntity).bodyShape = avatarBase.bodyShapeUrn;
    AvatarShape.getMutable(avatarPreview.avatarEntity).hairColor = avatarBase.hairColor;
    AvatarShape.getMutable(avatarPreview.avatarEntity).eyeColor = avatarBase.eyesColor;
    AvatarShape.getMutable(avatarPreview.avatarEntity).skinColor = avatarBase.skinColor;
}

export function createAvatarPreview(): void {
    const avatarEntity: Entity = avatarPreview.avatarEntity = engine.addEntity();
    const cameraEntity = avatarPreview.cameraEntity = engine.addEntity();
    const playerData = getPlayer();

    AvatarShape.create(avatarEntity, {
        bodyShape: playerData?.avatar?.bodyShapeUrn,
        emotes: [],
        expressionTriggerId: undefined,
        expressionTriggerTimestamp: undefined,
        eyeColor: playerData?.avatar?.eyesColor,
        hairColor: playerData?.avatar?.hairColor,
        id: playerData?.userId ?? "", // TODO review if this is ok
        name: undefined,
        skinColor: playerData?.avatar?.skinColor,
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
        clearColor: Color4.create(0.4, 0.4, 1.0, 0),
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
        position: AVATAR_CAMERA_POSITION.BODY,
        rotation: Quaternion.fromEulerDegrees(4, 0, 0),
    });
}