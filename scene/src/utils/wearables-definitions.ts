import type {WearableCategory} from "../service/wearable-categories";
import type { URN, URNWithoutTokenId} from "./definitions";
import {type PBAvatarBase} from "@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_base.gen";

export type OutfitSetupWearables = {
    [K in WearableCategory]: URN | null
}

export type OutfitSetup = {
    wearables: OutfitSetupWearables
    base:PBAvatarBase
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

type WearableEntityData = {
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
export type FileContent = {
    file: string;
    hash: string;
}

// TODO refactor: maybe rename it to WearableEntity ?
export type WearableEntity = {
    id: URN;
    name: string;
    description: string;
    collectionAddress: string;
    rarity: string;
    i18n: I18n[];
    data: WearableEntityData;
    image: string;
    thumbnail: string;
    metrics: Metrics;
};

export type CatalogWearableEntity = {
    content: FileContent[]
    id: string
    metadata: WearableEntity
    pointers: URN[]
    timestamp: number
    type:string
    version:string
}
export type WearableIndividualData = {
    id:URN
    price:string
    tokenId:string
    transferredAt:string
}

// TODO review rarities ids
export type WearableRarity = 'base' | 'common' | 'rare' | 'epic' | 'exotic' | 'legendary' | 'unique';

export type CatalogWearableElement = {
    amount: number
    category: WearableCategory
    entity: CatalogWearableEntity
    individualData:WearableIndividualData[]
    name:string
    rarity:WearableRarity
    type:'on-chain' | 'off-chain' | 'base' // TODO review possible values
    urn:URN
}
export type CatalystWearableMap = {
    [K in URNWithoutTokenId]: WearableEntity
}
