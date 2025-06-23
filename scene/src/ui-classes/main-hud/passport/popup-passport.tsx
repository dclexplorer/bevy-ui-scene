import ReactEcs, { Button, type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { store } from '../../../state/store'
import {
  closeLastPopupAction,
  HUD_ACTION,
  pushPopupAction
} from '../../../state/hud/actions'
import { HUD_POPUP_TYPE, type HUDPopup } from '../../../state/hud/state'
import { memoize, noop } from '../../../utils/function-utils'
import { Content } from '../../main-menu/backpack-page/BackpackPage'
import { AvatarPreviewElement } from '../../../components/backpack/AvatarPreviewElement'
import {
  createAvatarPreview,
  updateAvatarPreview
} from '../../../components/backpack/AvatarPreview'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { copyToClipboard } from '~system/RestrictedActions'
import {
  applyMiddleEllipsis,
  getURNWithoutTokenId
} from '../../../utils/urn-utils'
import { type URN, type URNWithoutTokenId } from '../../../utils/definitions'
import { convertToPBAvatarBase, sleep } from '../../../utils/dcl-utils'
import { executeTask } from '@dcl/sdk/ecs'
import { type PBAvatarBase } from '../../../bevy-api/interface'
import { type WearableCategory } from '../../../service/categories'
import { TabComponent } from '../../../components/tab-component'
import { type Popup } from '../../../components/popup-stack'
import { fetchProfileData } from '../../../utils/passport-promise-utils'
import { Label } from '@dcl/sdk/react-ecs'
import Icon from '../../../components/icon/Icon'
import {
  editablePropertyKeys,
  ProfilePropertyField
} from './profile-property-input'
import { ButtonIcon } from '../../../components/button-icon'
import { TopBorder } from '../../../components/bottom-border'

const COPY_ICON_SIZE = 40

export type ViewAvatarData = Record<string, any> & {
  hasClaimedName: boolean
  description: string
  country: string
  language: string
  gender: string
  relationshipStatus: string
  sexualOrientation: string
  employmentStatus: string
  pronouns: string
  profession: string
  birthdate: number
  hobbies: string
  name: string
  links: Array<{ url: string; title: string }>
  userId: string
}

export type PassportPopupState = {
  loadingProfile: boolean
  savingProfile: boolean
  profileData: ViewAvatarData
  copying: null | string
  editing: boolean
  editable: boolean
}
const state: PassportPopupState = {
  editing: true,
  editable: true,
  loadingProfile: true,
  savingProfile: false,
  copying: null,
  profileData: {
    userId: '',
    hasClaimedName: false,
    name: '',
    description: '',
    country: '',
    language: '',
    gender: '',
    relationshipStatus: '',
    sexualOrientation: '',
    employmentStatus: '',
    pronouns: '',
    profession: '',
    birthdate: 0,
    hobbies: '',
    links: []
  }
}

/**
 * setupPassportPopup: executed one time when the explorer is initialized
 */
export function setupPassportPopup(): void {
  // When passport is open, the avatar preview is initialized and/or updated & profile data loaded
  store.subscribe((action, previousState) => {
    if (
      action.type === HUD_ACTION.PUSH_POPUP &&
      (action.payload as HUDPopup).type === HUD_POPUP_TYPE.PASSPORT
    ) {
      // TODO review if a passport can be opened when other passport is open (popups are stackable), then we should check last popup type/data to update avatarPreview and profileData
      state.loadingProfile = true
      executeTask(async () => {
        const shownPopup = action.payload as HUDPopup
        const userId: string = shownPopup.data
        const profileData = await fetchProfileData({ userId })
        const [avatarData] = profileData.avatars
        Object.assign(state.profileData, avatarData as ViewAvatarData)
        createAvatarPreview()
        const wearables: URNWithoutTokenId[] = (
          avatarData.avatar.wearables ?? []
        ).map((urn) => getURNWithoutTokenId(urn as URN)) as URNWithoutTokenId[]
        updateAvatarPreview(
          wearables,
          convertToPBAvatarBase(avatarData) as PBAvatarBase,
          avatarData.avatar.forceRender as WearableCategory[]
        )
        state.loadingProfile = false
      })
    }
  })
}

export const PopupPassport: Popup = ({ shownPopup }) => {
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
        color: COLOR.DARK_OPACITY_9
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <Content>
        <UiEntity
          uiTransform={{
            width: '80%',
            height: '100%',
            pointerFilter: 'block',
            flexDirection: 'row'
          }}
          onMouseDown={noop}
          uiBackground={{
            texture: { src: 'assets/images/passport/background.png' },
            textureMode: 'stretch'
          }}
        >
          {!state.loadingProfile && [
            <AvatarPreviewElement
              uiTransform={{
                position: { top: '-18%' },
                flexShrink: 0,
                flexGrow: 0
              }}
            />,
            <ProfileContent />
          ]}
          {state.loadingProfile && (
            <Label
              value={'Loading ...'}
              fontSize={getCanvasScaleRatio() * 32}
            />
          )}
        </UiEntity>
      </Content>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}
const _getVisibleProperties = memoize(getVisibleProperties)
function getVisibleProperties(profileData: ViewAvatarData): string[] {
  return editablePropertyKeys.filter((key) => key && !!profileData[key])
}

function ProfileContent(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        padding: { top: '1%' },
        flexGrow: 1
      }}
      onMouseDown={noop}
    >
      <Header>
        {NameRow({
          name: state.profileData.name,
          fontSize: getCanvasScaleRatio() * 40,
          hasClaimedName: state.profileData.hasClaimedName
        })}
        {AddressRow({
          // TODO review if need to check isGuest (not available in catalyst remote profile)
          address: state.profileData.userId,
          fontSize: getCanvasScaleRatio() * 28
        })}
      </Header>
      <TabComponent
        uiTransform={{
          margin: { top: '5%' }
        }}
        tabs={[
          {
            text: 'OVERVIEW',
            active: true
          },
          {
            text: 'BADGES'
          },
          {
            text: 'PHOTOS'
          }
        ]}
        fontSize={getCanvasScaleRatio() * 32}
      />
      <Overview />
    </UiEntity>
  )
}
function Overview(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        margin: { top: '1%' },
        padding: '2%',
        width: '96%',
        borderRadius: getCanvasScaleRatio() * 20,
        borderColor: COLOR.TEXT_COLOR_WHITE,
        borderWidth: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}
      uiBackground={{ color: COLOR.DARK_OPACITY_5 }}
    >
      {state.editable && !state.editing && (
        <ButtonIcon
          uiTransform={{
            padding: getCanvasScaleRatio() * 8,
            positionType: 'absolute',
            position: { right: '2%' }
          }}
          icon={{ spriteName: 'Edit', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 40}
          backgroundColor={COLOR.WHITE_OPACITY_1}
          onMouseDown={() => {
            state.editing = true
          }}
        />
      )}
      <UiEntity
        uiText={{
          value: '<b>ABOUT ME</b>',
          fontSize: getCanvasScaleRatio() * 32
        }}
      />

      <ProfilePropertyField
        uiTransform={{ width: '100%' }}
        propertyKey={'description'}
        profileData={state.profileData}
        editing={state.editing}
        disabled={state.savingProfile}
      />

      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          flexShrink: 1,
          flex: 1,
          flexWrap: 'wrap',
          width: '100%',
          margin: { top: '2%' }
        }}
      >
        {!state.editing &&
          _getVisibleProperties(state.profileData).map(
            (propertyKey: keyof ViewAvatarData) => (
              <ProfilePropertyField
                propertyKey={propertyKey ?? ''}
                profileData={state.profileData}
                editing={state.editing}
                disabled={state.savingProfile}
              />
            )
          )}
        {state.editing &&
          editablePropertyKeys.map((propertyKey: keyof ViewAvatarData) => (
            <ProfilePropertyField
              propertyKey={propertyKey ?? ''}
              profileData={state.profileData}
              editing={state.editing}
            />
          ))}
      </UiEntity>
      {state.profileData.links.length > 0 && [
        <UiEntity
          uiTransform={{
            margin: { top: '5%' }
          }}
          uiText={{
            value: '<b>LINKS</b>',
            fontSize: getCanvasScaleRatio() * 30
          }}
        />,
        state.editing && (
          <UiEntity
            uiText={{
              value:
                'Add a maximum of 5 links to promote your personal website or social networks.',
              fontSize: getCanvasScaleRatio() * 30
            }}
          />
        ),
        <UiEntity uiTransform={{ flexDirection: 'row' }}>
          {state.profileData.links.map(
            (link: { title: string; url: string }) => (
              <ProfileLink link={link} editing={state.editing} />
            )
          )}
        </UiEntity>
      ]}
      {state.editing && (
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: '100%',
            padding: { top: '1%' },
            justifyContent: 'flex-end'
          }}
        >
          <TopBorder
            color={COLOR.WHITE_OPACITY_2}
            uiTransform={{
              height: 1
            }}
          />
          <Button
            uiTransform={{
              borderRadius: getCanvasScaleRatio() * 10,
              borderColor: COLOR.BLACK_TRANSPARENT,
              borderWidth: 0,
              width: getCanvasScaleRatio() * 150,
              margin: { right: '1%' }
            }}
            uiBackground={{
              color: COLOR.WHITE_OPACITY_1
            }}
            onMouseDown={() => {
              state.editing = false
            }}
            disabled={state.savingProfile || state.loadingProfile}
            value={'CANCEL'}
          />
          <Button
            uiTransform={{
              borderRadius: getCanvasScaleRatio() * 10,
              borderColor: COLOR.BLACK_TRANSPARENT,
              borderWidth: 0,
              width: getCanvasScaleRatio() * 150
            }}
            disabled={state.savingProfile || state.loadingProfile}
            value={'SAVE'}
            onMouseDown={() => {
              executeTask(async () => {
                // TODO we are mocking async save request, replace with appropriate BevyApi or implement own signed fetch
                state.savingProfile = true
                await sleep(1000)
                state.savingProfile = false
                state.editing = false
              })
            }}
          />
        </UiEntity>
      )}
    </UiEntity>
  )
}

