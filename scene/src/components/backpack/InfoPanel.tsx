import {getBackgroundFromAtlas} from "../../utils/ui-utils";
import ReactEcs, {type ReactElement, UiEntity} from "@dcl/react-ecs";
import {CatalystWearable, RarityName} from "../../utils/wearables-definitions";
import Icon from "../icon/Icon";
import {Label} from "@dcl/sdk/react-ecs";

import {RARITY_COLORS} from "../color-palette";

export type InfoPanelProps = {
    canvasScaleRatio: number,
    wearable: CatalystWearable | null
}

export function InfoPanel({canvasScaleRatio, wearable}: InfoPanelProps): ReactElement {
    const rarityColor = RARITY_COLORS[wearable?.rarity as RarityName];
    return <UiEntity uiTransform={{
        margin: {left: 40 * canvasScaleRatio},
        width: 600 * canvasScaleRatio,
        height: 1400 * canvasScaleRatio,
        flexDirection: "column"
    }}
                     uiBackground={{
                         ...getBackgroundFromAtlas({
                             atlasName: "info-panel",
                             spriteName: wearable === null
                                 ? 'empty'
                                 : (wearable?.rarity !== undefined) ? wearable.rarity : 'base'
                         })

                     }}
    >
        {wearable !== null ?
            <UiEntity uiTransform={{alignSelf: "center", flexDirection: "column"}}>
                <UiEntity
                    uiTransform={{
                        width: canvasScaleRatio * 400,
                        height: canvasScaleRatio * 400,
                        alignSelf: "center",
                        margin: {top: 80 * canvasScaleRatio}
                    }}
                    uiBackground={{
                        texture: {
                            src: `https://peer.decentraland.org/lambdas/collections/contents/${wearable?.id}/thumbnail`
                        },
                        textureMode: "stretch"
                    }}/>
                <UiEntity uiTransform={{
                    flexDirection: "row",
                    margin: {top: 80 * canvasScaleRatio},
                }}>
                    <Icon icon={{
                        spriteName: 'Wearables',
                        atlasName: 'icons'
                    }} iconSize={35 * canvasScaleRatio} uiTransform={{
                        alignSelf: "center",
                    }}/>
                    <Label value={`<b>${wearable?.name}</b>`} fontSize={35 * canvasScaleRatio}/>
                </UiEntity>
                { /* rarity tag // TODO create component <Tag /> */}
                <UiEntity
                    uiTransform={{
                        flexDirection: "row",
                        flexShrink:0,
                        flexGrow:0,
                        flexBasis:0
                    }}
                >
                    <UiEntity
                        uiTransform={{
                            padding:{left:6*canvasScaleRatio, right:6*canvasScaleRatio}
                        }}
                        uiBackground={{
                        textureMode:"nine-slices",
                        texture: {
                            src:'assets/images/backgrounds/rounded.png',
                        },
                        textureSlices:{ // TODO refactor move to constant TEXTURE_SLICES_05
                            top: 0.5,
                            bottom: 0.5,
                            left: 0.5,
                            right: 0.5
                        },
                        color:rarityColor
                    }}>
                        <Label value={`LEGENDARY`} fontSize={26 * canvasScaleRatio}/>
                    </UiEntity>

                </UiEntity>
                <Label value={`<b>DESCRIPTION</b>`}  fontSize={26 * canvasScaleRatio} uiTransform={{
                    alignSelf:"flex-start",
                    margin:{top:10*canvasScaleRatio}
                }} />
                <UiEntity uiTransform={{
                    flexDirection: "row",
                    width:canvasScaleRatio * (600 - 80),
                }}>
                    <UiEntity
                        uiText={{
                            value:`${wearable?.description}`,
                            textAlign:"top-left",
                            fontSize:26 * canvasScaleRatio
                        }}
                    />
                </UiEntity>
            </UiEntity>
            : null}

    </UiEntity>
}