import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../components/color-palette'
import { store } from '../../state/store'
import { closeLastPopupAction, HUD_ACTION } from '../../state/hud/actions'
import { HUD_POPUP_TYPE, type HUDPopup } from '../../state/hud/state'
import { isTruthy, memoize, noop } from '../../utils/function-utils'
import { Content } from '../main-menu/backpack-page/BackpackPage'
import { AvatarPreviewElement } from '../../components/backpack/AvatarPreviewElement'
import {
  createAvatarPreview,
  updateAvatarPreview
} from '../../components/backpack/AvatarPreview'
import { ALMOST_WHITE } from '../../utils/constants'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { copyToClipboard } from '~system/RestrictedActions'
import {
  applyMiddleEllipsis,
  getURNWithoutTokenId
} from '../../utils/urn-utils'
import { type URN, type URNWithoutTokenId } from '../../utils/definitions'
import { convertToPBAvatarBase } from '../../utils/dcl-utils'
import { executeTask } from '@dcl/sdk/ecs'
import { type PBAvatarBase } from '../../bevy-api/interface'
import { type WearableCategory } from '../../service/categories'
import { TabComponent } from '../../components/tab-component'
import { type Popup } from '../../components/popup-stack'
import { fetchProfileData } from '../../utils/passport-promise-utils'
import { Label } from '@dcl/sdk/react-ecs'
import Icon from '../../components/icon/Icon'

const COPY_ICON_SIZE = 40
export type ProfileLink = {
  title: string
  url: string
}

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
  links: ProfileLink[]
  userId: string
}

export type PassportPopupState = {
  loadingProfile: boolean
  profileData: ViewAvatarData
}
const state: PassportPopupState = {
  loadingProfile: true,
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
const editablePropertyKeys: string[] = [
  'country',
  'language',
  'pronouns',
  'gender',
  'relationshipStatus',
  'sexualOrientation',
  'profession',
  'birthdate',
  'realName',
  'hobbies'
]

const labelsPerProperty: Record<string, string> = {
  country: 'country'.toUpperCase(),
  language: 'language'.toUpperCase(),
  pronouns: 'pronouns'.toUpperCase(),
  gender: 'gender'.toUpperCase(),
  relationshipStatus: 'relationship status'.toUpperCase(),
  sexualOrientation: 'sexual orientation'.toUpperCase(),
  employmentStatus: 'employment status'.toUpperCase(),
  profession: 'profession'.toUpperCase(),
  birthdate: 'birthdate'.toUpperCase(),
  realName: 'real name'.toUpperCase(),
  hobbies: 'favorite hobby'.toUpperCase()
}
const iconsPerProperty: Record<string, string> = {
  country: 'CountryIcn',
  language: 'LanguageIcn',
  gender: 'GenderIcn',
  pronouns: 'PronounsIcn',
  profession: 'ProfessionIcn',
  hobbies: 'HobbiesIcn',
  birthdate: 'BirthdayIcn',
  realName: 'BirthdayIcn',
  sexualOrientation: 'GenderIcn'
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
function ProfileContent(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',

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
        margin: { top: '4%' },
        padding: '2%',
        width: '96%',
        borderRadius: getCanvasScaleRatio() * 20,
        borderColor: COLOR.TEXT_COLOR_WHITE,
        borderWidth: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}
      uiBackground={{ color: COLOR.DARK_OPACITY_2 }}
    >
      <UiEntity
        uiText={{
          value: '<b>ABOUT ME</b>',
          fontSize: getCanvasScaleRatio() * 32
        }}
      />
      <UiEntity
        uiText={{
          value: state.profileData.description
        }}
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
        {_getVisibleProperties(state.profileData).map(
          (propertyKey: keyof ViewAvatarData) => (
            <ProfilePropertyField propertyKey={propertyKey} />
          )
        )}
      </UiEntity>
    </UiEntity>
  )
}

function ProfilePropertyField({
  propertyKey
}: {
  propertyKey: string
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        width: '25%',
        alignItems: 'flex-start'
      }}
    >
      <Icon
        uiTransform={{
          flexShrink: 0,
          flexGrow: 0,
          positionType: 'absolute',
          position: {
            top: getCanvasScaleRatio() * 16,
            left: getCanvasScaleRatio() * 5
          }
        }}
        icon={{
          atlasName: 'profile',
          spriteName: iconsPerProperty[propertyKey]
        }}
        iconSize={getCanvasScaleRatio() * 32}
        iconColor={COLOR.INACTIVE}
      />
      <UiEntity
        uiTransform={{ margin: { left: getCanvasScaleRatio() * 30 } }}
        uiText={{
          value: labelsPerProperty[propertyKey],
          fontSize: getCanvasScaleRatio() * 30
        }}
      />
      <UiEntity
        uiText={{
          value: formatProfileValue(propertyKey),
          fontSize: getCanvasScaleRatio() * 30
        }}
      />
    </UiEntity>
  )
}
function formatProfileValue(key: string): string {
  if (key === 'birthdate') {
    return new Date(state.profileData[key] * 1000).toLocaleDateString()
  }
  return state.profileData[key]
}
function getVisibleProperties(profileData: ViewAvatarData): string[] {
  return editablePropertyKeys.filter((key) => !!profileData[key])
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
        text: address
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
        text: name
      })}
    </UiEntity>
  )
}

function CopyButton({
  fontSize,
  text
}: {
  fontSize: number
  text: string
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
        color: { ...ALMOST_WHITE, a: 0.2 }
      }}
      onMouseDown={() => {
        copyToClipboard({ text }).catch(console.error)
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
