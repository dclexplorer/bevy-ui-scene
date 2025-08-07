import ReactEcs, { Button, type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { store } from '../../../state/store'
import {
  closeLastPopupAction,
  HUD_ACTION,
  pushPopupAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import {
  EMPTY_PROFILE_DATA,
  HUD_POPUP_TYPE,
  type HUDPopup,
  type ViewAvatarData
} from '../../../state/hud/state'
import { cloneDeep, memoize, noop } from '../../../utils/function-utils'
import { ResponsiveContent } from '../../main-menu/backpack-page/BackpackPage'
import {
  AvatarPreviewElement,
  resetAvatarPreviewZoom
} from '../../../components/backpack/AvatarPreviewElement'
import {
  createAvatarPreview,
  setAvatarPreviewCameraToWearableCategory,
  updateAvatarPreview
} from '../../../components/backpack/AvatarPreview'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import {
  applyMiddleEllipsis,
  getURNWithoutTokenId
} from '../../../utils/urn-utils'
import { type URN, type URNWithoutTokenId } from '../../../utils/definitions'
import { convertToPBAvatarBase } from '../../../utils/dcl-utils'
import { executeTask } from '@dcl/sdk/ecs'
import { type PBAvatarBase } from '../../../bevy-api/interface'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../../service/categories'
import { TabComponent } from '../../../components/tab-component'
import { type Popup } from '../../../components/popup-stack'
import {
  fetchAllUserNames,
  fetchProfileData,
  saveProfileData
} from '../../../utils/passport-promise-utils'
import { Label } from '@dcl/sdk/react-ecs'
import Icon from '../../../components/icon/Icon'
import {
  editablePropertyKeys,
  ProfilePropertyField
} from './profile-property-input'
import { ButtonIcon } from '../../../components/button-icon'
import { TopBorder } from '../../../components/bottom-border'
import { CopyButton } from '../../../components/copy-button'
import { CloseButton } from '../../../components/close-button'
import { getPlayer } from '@dcl/sdk/players'

const COPY_ICON_SIZE = 40

export type PassportPopupState = {
  loadingProfile: boolean
  savingProfile: boolean
  pristineProfileData: ViewAvatarData
  editing: boolean
  editable: boolean
  mouseOverAvatar: string | null
}

const state: PassportPopupState = {
  editing: false,
  editable: true,
  loadingProfile: true,
  savingProfile: false,
  pristineProfileData: cloneDeep(EMPTY_PROFILE_DATA),
  mouseOverAvatar: null
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
      state.loadingProfile = true
      executeTask(async () => {
        const shownPopup = action.payload as HUDPopup
        const userId: string = shownPopup.data as string
        const profileData = await fetchProfileData({ userId })
        const [avatarData] = profileData.avatars
        const names = await fetchAllUserNames({ userId })
        state.editable = userId === getPlayer()?.userId

        store.dispatch(
          updateHudStateAction({
            profileData: avatarData as ViewAvatarData,
            names
          })
        )
        createAvatarPreview()
        const wearables: URNWithoutTokenId[] = (
          avatarData.avatar.wearables ?? []
        ).map((urn) => getURNWithoutTokenId(urn as URN)) as URNWithoutTokenId[]
        updateAvatarPreview(
          wearables,
          convertToPBAvatarBase(avatarData) as PBAvatarBase,
          avatarData.avatar.forceRender as WearableCategory[]
        )
        resetAvatarPreviewZoom()
        setAvatarPreviewCameraToWearableCategory(
          WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
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
      <ResponsiveContent>
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
            <PassportContent />
          ]}
          {state.loadingProfile && (
            <Label
              value={'Loading Avatar Passport ...'}
              fontSize={getCanvasScaleRatio() * 32}
              color={COLOR.TEXT_COLOR_GREY}
            />
          )}
          <CloseButton
            uiTransform={{
              position: {
                top: 0,
                right: 0
              },
              positionType: 'absolute'
            }}
            onClick={() => {
              closeDialog()
            }}
          />
        </UiEntity>
      </ResponsiveContent>
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

function PassportContent(): ReactElement {
  const profileData = store.getState().hud.profileData
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
          name: profileData.name,
          fontSize: getCanvasScaleRatio() * 40,
          hasClaimedName: profileData.hasClaimedName
        })}
        {AddressRow({
          address: profileData.userId,
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
          }
        ]}
        fontSize={getCanvasScaleRatio() * 32}
      />
      <Overview />
    </UiEntity>
  )
}
function Overview(): ReactElement {
  const profileData = store.getState().hud.profileData
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
        alignItems: 'flex-start',
        opacity: state.savingProfile ? 0.5 : 1
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
            state.pristineProfileData = cloneDeep(profileData)
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
        profileData={profileData}
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
          margin: { top: '2%', bottom: '2%' },
          zIndex: 2
        }}
      >
        {!state.editing &&
          _getVisibleProperties(profileData).map(
            (propertyKey: keyof ViewAvatarData) => (
              <ProfilePropertyField
                uiTransform={{ width: '25%' }}
                propertyKey={propertyKey ?? ''}
                profileData={profileData}
                editing={state.editing}
                disabled={state.savingProfile}
              />
            )
          )}
        {state.editing &&
          editablePropertyKeys.map(
            (propertyKey: keyof ViewAvatarData, index) => (
              <ProfilePropertyField
                propertyKey={propertyKey ?? ''}
                profileData={profileData}
                editing={state.editing}
                uiTransform={{
                  zIndex: editablePropertyKeys.length + 99 - index,
                  width: '25%'
                }}
              />
            )
          )}
      </UiEntity>
      <LinksSection />
      <BottomBar />
    </UiEntity>
  )
}

