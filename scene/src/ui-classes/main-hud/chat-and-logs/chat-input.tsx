import { ReactEcs, type ReactElement } from '@dcl/react-ecs'
import useState = ReactEcs.useState
import { ALMOST_WHITE } from '../../../utils/constants'
import { Input } from '@dcl/sdk/react-ecs'
import { focusChatInput } from './ChatsAndLogs'
import useEffect = ReactEcs.useEffect
import { store } from '../../../state/store'
import { updateHudStateAction } from '../../../state/hud/actions'
import { executeTask } from '@dcl/sdk/ecs'
import { sleep } from '../../../utils/dcl-utils'
const state = {
  visible: true
}

export function ChatInput({
  inputFontSize,
  onSubmit = () => {}
}: {
  inputFontSize: number
  onSubmit?: (value: string) => void
}): ReactElement | null {
  const [currentValue, setCurrentValue] = useState('')
  useEffect(() => {
    if (store.getState().hud.chatInput !== currentValue) {
      setCurrentValue(store.getState().hud.chatInput)

      executeTask(async () => {
        state.visible = false
        await sleep(0)
        state.visible = true
      })
    }
  }, [store.getState().hud.chatInput])
  if (!state.visible) return null
  return (
    <Input
      uiTransform={{
        elementId: 'chat-input',
        padding: { left: '1%' },
        width: '100%',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      value={currentValue}
      textAlign="middle-center"
      fontSize={inputFontSize}
      color={ALMOST_WHITE}
      placeholder="Press ENTER to chat"
      placeholderColor={{ ...ALMOST_WHITE, a: 0.6 }}
      onSubmit={(value) => {
        onSubmit(value)
        setCurrentValue('')
      }}
      onChange={(value: string) => {
        setCurrentValue(value)
        store.dispatch(
          updateHudStateAction({
            chatInput: value
          })
        )
      }}
      onMouseDown={() => {
        focusChatInput()
      }}
    />
  )
}
