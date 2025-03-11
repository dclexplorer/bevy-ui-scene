# Running UI scene with latest Bevy explorer dev version

- Run this scene with npm run start 
- Close bevy client
- Clone decentraland/bevy-explorer repo
- Follow README instructions from the decentraland/bevy-explorer repo to install and setup
- Compile and run bevy with following command:
``` cargo run --release --bin decentra-bevy  --features="console" -- --ui http://localhost:8000 --ui-preview --scene_log_to_console```

# Working and bundling texture spritesheets

We rename the names that come from figma file, and we change to names that make more sense from a programming point of view, for example, we rename HeadIcon to category-top_head, which for example it's the exact category id coming from API.
Or we rename Epic to rarity-background-epic to be more explicit, or Category-1 to rarity-corner-base, etc.

Then on this online tool, we can drag and drop all the png files https://www.codeandweb.com/tp-online
Then exporting the json and png sprite-sheet we can use those directly in our code, with all names and coords automatically set