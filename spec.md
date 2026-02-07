# Ducks Game Spec (v1)

## 1. Product Goal
Create a desktop-browser, first-person duck-raising game with click-drag object interaction.

Tone:
- Cozy caretaker
- Playful chaos

Target session style:
- 20+ minute deeper progression sessions

## 2. Platform and Technical Constraints
- Platform: Desktop browser only
- Input: Keyboard + mouse
- Engine: Pure custom canvas/WebGL approach (no external game engine)
- Save system: Auto-save only (localStorage)
- Performance target: 30 FPS minimum on low-end laptops

## 3. Core Player Fantasy
The player explores a small world, raises a duck from egg stage, manages care needs, teaches dance routines, and eventually unlocks/constructs a show stage to perform.

## 4. World Structure
### Start zones
- Pond
- Barn
- Meadow

### Unlockable zone
- Show Stage

### Show Stage unlock rule
- Duck has learned at least 3 dances
- Player completes a hybrid build quest:
  - Gather materials from zones
  - Assemble stage using drag physics placement

## 5. Controls and Camera
### Movement
- WASD movement
- Sprint
- Jump

### Camera modes (selectable)
- Pointer-lock FPS look
- Hold-right-click look

### Comfort settings (v1)
- Mouse sensitivity
- FOV slider

## 6. Interaction Model
### Object manipulation
- Click and drag objects with mouse
- Release to drop
- Release includes natural momentum (light toss possible)

### Interaction scope (v1)
- Walk/look/pick up/drop/drag core set

### Object durability
- Some objects are fragile and can break
- Broken objects require repair/replacement

## 7. Duck Simulation Systems
### Needs (custom set)
- Trust
- Hunger
- Cleanliness
- Sleep
- Fun

### Trust behavior
- Trust is intentionally hard to lose once earned

### AI depth
- Semi-to-high autonomy:
  - Wandering
  - Need-driven behavior
  - Reacts to player actions

## 8. Dance System
### Inputs
- Keys: A, S, D, F
- `F` = air twirl

### Dance creation modes
- Pre-made dances
- Custom dances recorded from real-time key taps

### Content target
- 10 pre-made dances total

### Show scoring model
- Sequence correctness
- Duck state modifiers (needs/trust)

### Progression gates
Unlocks require both:
- Dance progression
- Care/trust progression

## 9. Economy
- Single currency: Pond Coins
- Earned from tasks and shows
- Spent on food, toys, and materials

## 10. Time and Session Flow
- Day/night cycle with soft transitions
- No hard day-chunk screen flow required for v1

## 11. Audio and Visual Direction
### Audio scope (full)
- Ambient pond loop
- Footsteps
- Duck vocalizations
- Interaction SFX
- Music

### Visual style
- Cartoon-realistic

## 12. Onboarding and UX
### Tutorial
- Short guided intro covering:
  - Movement
  - Click-drag interaction
  - Duck care basics

### HUD style
- Minimal HUD (mostly diegetic presentation, light prompts)

## 13. MVP Scope (Medium)
v1 includes:
- Three explorable start zones
- Full core loop (exploration + care + dance teaching)
- Unlock/build path to show stage
- Basic polish

## 14. Out of Scope for v1
- Mobile support
- Multiplayer
- Large story campaign
- Advanced graphics pipeline/features beyond performance target
- Full control remapping suite

## 15. Acceptance Criteria
1. Player can move in first person using WASD + sprint + jump and can switch between pointer-lock and hold-right-click look modes.
2. Player can click-drag-drop objects with momentum release, and fragile objects can break and be repaired/replaced.
3. Duck needs (trust, hunger, cleanliness, sleep, fun) update over time and through player actions; trust decay is low after it is established.
4. Player can teach from 10 pre-made dances and record custom dances using real-time A/S/D/F input (including F twirl).
5. Pond, Barn, and Meadow are available at start; Show Stage unlocks only after 3 dances learned and hybrid build quest completion.
6. Pond Coins can be earned from tasks/shows and spent on food, toys, and stage-related materials.
7. Full audio layer is present (ambient, footsteps, vocals, SFX, music).
8. Progress auto-saves to localStorage and restores on reload.
9. Build runs at 30 FPS minimum on low-end target laptops during normal play.

## 16. Implementation Priorities
1. First-person controller + camera mode toggle + interaction raycast/drag system
2. Core world zones and object interaction loops
3. Duck AI needs/state machine and trust tuning
4. Dance authoring/playback/scoring system
5. Show stage unlock quest and assembly interactions
6. Audio pass and optimization pass
