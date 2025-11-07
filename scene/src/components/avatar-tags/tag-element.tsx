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
          width: 200,
          height: 40,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLOR.BLACK_TRANSPARENT,
          alignSelf: 'center',
          flexGrow: 1,
          flexShrink: 1
        }}
        uiBackground={{
          color: COLOR.DARK_OPACITY_5
        }}
        uiText={{
          value: `<b>${player.name}</b>`,
          fontSize: 20,
          color: getAddressColor(player.userId)
        }}
      />
    )
  }
}
