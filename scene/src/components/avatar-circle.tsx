import { getCanvasScaleRatio } from '../service/canvas-ratio'
import ReactEcs, { UiEntity, UiTransformProps } from '@dcl/sdk/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { COLOR } from './color-palette'
import { isSystemMessage } from './chat-message/ChatMessage'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { getAddressColor } from '../ui-classes/main-hud/chat-and-logs/ColorByAddress'
import { Color4 } from '@dcl/sdk/math'
import { ZERO_ADDRESS } from '../utils/constants'

export function AvatarCircle({
  userId,
  circleColor,
  uiTransform,
  isGuest
}: {
  userId: string
  circleColor: Color4
  uiTransform: UiTransformProps
  isGuest: boolean
}) {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  const addressColor = circleColor || getAddressColor(userId)
  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 64,
        height: getCanvasScaleRatio() * 64,
        justifyContent: 'center',
        alignItems: 'center',
        /*      margin:
        props.message.sender_address === myPlayer.userId
          ? { left: canvasInfo.width * 0.005 }
          : { right: canvasInfo.width * 0.005 },*/
        borderRadius: 999,
        borderWidth: getCanvasScaleRatio() * 3,
        borderColor: addressColor,
        ...uiTransform
      }}
      uiBackground={{
        color: { ...addressColor, a: 0.3 }
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%'
        }}
        uiBackground={
          ZERO_ADDRESS === userId
            ? getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: 'DdlIconColor'
              })
            : isGuest
            ? {
                ...getBackgroundFromAtlas({
                  atlasName: 'icons', // TODO review to use guest real avatar profile image, for which avatarTexture don't work, review how unity explorer does for guests
                  spriteName: 'Members'
                }),
                color: COLOR.WHITE_OPACITY_2
              }
            : {
                textureMode: 'stretch',
                avatarTexture: {
                  userId
                }
              }
        }
      />
    </UiEntity>
  )
}
