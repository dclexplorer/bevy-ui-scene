# Running UI scene with latest Bevy explorer dev version

- Run this scene with npm run start 
- Close bevy client
- Clone decentraland/bevy-explorer repo
- Follow README instructions from the decentraland/bevy-explorer repo to install and setup
- Compile and run bevy with following command:
``` cargo run --release --bin decentra-bevy  --features="console" -- --ui http://localhost:8000 --ui-preview --scene_log_to_console```