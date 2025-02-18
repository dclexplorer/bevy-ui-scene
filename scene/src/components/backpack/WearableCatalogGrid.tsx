import {UiEntity, UiTransformProps} from "@dcl/sdk/react-ecs";
import ReactEcs, {type ReactElement} from "@dcl/react-ecs";
import {type URN} from "../../utils/definitions";
import {Color4} from "@dcl/sdk/math";
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
// TODO import {WearableData} from "../../ui-classes/photos/Photos.types";
export type WearableCatalogGridProps = {
    wearables: any[] // TODO review what is the definition we will use
    equippedWearables: URN[],
    uiTransorm:UiTransformProps
}

export function WearableCatalogGrid({wearables, equippedWearables, uiTransorm}: WearableCatalogGridProps): ReactElement {
    const canvasScaleRatio = getCanvasScaleRatio();
    return <UiEntity uiTransform={{
        padding: 10 * canvasScaleRatio,
        width: 840 * canvasScaleRatio,
        flexWrap: 'wrap',
        ...uiTransorm
    }} uiBackground={{color: Color4.create(1, 0, 0, 0.5)}}>
        {wearables.map(() => {
            return <UiEntity
                uiTransform={{
                    width:180 * canvasScaleRatio,
                    height:180 * canvasScaleRatio,
                    padding: 10 * canvasScaleRatio,
                    margin: 10 * canvasScaleRatio,
                }} uiBackground={{color: Color4.create(0, 1, 0, 0.5)}}
            ></UiEntity>;
        })}</UiEntity>
}