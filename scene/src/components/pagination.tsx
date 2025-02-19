import ReactEcs, {type ReactElement} from "@dcl/react-ecs";
import {UiEntity} from "@dcl/sdk/react-ecs";
import {Color4} from "@dcl/sdk/math";
import {getCanvasScaleRatio} from "../service/canvas-ratio";
import {ButtonIcon} from "./button-icon";
import {NavButton} from "./nav-button/NavButton";
import {TRANSPARENT} from "../utils/constants";

export type PaginationProps = {
    pages:number,
    currentPage:number,
    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange:Function
}

export function Pagination({pages, currentPage, onChange}:PaginationProps):ReactElement{
    const canvasScaleRatio = getCanvasScaleRatio();
    const pageElements = new Array(Math.min(5, pages)).fill(null).map((_,index)=>{
        return index + currentPage;
    })
    return <UiEntity
        uiTransform={{
            justifyContent:"center",
            positionType:"relative",
            margin:{top:100 * canvasScaleRatio,}
        }}
        uiBackground={{
            color:Color4.create(1,0,0,0.0)
        }}
    >
        <ButtonIcon icon={{spriteName:"LeftArrow", atlasName:"icons"}} iconSize={60 * canvasScaleRatio} />
        {pageElements.map((pageElement)=>
            <NavButton
                active={currentPage === pageElement}
                text={pageElement.toString()}
                backgroundColor={currentPage === pageElement?undefined:TRANSPARENT}
                color={Color4.White()}
            />)}
        <ButtonIcon icon={{spriteName:"RightArrow", atlasName:"icons"}} iconSize={60 * canvasScaleRatio} />
    </UiEntity>
}
