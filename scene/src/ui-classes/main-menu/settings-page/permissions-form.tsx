import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  PERMISSION_DEFINITIONS,
  PermissionDefinition,
  PermissionTypeItem,
  PermissionValue
} from '../../../bevy-api/permission-definitions'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { Column, Row } from '../../../components/layout'
import { BottomBorder } from '../../../components/bottom-border'
import { COLOR } from '../../../components/color-palette'
import Icon from '../../../components/icon/Icon'
import { Label, UiTransformProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { noop } from '../../../utils/function-utils'
import { Content, MainContent } from '../backpack-page/BackpackPage'
import { DropdownComponent } from '../../../components/dropdown-component'
import useState = ReactEcs.useState
const BLUE_BORDER = {
  borderWidth: 1,
  borderRadius: 0,
  borderColor: COLOR.BLUE
}
const WHITE_BORDER = {
  borderWidth: 1,
  borderRadius: 0,
  borderColor: COLOR.WHITE
}
const FONT_SMALL_UNIT = 30
const FONT_MEDIUM_UNIT = 40
const FONT_BIG_UNIT = 50

export const PermissionsForm = ({
  permissionDefinitions,
  onHoverPermission = noop
}: {
  permissionDefinitions: PermissionDefinition[]
  onHoverPermission?: (permissionType: string) => void
}): ReactElement => {
  const [hoveredPermission, setHoveredPermission] = useState<string | null>(
    null
  )
  const hoveredPermissionDefinition = hoveredPermission
    ? permissionDefinitions.find((p) => p.permissionType === hoveredPermission)
    : null
  const FONTSIZE_SMALL = getCanvasScaleRatio() * FONT_SMALL_UNIT
  const FONTSIZE_BIG = getCanvasScaleRatio() * FONT_BIG_UNIT
  const FONTSIZE_MEDIUM = getCanvasScaleRatio() * FONT_MEDIUM_UNIT
  const sceneOptions = ['', 'Current Scene']
  const selectedOption = 'Current Scene'
  const onPermissionMouseLeave = (permissionType: string) => {
    if (!(hoveredPermission && hoveredPermission !== permissionType)) {
      setHoveredPermission(null)
    }
  }
  return (
    <Content>
      <UiEntity
        uiTransform={{
          width: '80%',
          height: '100%',
          pointerFilter: 'block',
          flexDirection: 'row',
          borderRadius: getCanvasScaleRatio() * 50,
          borderWidth: 0,
          borderColor: COLOR.BLACK_TRANSPARENT,
          margin: { top: '1%' }
        }}
        onMouseDown={noop}
        uiBackground={{ color: COLOR.DARK_OPACITY_5 }}
      >
        <Column
          uiTransform={{
            width: '60%',
            margin: { left: '2%', top: '1%' }
          }}
        >
          <Row
            uiTransform={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              margin: { bottom: '3%' }
            }}
          >
            <UiEntity
              uiTransform={{ alignSelf: 'center', position: { top: '13%' } }}
              uiText={{
                value: 'Permissions Selected Scene',
                fontSize: FONTSIZE_MEDIUM,
                textAlign: 'middle-center'
              }}
            />
            <DropdownComponent
              dropdownId={'select-current-scene'}
              uiTransform={{
                zIndex: 2,
                width: getCanvasScaleRatio() * 400,
                alignSelf: 'center'
              }}
              options={sceneOptions}
              value={selectedOption}
              onChange={noop}
            />
          </Row>
          <Column
            uiTransform={{
              width: '100%',
              height: getCanvasScaleRatio() * 1300,
              overflow: 'scroll',
              scrollVisible: 'vertical'
            }}
          >
            {permissionDefinitions.map((permissionDefinition, index) => {
              if (
                permissionDefinitions[index - 1]?.section !==
                permissionDefinition.section
              ) {
                return [
                  <UiEntity
                    uiText={{
                      value: `<b>${permissionDefinition.section}</b>`,
                      fontSize: FONTSIZE_BIG,
                      textAlign: 'middle-left',
                      textWrap: 'nowrap'
                    }}
                    uiTransform={{ width: '96%', alignItems: 'center' }}
                    uiBackground={{
                      color: COLOR.DARK_OPACITY_2
                    }}
                  >
                    <UiEntity
                      uiTransform={{
                        positionType: 'absolute',
                        position: { left: '48%' },
                        alignItems: 'stretch',
                        width: '42%'
                      }}
                    >
                      <UiEntity
                        uiTransform={{
                          width: '33%'
                        }}
                        uiText={{
                          textWrap: 'wrap',
                          value: 'Selected Scene',
                          fontSize: FONTSIZE_SMALL,
                          textAlign: 'middle-center',
                          color: COLOR.WHITE_OPACITY_5
                        }}
                      />
                      <UiEntity
                        uiTransform={{
                          width: '33%'
                        }}
                        uiText={{
                          textWrap: 'wrap',
                          value: 'Current Realm',
                          fontSize: FONTSIZE_SMALL,
                          textAlign: 'middle-center',
                          color: COLOR.WHITE_OPACITY_5
                        }}
                      />
                      <UiEntity
                        uiTransform={{
                          width: '33%'
                        }}
                        uiText={{
                          textWrap: 'wrap',
                          value: 'Default',
                          fontSize: FONTSIZE_SMALL,
                          textAlign: 'middle-center',
                          color: COLOR.WHITE_OPACITY_5
                        }}
                      />
                    </UiEntity>
                  </UiEntity>,
                  <PermissionRowField
                    onMouseEnter={() => {
                      console.log('x')
                      setHoveredPermission(permissionDefinition.permissionType)
                    }}
                    onMouseLeave={() =>
                      onPermissionMouseLeave(
                        permissionDefinition.permissionType
                      )
                    }
                    permissionDefinition={permissionDefinition}
                  />
                ]
              } else {
                return (
                  <PermissionRowField
                    onMouseEnter={() =>
                      setHoveredPermission(permissionDefinition.permissionType)
                    }
                    onMouseLeave={() =>
                      onPermissionMouseLeave(
                        permissionDefinition.permissionType
                      )
                    }
                    permissionDefinition={permissionDefinition}
                  />
                )
              }
            })}
          </Column>
          <PermissionLegend
            uiTransform={{
              margin: '2%',
              width: '100%'
            }}
          />
        </Column>
        <Column>
          <UiEntity
            uiText={{
              value: hoveredPermissionDefinition
                ? hoveredPermissionDefinition.label
                : '',
              fontSize: FONTSIZE_BIG,
              textAlign: 'top-left'
            }}
            uiTransform={{ padding: { top: '5%' } }}
          />
          <UiEntity
            uiText={{
              value: hoveredPermissionDefinition
                ? `This permission is requested when scene attemps to ${hoveredPermissionDefinition.activeDescription}`
                : '',
              fontSize: FONTSIZE_MEDIUM,
              textAlign: 'top-left',
              color: COLOR.TEXT_COLOR_LIGHT_GREY
            }}
            uiTransform={{ padding: { top: '5%' } }}
          />
        </Column>
      </UiEntity>
    </Content>
  )
}

