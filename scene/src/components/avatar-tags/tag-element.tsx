import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../color-palette'
import useEffect = ReactEcs.useEffect
import { GetPlayerDataRes } from '../../utils/definitions'
import { getAddressColor } from '../../ui-classes/main-hud/chat-and-logs/ColorByAddress'

export function getTagElement({
  player
}: {
  player: GetPlayerDataRes
}): () => ReactElement {
  return function TagElement(): ReactElement {
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <UiEntity
          uiTransform={{
            borderRadius: 999,
            borderWidth: 1,
            borderColor: COLOR.BLACK_TRANSPARENT,
            alignSelf: 'center',
            padding: {
              top: 5,
              bottom: 5,
              left: 10,
              right: 10
            }
          }}
          uiBackground={{
            color: COLOR.DARK_OPACITY_7
          }}
          uiText={{
            value: `<b>${player.name}</b>`,
            fontSize: 20,
            color: getAddressColor(player.userId),
            textAlign: 'middle-center'
          }}
        ></UiEntity>
      </UiEntity>
    )
  }
}
