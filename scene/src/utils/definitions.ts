export type SpriteFromAtlas = {
    sprite:string,
    atlasTexture:string,
    atlasData:string
}

export type AtlasData = {
    frames: { [key: string]: Sprite }
    meta: {
      size: {w:number, h:number}
      [key: string]: any
    }
  }
  
export type Sprite = {
    frame: {x:number,y:number,w:number,h:number},
    rotated: false,
    trimmed: false,
    spriteSourceSize: {x:number,y:number,w:number,h:number},
    sourceSize: {w:number,h:number}
}