function PermissionRowField({
  permissionDefinition,
  onMouseEnter = noop,
  onMouseLeave = noop
}: {
  permissionDefinition: PermissionDefinition
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}): ReactElement {
  return (
    <Row
      uiTransform={{
        width: '95%',
        padding: { right: '10%' }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <UiEntity
        uiText={{
          value: permissionDefinition.label,
          textAlign: 'top-left',
          fontSize: getCanvasScaleRatio() * 40
        }}
        uiTransform={{ width: '100%' }}
      />
      <PermissionBox
        value={'Ask'}
        uiTransform={{ margin: '5%' }}
        active={true}
      />
      <PermissionBox value={'Deny'} uiTransform={{ margin: '5%' }} />
      <PermissionBox value={'Allow'} uiTransform={{ margin: '5%' }} />
      <BottomBorder color={COLOR.WHITE_OPACITY_1} />
    </Row>
  )
}

const POSSIBLE_PERMISSION_VALUES: PermissionValue[] = [
  null,
  'Allow',
  'Ask',
  'Deny'
]

function PermissionBox({
  value,
  uiTransform,
  active
}: {
  value: PermissionValue
  uiTransform?: UiTransformProps
  active?: boolean
}) {
  const [currentValue, setValue] = useState(value)
  const switchValue = () => {
    console.log('switchValue', currentValue)
    if (
      POSSIBLE_PERMISSION_VALUES.indexOf(currentValue) ===
      POSSIBLE_PERMISSION_VALUES.length - 1
    ) {
      setValue(POSSIBLE_PERMISSION_VALUES[0])
    } else {
      setValue(
        POSSIBLE_PERMISSION_VALUES[
          POSSIBLE_PERMISSION_VALUES.indexOf(currentValue) + 1
        ]
      )
    }
  }
  return (
    <UiEntity
      uiTransform={{
        padding: getCanvasScaleRatio() * 5,
        ...(active
          ? {
              borderColor: COLOR.ACTIVE_BACKGROUND_COLOR,
              borderRadius: getCanvasScaleRatio() * 18,
              borderWidth: 1
            }
          : {}),
        ...uiTransform
      }}
      onMouseDown={switchValue}
    >
      <Icon
        iconSize={getCanvasScaleRatio() * 48}
        icon={{
          spriteName: 'check-off',
          atlasName: 'backpack'
        }}
      />
      <Icon
        uiTransform={{
          positionType: 'absolute',
          position: {
            left: getCanvasScaleRatio() * 5,
            top: getCanvasScaleRatio() * 5
          },
          zIndex: 2
        }}
        iconSize={getCanvasScaleRatio() * 48}
        icon={{
          spriteName: getSpritePerValue(currentValue),
          atlasName: 'icons'
        }}
        iconColor={getSpriteColorPerValue(currentValue)}
      />
    </UiEntity>
  )

  function getSpritePerValue(value: PermissionValue): string {
    if (value === 'Ask') {
      return 'Support'
    } else if (value === 'Deny') {
      return 'CloseIcon'
    } else if (value === 'Allow') {
      return 'Check'
    }
    return 'LeftArrow'
  }

  function getSpriteColorPerValue(value: PermissionValue): Color4 {
    if (value === 'Ask') {
      return COLOR.ORANGE
    } else if (value === 'Deny') {
      return COLOR.RED
    } else if (value === 'Allow') {
      return COLOR.GREEN
    }
    return COLOR.TEXT_COLOR_GREY
  }
}

export function PermissionLegend({
  uiTransform
}: {
  uiTransform?: UiTransformProps
}): ReactElement {
  const fontSize = getCanvasScaleRatio() * 32
  return (
    <UiEntity uiTransform={{ ...uiTransform }}>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Inherit',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={null} />
      </UiEntity>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Ask',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={'Ask'} />
      </UiEntity>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Allow',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={'Allow'} />
      </UiEntity>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Deny',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={'Deny'} />
      </UiEntity>
    </UiEntity>
  )
}
