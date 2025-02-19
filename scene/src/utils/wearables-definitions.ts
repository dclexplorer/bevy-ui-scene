import type {WearableCategory} from "../service/wearable-categories";
import {type URN} from "./definitions";

export type OutfitSetupWearables = {
    [K in WearableCategory]: URN | null
}
export type OutfitSetup = {
    wearables: OutfitSetupWearables
    color: {
        eyes: number[]
        skin: number[]
        hair: number[]
    }
}
export type RarityName =
    | 'base'
    | 'common'
    | 'epic'
    | 'exotic'
    | 'legendary'
    | 'mythic'
    | 'rare'
    | 'uncommon'
    | 'unique'
type I18n = {
    code: string;
    text: string;
};

type Content = {
    key: string;
    url: string;
};

type Representation = {
    bodyShapes: URN[];
    mainFile: string;
    contents: Content[];
    overrideHides: string[];
    overrideReplaces: string[];
};

type CatalystWearableData = {
    replaces: string[];
    hides: string[];
    removesDefaultHiding: string[];
    tags: string[];
    category: WearableCategory;
    representations: Representation[];
    blockVrmExport: boolean;
};

type Metrics = {
    triangles: number;
    materials: number;
    meshes: number;
    textures: number;
    bodies: number;
    entities: number;
};

export type CatalystWearable = {
    id: URN;
    name: string;
    description: string;
    collectionAddress: string;
    rarity: string;
    i18n: I18n[];
    data: CatalystWearableData;
    image: string;
    thumbnail: string;
    metrics: Metrics;
};
