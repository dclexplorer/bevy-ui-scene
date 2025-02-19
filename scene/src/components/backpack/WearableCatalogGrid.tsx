import {UiEntity, UiTransformProps} from "@dcl/sdk/react-ecs";
import ReactEcs, {type ReactElement} from "@dcl/react-ecs";
import {type URN} from "../../utils/definitions";
import {Color4} from "@dcl/sdk/math";
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
import {getBackgroundFromAtlas} from "../../utils/ui-utils";
// TODO import {WearableData} from "../../ui-classes/photos/Photos.types";
export type WearableCatalogGridProps = {
    wearables: any[] // TODO review what is the definition we will use
    equippedWearables: URN[],
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
                key={index}
                uiTransform={{
                    width:180 * canvasScaleRatio,
                    height:180 * canvasScaleRatio,
                    padding: 10 * canvasScaleRatio,
                    margin: 10 * canvasScaleRatio,
                }}
                uiBackground={{
                    ...( loading ? LOADING_TEXTURE_PROPS : undefined )
                }}
            >
                {(!loading && (Boolean((_?.urn)))) ? <UiEntity
                    uiTransform={{
                        width:"100%",
                        height:"100%",
                    }}
                    uiBackground={{
                        texture:{
                            src:`https://peer.decentraland.org/lambdas/collections/contents/${_.urn}/thumbnail`
                        },
                        textureMode: "stretch"
                    }}
                ></UiEntity> : null}
            </UiEntity>;
        })}</UiEntity>
}