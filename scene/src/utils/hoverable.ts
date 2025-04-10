import ReactEcs, { Button, Callback, UiButtonProps, UiEntity, UiLabelProps, EntityPropTypes } from '@dcl/react-ecs';

const hoverState: {
    hoveredItem: [string | null, number];
    enter: (key: string | undefined) => void;
    leave: (key: string | undefined) => void;
    is: (key: string) => boolean;
} = {
    hoveredItem: [null, 0],
    enter: (key) => {
        if (hoverState.hoveredItem[0] === key) {
            hoverState.hoveredItem[1] += 1;
        } else if (key !== undefined) {
            hoverState.hoveredItem = [key, 1];
        }
        console.log(`enter ${key} -> ${hoverState.hoveredItem}`)
    },
    leave: (key) => {
        if (hoverState.hoveredItem[0] === key) {
            hoverState.hoveredItem[1] = Math.max(0, hoverState.hoveredItem[1] - 1);
        }
        console.log(`leave ${key} -> ${hoverState.hoveredItem}`)
    },
    is: (itemKey) => {
        return hoverState.hoveredItem[0] === itemKey && hoverState.hoveredItem[1] > 0;
    }
};

interface HoverProps {
    hoverKey: string | undefined,
    onMouseEnter?: Callback,
    onMouseLeave?: Callback,
}

interface BaseHoverProps {
    onMouseEnter?: Callback;
    onMouseLeave?: Callback;
}

function HoverWrapper<P extends BaseHoverProps>(fn: (props: P) => ReactEcs.JSX.Element): (props: HoverProps & P) => ReactEcs.JSX.Element {
    return (props: HoverProps & P) => {
        const {
            hoverKey,
            onMouseEnter: originalEnter,
            onMouseLeave: originalLeave,
            ...otherProps
        } = props;
    
        const propsForFn: P = {
            onMouseEnter: () => {
                hoverState.enter(hoverKey);
                originalEnter?.();
            },
            onMouseLeave: () => {
                hoverState.leave(hoverKey);
                originalLeave?.();
            },
            ...(otherProps as Omit<P, keyof BaseHoverProps>),

        } as P;

        return fn(propsForFn);
    }
}

export const HoverUiEntity = HoverWrapper<EntityPropTypes & { uiText?: UiLabelProps }>(UiEntity);
export const HoverButton = HoverWrapper<UiButtonProps>(Button);
// etc

export function isHovered(key: string): boolean {
    return hoverState.is(key)
}