function ProfileLink({
  link,
  editing
}: {
  link: { url: string; title: string }
  editing?: boolean
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        padding: getCanvasScaleRatio() * 10,
        margin: getCanvasScaleRatio() * 10,
        borderRadius: getCanvasScaleRatio() * 20,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 0
      }}
      uiBackground={{ color: COLOR.DARK_OPACITY_5 }}
      onMouseDown={() => {
        store.dispatch(
          pushPopupAction({
            type: HUD_POPUP_TYPE.URL,
            data: link.url
          })
        )
      }}
    >
      <Icon
        uiTransform={{
          position: {
            top: getCanvasScaleRatio() * 15,
            left: getCanvasScaleRatio() * 10
          }
        }}
        icon={{
          atlasName: 'icons',
          spriteName: 'Link'
        }}
        iconSize={getCanvasScaleRatio() * 40}
        iconColor={COLOR.LINK_BLUE}
      />
      <UiEntity
        uiText={{
          value: link.title,
          color: COLOR.LINK_BLUE,
          fontSize: getCanvasScaleRatio() * 32
        }}
      />
      {editing && (
        <ButtonIcon
          icon={{ spriteName: 'CloseIcon', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 30}
          uiBackground={{ color: COLOR.BLACK }}
          onMouseDown={() => {
            state.profileData.links = state.profileData.links.filter(
              (x) => x.url !== link.url
            )
          }}
        />
      )}
    </UiEntity>
  )
}

