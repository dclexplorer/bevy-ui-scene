import {UiEntity, type UiTransformProps} from "@dcl/sdk/react-ecs";
import ReactEcs, {type ReactElement} from "@dcl/react-ecs";
import {type URN, type URNWithoutTokenId} from "../../utils/definitions";
import {Color4} from "@dcl/sdk/math";
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
import {getBackgroundFromAtlas} from "../../utils/ui-utils";
import type {CatalogWearableElement} from "../../utils/wearables-definitions";
import {COLOR} from "../color-palette";
// TODO import {WearableData} from "../../ui-classes/photos/Photos.types";
export type WearableCatalogGridProps = {
    wearables: any[] // TODO review what is the definition we will use
    equippedWearables: URNWithoutTokenId[],
    uiTransform:UiTransformProps,
    loading: boolean
}
const LOADING_TEXTURE_PROPS = getBackgroundFromAtlas({
    atlasName:"backpack",
    spriteName: "loading-wearable"
})

export function WearableCatalogGrid({wearables, equippedWearables, uiTransform, loading}: WearableCatalogGridProps): ReactElement {
    const canvasScaleRatio = getCanvasScaleRatio();
    return <UiEntity uiTransform={{
        padding: 10 * canvasScaleRatio,
        width: 840 * canvasScaleRatio,
        flexWrap: 'wrap',
        ...uiTransform
    }} uiBackground={{color: Color4.create(1, 0, 0, 0)}}>
        {wearables.map((_,index) => {
            return <UiEntity
                uiTransform={{
                    width:180 * canvasScaleRatio,
                    height:180 * canvasScaleRatio,
                    padding: 8 * canvasScaleRatio,
                    margin: 10 * canvasScaleRatio,
                }}
                key={index}
                uiBackground={(!loading && isEquipped(_,equippedWearables))?{
                    textureMode:"nine-slices",
                    texture: {
                        // TODO improve image border
                        src:'assets/images/backgrounds/rounded-border.png',
                    },
                    textureSlices:{ // TODO refactor move to constant TEXTURE_SLICES_05
                        top: 0.5,
                        bottom: 0.5,
                        left: 0.5,
                        right: 0.5
                    },
                    color:COLOR.ACTIVE_BACKGROUND_COLOR
                }:undefined}
            >
                <WearableCell catalystWearable={_} canvasScaleRatio={canvasScaleRatio} equipped={false} loading={loading} />
            </UiEntity>;
        })}</UiEntity>
}

function isEquipped(wearable:CatalogWearableElement, equippedWearables:URN[]):Boolean {
    if(wearable === null) return false;
    return equippedWearables.includes(wearable.urn);
}

export type WearableCellProps = {
    equipped:boolean,
    canvasScaleRatio:number,
    loading:boolean,
    catalystWearable:CatalogWearableElement
}

function WearableCell({equipped, canvasScaleRatio, loading, catalystWearable}:WearableCellProps):ReactElement{
    return <UiEntity
        uiTransform={{
            width:"100%",
            height:"100%",
        }}
        uiBackground={{
            ...( loading ? LOADING_TEXTURE_PROPS : getBackgroundFromAtlas({
                spriteName:catalystWearable?.rarity ?? 'base',
                atlasName:"backpack"
            }) )
        }}
    >
        {(!loading && (Boolean((catalystWearable?.urn)))) ? <UiEntity
            uiTransform={{
                width:"100%",
                height:"100%",
            }}
            uiBackground={{
                texture:{
                    src:`https://peer.decentraland.org/lambdas/collections/contents/${catalystWearable.urn}/thumbnail`
                },
                textureMode: "stretch"
            }}
        ></UiEntity> : null}
    </UiEntity>
}