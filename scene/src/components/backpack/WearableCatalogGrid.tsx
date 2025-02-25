import {Label, UiEntity, type UiTransformProps} from "@dcl/sdk/react-ecs";
import ReactEcs, {type ReactElement} from "@dcl/react-ecs";
import {type URN, type URNWithoutTokenId} from "../../utils/definitions";
import {Color4} from "@dcl/sdk/math";
import {getCanvasScaleRatio} from "../../service/canvas-ratio";
import {getBackgroundFromAtlas} from "../../utils/ui-utils";
import type {CatalogWearableElement} from "../../utils/wearables-definitions";
import {COLOR} from "../color-palette";
import {noop} from "../../utils/function-utils";
import {getURNWithoutTokenId} from "../../utils/wearables-promise-utils";
// TODO when  loading, don't let change any filter : category

export type WearableCatalogGridProps = {
    wearables: CatalogWearableElement[] // TODO review what is the definition we will use
    equippedWearables: URN[],
    uiTransform:UiTransformProps,
    loading: boolean,
    onChangeSelection?: (wearableURN:URNWithoutTokenId|null)=>void
    onEquipWearable:(wearable:CatalogWearableElement)=>Promise<void>|void
    onUnequipWearable:(wearable:CatalogWearableElement)=>Promise<void>|void
}

type WearableCatalogGridState = {
    selectedWearableURN:URNWithoutTokenId|null
}

const LOADING_TEXTURE_PROPS = getBackgroundFromAtlas({
    atlasName:"backpack",
    spriteName: "loading-wearable"
})

const state:WearableCatalogGridState = {
    selectedWearableURN:null
}

const SELECTED_BACKGROUND = {
    ...getBackgroundFromAtlas({
        atlasName:"backpack", spriteName:"selection"
    })
}

export function WearableCatalogGrid({wearables, equippedWearables, uiTransform, loading, onChangeSelection = noop, onEquipWearable = noop, onUnequipWearable = noop}: WearableCatalogGridProps): ReactElement {
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
                }
                }
                key={index}
                uiBackground={((!loading && isEquipped(_,equippedWearables) && !isSelected(_?.urn))?{
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
                }:{})}
                onMouseDown={
                    ()=>{
                        select(isSelected(_.urn) ? null : _.urn);
                        onChangeSelection(state.selectedWearableURN)
                    }
                }
            >
                {state.selectedWearableURN !== _?.urn ? <WearableCellThumbnail catalystWearable={_} canvasScaleRatio={canvasScaleRatio} loading={loading} /> : null}
                { state.selectedWearableURN === _?.urn && !loading
                    ? <UiEntity uiTransform={{
                        width:canvasScaleRatio * 220,
                        height:canvasScaleRatio * 300,
                        positionType: "absolute",
                        position:{
                            top:-6*canvasScaleRatio,
                            left:-16*canvasScaleRatio
                        },
                        padding:{
                            top:24*canvasScaleRatio,
                            left:16*canvasScaleRatio
                        },
                        zIndex:2,
                        flexDirection:"column",
                        pointerFilter:'none'
                    }}
                                uiBackground={SELECTED_BACKGROUND} >
                        <WearableCellThumbnail catalystWearable={_} canvasScaleRatio={canvasScaleRatio} loading={loading} />
                        <RoundedButton
                            uiTransform={{
                                margin:{top:10*canvasScaleRatio},
                                width:180*canvasScaleRatio,
                                height:60*canvasScaleRatio
                            }}
                            fontSize={26*canvasScaleRatio}
                            text={isEquipped(_, equippedWearables)?"UNEQUIP":"EQUIP"}
                            isSecondary={isEquipped(_, equippedWearables)}
                            onClick={()=>{
                                if(isEquipped(_, equippedWearables)) {
                                    void onUnequipWearable(_);
                                }else {
                                    void onEquipWearable(_);
                                }
                            }}
                        />
                    </UiEntity>
                    : null}
            </UiEntity>;
        })}</UiEntity>
}

function isSelected(wearableURN:URNWithoutTokenId):boolean{
    return state.selectedWearableURN === wearableURN;
}


function select(wearableURNWithoutTokenId: null | URNWithoutTokenId):void {
    state.selectedWearableURN = wearableURNWithoutTokenId;
}

const isEquippedMemo:{
    equippedWearables:URN[]
    memo:Record<URN, boolean> // TODO consider using Map if possible for performance improvement because long keys
} = {
    equippedWearables:[],
    memo:{}
};

function isEquipped(wearable:CatalogWearableElement, equippedWearables:URN[] = []):boolean {
    if(wearable === null) return false;
    if(equippedWearables !== isEquippedMemo.equippedWearables){
        isEquippedMemo.equippedWearables = equippedWearables;
        isEquippedMemo.memo = {};
    }
    if(isEquippedMemo.memo[wearable.urn] !== undefined) return isEquippedMemo.memo[wearable.urn];
    isEquippedMemo.memo[wearable.urn] = equippedWearables.map(i=> getURNWithoutTokenId(i)).includes(wearable.urn)
    return isEquippedMemo.memo[wearable.urn];
}

export type WearableCellProps = {
    canvasScaleRatio:number,
    loading:boolean,
    catalystWearable:CatalogWearableElement
}
type RoundedButtonProps = {
    uiTransform?:UiTransformProps,
    isSecondary?:boolean,
    onClick?:()=>void,
    text:string,
    fontSize?:number
}
function RoundedButton({isSecondary, text, onClick = noop, uiTransform, fontSize = 20}:RoundedButtonProps):ReactElement{
    return <UiEntity
        uiTransform={{
            pointerFilter: "block",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'center',
            ...uiTransform
        }}
        onMouseDown={()=>{onClick()}} uiBackground={{
        textureMode: 'nine-slices',
        texture: {
            src: 'assets/images/backgrounds/rounded.png'
        },
        textureSlices: {
            top: 0.5,
            bottom: 0.5,
            left: 0.5,
            right: 0.5
        },
        color:(isSecondary === true)?Color4.Black(): Color4.Red()
    }}>
        <Label value={text} fontSize={fontSize}/>
    </UiEntity>
}

function WearableCellThumbnail({canvasScaleRatio, loading, catalystWearable}:WearableCellProps):ReactElement{
    return <UiEntity
        uiTransform={{
            width:canvasScaleRatio * 180,
            height:canvasScaleRatio * 180,
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