const _applyMiddleEllipsis = memoize(applyMiddleEllipsis)

function AddressRow({
  address,
  fontSize
}: {
  address: string
  fontSize: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <UiEntity
        uiText={{
          value: _applyMiddleEllipsis(address),
          fontSize,
          textAlign: 'middle-left',
          color: COLOR.INACTIVE
        }}
        uiTransform={{
          padding: 0,
          margin: { left: '-5%' }
        }}
      />
      {CopyButton({
        fontSize: getCanvasScaleRatio() * COPY_ICON_SIZE,
        text: address,
        elementId: 'copy-address'
      })}
    </UiEntity>
  )
}

function NameRow({
  name,
  fontSize,
  hasClaimedName
}: {
  name: string
  fontSize: number
  hasClaimedName: boolean
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <StatusIcon fontSize={fontSize} />
      <UiEntity
        uiText={{ value: name, fontSize, textAlign: 'middle-left' }}
        uiTransform={{
          padding: 0,
          margin: { left: '-5%' }
        }}
      />
      {hasClaimedName && (
        <UiEntity
          uiTransform={{
            width: fontSize,
            height: fontSize
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'icons',
            spriteName: 'Verified'
          })}
        />
      )}
      {CopyButton({
        fontSize: getCanvasScaleRatio() * COPY_ICON_SIZE,
        text: name,
        elementId: 'copy-name'
      })}
    </UiEntity>
  )
}

function CopyButton({
  fontSize,
  text,
  elementId
}: {
  fontSize: number
  text: string
  elementId: string
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: fontSize,
        height: fontSize,
        margin: { left: '5%' }
      }}
      uiBackground={{
        ...getBackgroundFromAtlas({
          atlasName: 'icons',
          spriteName: 'CopyIcon'
        }),
        color: state.copying === elementId ? COLOR.WHITE : COLOR.WHITE_OPACITY_2
      }}
      onMouseDown={() => {
        executeTask(async () => {
          state.copying = elementId
          copyToClipboard({ text }).catch(console.error)
          await sleep(200)
          state.copying = null
        })
      }}
    />
  )
}

function StatusIcon({ fontSize }: { fontSize: number }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: fontSize * 0.6,
        height: fontSize * 0.6,
        borderRadius: 9999,
        borderWidth: 3 * getCanvasScaleRatio(),
        borderColor: COLOR.WHITE
      }}
      uiBackground={{ color: COLOR.STATUS_ACTIVE }} // TODO real status
    />
  )
}
function Header({ children }: { children?: ReactElement }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      {children}
    </UiEntity>
  )
}
