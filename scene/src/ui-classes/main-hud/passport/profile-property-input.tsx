import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import Icon from '../../../components/icon/Icon'
import { COLOR } from '../../../components/color-palette'
import { type ViewAvatarData } from './popup-passport'
import { Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { noop } from '../../../utils/function-utils'
import selectableValues from './passport-field-selectable-values.json'
import { DropdownComponent } from '../../../components/dropdown-component'

export const editablePropertyKeys: string[] = [
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

export const labelsPerProperty: Record<string, string> = {
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
export const iconsPerProperty: Record<string, string> = {
  country: 'CountryIcn',
  language: 'LanguageIcn',
  gender: 'GenderIcn',
  pronouns: 'PronounsIcn',
  profession: 'ProfessionIcn',
  hobbies: 'HobbiesIcn',
  birthdate: 'BirthdayIcn',
  realName: 'BirthdayIcn',
  sexualOrientation: 'SexOrientationIcn',
  employmentStatus: 'EmploymentStatus',
  relationshipStatus: 'RelationshipIcn'
}
enum INPUT_TYPE {
  TEXT,
  DROPDOWN,
  DATE
}
export const inputTypePerProperty: Record<string, number> = {
  country: INPUT_TYPE.DROPDOWN,
  language: INPUT_TYPE.DROPDOWN,
  gender: INPUT_TYPE.DROPDOWN,
  pronouns: INPUT_TYPE.DROPDOWN,
  profession: INPUT_TYPE.TEXT,
  hobbies: INPUT_TYPE.TEXT,
  birthdate: INPUT_TYPE.DATE,
  realName: INPUT_TYPE.TEXT,
  sexualOrientation: INPUT_TYPE.DROPDOWN,
  employmentStatus: INPUT_TYPE.TEXT
}

export function ProfilePropertyField({
  propertyKey,
  profileData,
  editing
}: {
  propertyKey: string
  profileData: ViewAvatarData
  editing?: boolean
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        width: '25%',
        alignItems: 'flex-start',
        margin: { top: getCanvasScaleRatio() * 30 }
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
        uiTransform={{
          margin: {
            left: getCanvasScaleRatio() * 30
          }
        }}
        uiText={{
          value: labelsPerProperty[propertyKey],
          fontSize: getCanvasScaleRatio() * 30
        }}
      />
      {editing ? (
        PassportEditableInput({ type: inputTypePerProperty[propertyKey] })
      ) : (
        <UiEntity
          uiTransform={{
            margin: {
              top: getCanvasScaleRatio() * -20,
              left: getCanvasScaleRatio() * 30
            }
          }}
          uiText={{
            value: formatProfileValue(propertyKey),
            fontSize: getCanvasScaleRatio() * 30,
            color: COLOR.TEXT_COLOR_LIGHT_GREY
          }}
        />
      )}
    </UiEntity>
  )

  function formatProfileValue(key: string): string {
    if (key === 'birthdate') {
      return new Date(profileData[key] * 1000).toLocaleDateString()
    }
    return profileData[key]
  }

  function PassportEditableInput({ type }: { type: INPUT_TYPE }): ReactElement {
    if (type === INPUT_TYPE.TEXT) {
      return (
        <Input
          uiTransform={{
            width: '94%',
            height: getCanvasScaleRatio() * 60,
            zIndex: 999999,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderRadius: getCanvasScaleRatio() * 16,
            borderWidth: 0,
            padding: getCanvasScaleRatio() * 10
          }}
          uiBackground={{
            color: Color4.White()
          }}
          fontSize={getCanvasScaleRatio() * 28}
          value={profileData[propertyKey]}
          onSubmit={noop}
        />
      )
    }

    type SelectablePropertyKey = keyof typeof selectableValues

    if (type === INPUT_TYPE.DROPDOWN && propertyKey in selectableValues) {
      return (
        <DropdownComponent
          dropdownId={propertyKey}
          uiTransform={{
            width: '97%',
            zIndex: 999999,
            margin: { top: getCanvasScaleRatio() * -20 },
            height: getCanvasScaleRatio() * 60,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderRadius: getCanvasScaleRatio() * 16,
            borderWidth: 0
          }}
          scroll={true}
          options={selectableValues[propertyKey as SelectablePropertyKey]}
          value={profileData[propertyKey]}
          onChange={(value) => {
            profileData[propertyKey] = value
          }}
        />
      )
    }
    return <UiEntity uiText={{ value: profileData[propertyKey] }} />
  }
}
