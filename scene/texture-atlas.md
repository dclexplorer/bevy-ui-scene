# Documentation for `getBackgroundFromAtlas`

This document explains how to set up and use the `getBackgroundFromAtlas` function in your TypeScript project. This utility allows you to extract textures from a texture atlas and apply them to UI entities in your project.

---

## Setting Up Your Texture Atlas

To use `getBackgroundFromAtlas`, you must prepare and organize your texture atlas and its corresponding metadata as follows:

1. **Save the Texture Atlas Image**  
   Place your texture atlas image (in `.png` format) in the following directory:  
   `scene/assets/images/atlas/`  
   For example: scene/assets/images/atlas/atlas.png


2. **Create and Save Atlas Metadata**  
Create a TypeScript file with the metadata for your atlas.  
- Use the same name as the texture file, appending `-data` and saving it with a `.ts` extension.  
- Place the metadata file in the following directory:  
  `scene/src/json/`  
  For example: scene/src/json/atlas-data.ts


This file must export a constant of type `AtlasData` with a name matching the texture file, appending `Json`. For example:  

```typescript
export const atlasJson: AtlasData = {
  frames: {
    "sprite.png": {
      frame: { x: 0, y: 0, w: 32, h: 32 },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 }
    }
  },
  meta: {
    size: { w: 128, h: 128 }
  }
}
```

3. **Modifying the Helper Function getUvs**
Ensure that the metadata file is included in the getUvs function. Add the exported JSON constant to the switch statement based on the atlas name. Example:

```typescript
export type Icon = { atlasName: string; spriteName: string }

export function getUvs(icon: Icon): number[] {
  let parsedJson: AtlasData | undefined;
  switch (icon.atlasName) {
    case 'atlas':
      parsedJson = atlasJson; // Include your atlas JSON
      break;
    // Add other atlas cases here
  }
  ...
}
```

4. **Using getBackgroundFromAtlas**
The getBackgroundFromAtlas function takes an Icon object as input and returns a UiBackgroundProps object with the appropriate texture and UV mapping. Example usage:

```typescript
export function getBackgroundFromAtlas(icon: Icon): UiBackgroundProps {
  const textureMode = 'stretch';
  const uvs = getUvs(icon);
  const texture = { src: `assets/images/atlas/${icon.atlasName}.png` };
  return {
    textureMode,
    uvs,
    texture
  };
}
```

5. **Applying the Texture to a UI Entity**
To use the texture in your UI, apply it to a <UiEntity> component using the getBackgroundFromAtlas function.

Example:

```typescript
<UiEntity
  uiTransform={{
    width: '70%',
    height: '70%',
    flexDirection: 'row',
    alignItems: 'center'
  }}
  uiBackground={getBackgroundFromAtlas({
    atlasName: 'atlas', // Name of your atlas
    spriteName: 'sprite' // Name of your sprite
  })}
/>
```
---
**Notes and Best Practices**
Atlas Metadata:

- The spriteName should match one of the keys in the frames object of your atlas metadata (e.g., "sprite.png").
Switch Statement Updates:

- Always add a case for each new atlas in the getUvs function to ensure proper mapping.
Directory Structure:

- Maintain the suggested directory structure for easier management and access.
