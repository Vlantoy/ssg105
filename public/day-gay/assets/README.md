# Đẩy gậy — character art v3

Generated with the built-in image_gen tool, using `assets/character/p1/body.png` from Ném còn as a style/costume reference. No API or CLI fallback was used.

Production assets:
- `fighter-clean-v3.png`: ivory shirt, teal sash, faces right.
- `fighter-rust-v3.png`: rust shirt, gold sash, red headband, faces right; mirrored at render time.
- `fighter-indigo-v2.png`: initial generation, retained as source iteration.

Final prompt set:

1. “Create a production-ready TRANSPARENT PNG character sprite asset for a Vietnamese folk stick-pushing game. Reference image is ONLY style and costume reference, not an edit target. One single full-body young adult male athlete facing RIGHT in clear side view, feet spread wide in a low grounded bent-knee pushing stance, torso leaning forward right, BOTH hands reaching forward at waist height gripping an INVISIBLE horizontal stick (do NOT draw stick). Both arms fully present, anatomically correct hands. Head determined, expressive dark hair. Detailed high quality 2D pixel art RPG sprite with crisp pixel clusters, stepped edges, rich controlled shading, detailed cloth folds, embroidered indigo sleeveless vest with small red and ivory geometric trim over ivory long sleeve shirt, teal sash, dark loose trousers, dark cloth shoes. Match the appealing Vietnamese game character of reference, but pixel art more detailed than crude block figures. Natural athletic proportions, not chibi, not Minecraft. Character fills image tightly with a small transparent margin, entire shoes and hands visible. Isolated asset only, transparent alpha background, no scene, no typography, no shadow floor, no weapon, no other characters. Pose must be ready to push an opponent to the right; both hands aligned at roughly 55 percent of total character height from top.”

2. “Edit this game sprite asset: remove ONLY the dark colored glow/aura and all background haze around the character. Output a clean isolated character on genuinely transparent alpha, crisp hard silhouette all around, ZERO background shadow or color haze. Preserve exactly the same character, embroidery, colors, face, body pose, proportions, shoes and hands. No stick. Entire body unchanged. Clean production cutout, no drop shadow, no glow.”

3. “Create opponent color variant of this exact transparent 2D pixel RPG sprite. Preserve exact same canvas dimensions 1024x1536, exact same pose, anatomy, arm and hand positions, full body feet placement and scale, transparent alpha background. Change only: hair to short swept-back dark hair with a narrow rust red cloth headband; ivory long sleeve shirt to warm muted rust red long sleeve shirt; teal waist sash to warm gold waist sash. Keep indigo embroidered vest, dark trousers and shoes, all embroidery fine detail and same pixel rendering. One character facing right as original; no stick, no text, no environment, no aura, no shadow, no opaque background. Use the reference asset as the edit target, only change the listed costume colors and hairstyle.”

These are stylized game costumes, not an assertion that a particular community uses this outfit for stick pushing. Canvas uses a shared crop (0,75,1024,1360) and scales without interpolation. Animation currently uses breathing/leaning transforms, with no frame-by-frame limb animation.
