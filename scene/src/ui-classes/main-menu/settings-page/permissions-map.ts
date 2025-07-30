import { BevyApi } from '../../../bevy-api'
import {
  PERMISSION_DEFINITIONS,
  type PermissionLevel,
  type PermissionValue
} from '../../../bevy-api/permission-definitions'
import { getRealm } from '~system/Runtime'
export type PermissionItem = { type: string; allow: PermissionValue }
export type PermissionResult = PermissionItem & {
  source: PermissionLevel
  scene: PermissionItem
  realm: PermissionItem
  global: PermissionItem
}
export async function getCompletePermissionsMatrix(
  sceneHash: string
): Promise<Record<string, PermissionResult>> {
  const globalPermissions = await BevyApi.getPermanentPermissions({
    level: 'Global'
  })
  const { realmInfo } = await getRealm({})

  const completeGlobalPermissions: PermissionItem[] =
    PERMISSION_DEFINITIONS.map((permissionDefinition) => {
      const foundPermission = globalPermissions.find(
        (g) => g.ty === permissionDefinition.permissionType
      )

      return {
        type: permissionDefinition.permissionType,
        allow:
          foundPermission?.allow ??
          (permissionDefinition.section === 'Gameplay' ? 'Allow' : 'Ask')
      }
    })

  const realmPermissions = await BevyApi.getPermanentPermissions({
    level: 'Realm',
    value: realmInfo?.baseUrl
  })

  const completeRealmPermissions: PermissionItem[] = PERMISSION_DEFINITIONS.map(
    (permissionDefinition) => {
      const foundPermission = realmPermissions.find(
        (g) => g.ty === permissionDefinition.permissionType
      )

      return {
        type: permissionDefinition.permissionType,
        allow: foundPermission?.allow ?? null
      }
    }
  )
  const scenePermissions = await BevyApi.getPermanentPermissions({
    level: 'Scene',
    value: sceneHash
  })
  const completeScenePermissions: PermissionItem[] = PERMISSION_DEFINITIONS.map(
    (permissionDefinition) => {
      const foundPermission = scenePermissions.find(
        (g) => g.ty === permissionDefinition.permissionType
      )

      return {
        type: permissionDefinition.permissionType,
        allow: foundPermission?.allow ?? null
      }
    }
  )
  const completeResultPermissions = completeScenePermissions.map(
    (scenePermission) => {
      return {
        type: scenePermission.type,
        allow:
          scenePermission.allow ??
          completeRealmPermissions.find((p) => p.type === scenePermission.type)
            ?.allow ??
          completeGlobalPermissions.find((p) => p.type === scenePermission.type)
            ?.allow ??
          null,
        source: getSource(scenePermission.allow, scenePermission.type)
      }
    }
  )

  const resultMap = completeResultPermissions.reduce(
    (acc: Record<string, PermissionResult>, resultPermission) => {
      const scene = completeScenePermissions.find(
        (p) => p.type === resultPermission.type
      ) as PermissionItem
      const realm = completeRealmPermissions.find(
        (p) => p.type === resultPermission.type
      ) as PermissionItem
      const global = completeGlobalPermissions.find(
        (p) => p.type === resultPermission.type
      ) as PermissionItem

      const itemToAdd: PermissionResult = {
        type: resultPermission.type,
        allow: resultPermission.allow,
        source: resultPermission.source,
        scene,
        realm,
        global
      }
      acc[resultPermission.type] = itemToAdd
      return acc
    },
    {}
  )
  return resultMap

  function getSource(
    permissionAllow: string | null,
    permissionType: string
  ): PermissionLevel {
    if (permissionAllow) return 'Scene'
    const foundInRealm = completeRealmPermissions.find(
      (p) => p.type === permissionType
    )
    if (foundInRealm?.allow) return 'Realm'

    return 'Global'
  }
}
