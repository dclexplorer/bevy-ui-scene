import ReactEcs, { Button, type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import { closeLastPopupAction } from '../../state/hud/actions'
import { getContentScaleRatio } from '../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../utils/ui-utils'
import { noop } from '../../utils/function-utils'
import Icon from '../../components/icon/Icon'
import { Color4 } from '@dcl/sdk/math'
import { type Popup } from '../../components/popup-stack'
import { CopyButton } from '../../components/copy-button'
const { useEffect, useState } = ReactEcs

export const ErrorPopup: Popup = ({ shownPopup }) => {
  const error = shownPopup.data

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <ErrorContent error={error} />
    </UiEntity>
  )
}

function ErrorContent({ error }: { error: unknown }): ReactElement {
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    extractErrorDetails(error).catch(console.error)
  }, [error])

  return (
    <UiEntity
      uiTransform={{
        width: getContentScaleRatio() * 1200,
        height: getContentScaleRatio() * 750,
        borderRadius: BORDER_RADIUS_F,
        borderWidth: 0,
        borderColor: COLOR.WHITE,
        alignItems: 'center',
        flexDirection: 'column',
        padding: '1%'
      }}
      onMouseDown={noop}
      uiBackground={{
        color: COLOR.WHITE
      }}
    >
      <Icon
        uiTransform={{
          positionType: 'absolute',
          position: { top: '4%' }
        }}
        icon={{ spriteName: 'BugIcon', atlasName: 'icons' }}
        iconSize={getContentScaleRatio() * 96}
        iconColor={COLOR.RED}
      />

      <UiEntity
        uiTransform={{
          margin: { top: '8%' },
          borderRadius: BORDER_RADIUS_F,
          borderWidth: 0,
          borderColor: COLOR.RED,
          width: '90%',
          height: '60%',
          overflow: 'scroll',
          scrollVisible: 'both'
        }}
      >
        <UiEntity
          uiTransform={{ width: '100%', height: '100%' }}
          uiText={{
            value: `<b>Error Details:</b>\n${errorDetails}`,
            color: COLOR.RED,
            textWrap: 'wrap',
            fontSize: getContentScaleRatio() * 42
          }}
        />
      </UiEntity>

      <UiEntity
        uiTransform={{
          position: { left: '0%', top: '5%' },
          alignItems: 'space-between',
          justifyContent: 'center'
        }}
      >
        <Button
          uiTransform={{
            margin: '2%',
            width: getContentScaleRatio() * 400,
            borderRadius: BORDER_RADIUS_F / 2,
            borderWidth: 0,
            borderColor: Color4.White()
          }}
          value={'OK'}
          variant={'secondary'}
          uiBackground={{ color: COLOR.TEXT_COLOR }}
          color={Color4.White()}
          fontSize={getContentScaleRatio() * 28}
          onMouseDown={() => {
            closeDialog()
          }}
        />
        {(errorDetails?.length && (
          <CopyButton
            fontSize={getContentScaleRatio() * 80}
            text={errorDetails}
            elementId={'copy-error-details' + errorDetails.length}
            variant={'dark'}
          />
        )) ||
          null}
      </UiEntity>
    </UiEntity>
  )

  async function extractErrorDetails(err: any): Promise<void> {
    let message = ''

    if (typeof err === 'string') {
      message = err
    } else if (err instanceof Error || err instanceof Object) {
      message = err.message || err.toString()

      if (err.data) {
        message += `\n\nData:\n${JSON.stringify(err.data, null, 2)}`
      }

      if (err.body) {
        message += `\n\nBody:\n${JSON.stringify(err.body, null, 2)}`
      }

      if (err.response?.data) {
        message += `\n\nResponse data:\n${JSON.stringify(
          err.response.data,
          null,
          2
        )}`
      }

      if (err.stack) {
        message += `\n\nStack:\n${err.stack}`
      }

      setErrorDetails(message)
    } else if (err && typeof err === 'object') {
      // fallback: dump whole object
      setErrorDetails(JSON.stringify(err, null, 2))
    } else {
      setErrorDetails(String(err))
    }
  }
}

function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}
