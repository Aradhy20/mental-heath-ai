# DESIGN.md - MindfulAI Stitch System

This document captures the design rules, tokens, and component properties for the MindfulAI ecosystem, following the **Google Stitch** (Material 3) AI-native design philosophy.

## 🎨 Color System (Material 3 Dark)
| Token | Hex | Description |
| :--- | :--- | :--- |
| `primary` | `#3F51B5` | Indigo (Primary) |
| `on-primary` | `#FFFFFF` | Text on Indigo |
| `primary-container` | `#E8EAF6` | Light Indigo container |
| `on-primary-container` | `#1A237E` | Text on light Indigo |
| `secondary` | `#009688` | Teal (Secondary) |
| `on-secondary` | `#FFFFFF` | Text on Teal |
| `surface` | `#FFFFFF` | Base surface (Light) |
| `on-surface` | `#1C1B1F` | Default text |
| `surface-variant` | `#F5F5F5` | Neutral surface for cards |
| `outline` | `#79747E` | Border color |
| `error` | `#B00020` | Error status |

## 📐 Layout & Spacing
- **Grid:** 8dp spacing system
- **Elevation:** Material Elevation levels (0-5)
    - Small: 8px (Buttons)
    - Medium: 12px (Small cards)
    - Large: 16px (Main cards)
    - Extra Large: 28px (Dialogs/Search bars)
- **Container Margins:** 16px (Mobile), 24px (Web)

## ✍️ Typography (Google Fonts: Outfit)
- **Display Large:** 57/64, -0.25px
- **Headline Medium:** 28/36, 0px
- **Title Large:** 22/28, 0px
- **Body Large:** 16/24, 0.5px
- **Label Medium:** 12/16, 0.5px

## 💠 Components
### Tonal Button
- Background: `primary-container`
- Text: `on-primary-container`
- Radius: `full`

### Elevated Card
- Background: `surface-variant`
- Border: `outline` (0.5px)
- Radius: `large`

### AI Chat Bubble
- User: `secondary-container` / `on-secondary-container`
- AI: `primary-container` / `on-primary-container`
- Shape: Asymmetric rounded corners (Stitch style)