function LinksSection(): ReactElement {
  const profileData = store.getState().hud.profileData
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      {(state.editing || profileData?.links?.length >= 0) && (
        <UiEntity
          uiTransform={{
            margin: { top: '5%' }
          }}
          uiText={{
            value: '<b>LINKS</b>',
            fontSize: getCanvasScaleRatio() * 30
          }}
        />
      )}

      {state.editing && (
        <UiEntity
          uiText={{
            value:
              'Add a maximum of 5 links to promote your personal website or social networks.',
            fontSize: getCanvasScaleRatio() * 30
          }}
        />
      )}
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {profileData?.links?.length >= 0 &&
          profileData.links.map((link: { title: string; url: string }) => (
            <ProfileLink link={link} editing={state.editing} />
          ))}
        {state.editing &&
          (!profileData.links?.length || profileData.links?.length < 5) && (
            <Button
              onMouseDown={() => {
                store.dispatch(
                  pushPopupAction({
                    type: HUD_POPUP_TYPE.ADD_LINK
                  })
                )
              }}
              disabled={state.savingProfile}
              value={'<b>+</b> ADD'}
              fontSize={getCanvasScaleRatio() * 32}
              uiBackground={{ color: COLOR.WHITE_OPACITY_1 }}
              uiTransform={{
                borderRadius: getCanvasScaleRatio() * 15,
                borderWidth: 0,
                borderColor: COLOR.BLACK_TRANSPARENT,
                margin: { left: '2%' },
                flexShrink: 0
              }}
            />
          )}
      </UiEntity>
    </UiEntity>
  )
}
function BottomBar(): ReactElement | null {
  if (!state.editing) return null
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        width: '100%',
        padding: { top: '1%' },
        justifyContent: 'flex-end',
        zIndex: 0
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
          store.dispatch(
            updateHudStateAction({
              profileData: cloneDeep(state.pristineProfileData)
            })
          )
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
            state.savingProfile = true
            await saveProfileData(store.getState().hud.profileData)
            state.savingProfile = false
            state.editing = false
          })
        }}
      />
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
  const profileData = store.getState().hud.profileData
  return (
    <UiEntity
      uiTransform={{
        padding: getCanvasScaleRatio() * 10,
        margin: getCanvasScaleRatio() * 10,
        borderRadius: getCanvasScaleRatio() * 20,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 0,
        flexShrink: 0
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
            const newProfileData = cloneDeep(profileData)
            newProfileData.links = newProfileData.links.filter(
              (x) => x.url !== link.url
            )
            store.dispatch(
              updateHudStateAction({
                profileData: newProfileData
              })
            )
          }}
        />
      )}
    </UiEntity>
  )
}

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
          value: applyMiddleEllipsis(address),
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
        uiText={{
          value: name,
          fontSize,
          textAlign: 'middle-left',
          textWrap: 'nowrap'
        }}
        uiTransform={{
          alignSelf: 'flex-start',
          padding: 0,
          margin: { left: '-4%' }
        }}
      />
      {hasClaimedName && (
        <UiEntity
          uiTransform={{
            width: fontSize,
            height: fontSize,
            flexShrink: 0
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
      {state.editable && !state.editing && (
        <ButtonIcon
          uiTransform={{
            padding: getCanvasScaleRatio() * 8,
            margin: { left: '8%' }
          }}
          icon={{ spriteName: 'Edit', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 40}
          backgroundColor={COLOR.WHITE_OPACITY_1}
          onMouseDown={() => {
            store.dispatch(
              pushPopupAction({
                type: HUD_POPUP_TYPE.NAME_EDIT,
                data: store.getState().hud.profileData.name
              })
            )
          }}
        />
      )}
    </UiEntity>
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
        borderColor: COLOR.WHITE,
        flexShrink: 0,
        flexGrow: 0
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
