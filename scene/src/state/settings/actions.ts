import type { ExplorerSetting } from "../../bevy-api/interface";

type SettingActionId = { __reducer: 'settings' };

export type LoadSettingsFromExplorerAction = SettingActionId & {
    type: 'LOAD_SETTINGS_FROM_EXPLORER';
    payload: Record<string, ExplorerSetting>;
}

export type SaveSettingsToExplorerAction = SettingActionId & {
    type: 'SAVE_SETTINGS_TO_EXPLORER';
}

export type DiscardNewValuesAction = SettingActionId & {
    type: 'DISCARD_NEW_VALUES';
}

export type SetSettingValueAction = SettingActionId & {
    type: 'SET_SETTING_VALUE';
    payload: { name: string; value: number };
}

export type SettingsActions = LoadSettingsFromExplorerAction | SaveSettingsToExplorerAction | DiscardNewValuesAction | SetSettingValueAction;

export const loadSettingsFromExplorer = (settings: Record<string, ExplorerSetting>): LoadSettingsFromExplorerAction => ({ __reducer: 'settings', type: 'LOAD_SETTINGS_FROM_EXPLORER', payload: settings });
export const saveSettingsToExplorer = (): SaveSettingsToExplorerAction => ({ __reducer: 'settings', type: 'SAVE_SETTINGS_TO_EXPLORER' });
export const discardNewValues = (): DiscardNewValuesAction => ({ __reducer: 'settings', type: 'DISCARD_NEW_VALUES' });
export const setSettingValue = (payload: { name: string; value: number }): SetSettingValueAction => ({ __reducer: 'settings', type: 'SET_SETTING_VALUE', payload });
