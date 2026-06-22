# Pet animation assets

The companion is **animation-driven, never emoji**. The `PetState` engine emits
an `animationState` string; the renderer maps each to a clip here.

Expected clips (drop-in later, e.g. Lottie `.json` or Rive `.riv`):

| animationState   | When it plays                          |
| ---------------- | -------------------------------------- |
| `idle_happy`     | Mood happy, resting                    |
| `idle_neutral`   | Mood neutral, resting                  |
| `sulk`           | Mood disappointed (low engagement)     |
| `celebrate`      | Mood excited                           |
| `level_up`       | Crossed an XP threshold                |
| `eating`         | After a meal is logged                 |
| `cooking`        | During an active cooking session       |

Keep a single source dog rig; drive states via a state machine input so the dog
visually evolves (size/accessories) with `level` without new rigs per level.
