# ReeferSense

A 4-screen Expo / React Native prototype:

1. **Splash** — placeholder logo (dial mark), fades/scales in, then auto-advances.
2. **Home** — session label input up top, two animated selector circles
   ("Primary Node" / "Reefer Fleet"). Tapping one scales it up and reveals a
   Continue button. No nav bar.
3. **Primary Node → Live Readings** (circle one) — vertical temperature bar
   on the left, a grid of semicircle "dial" gauges on the right: Humidity,
   CO2, pH, and two placeholder sensors (Sensor E / Sensor F). No nav bar.
4. **Reefer Fleet → 40ft Container** (circle two) — the sensors screen fades
   into this one. A stylized angled reefer container "spin-zooms" in on
   load, split into 3 tappable zones that change color when selected. The
   same sensor gauge grid appears below it. This screen has a hamburger
   menu (top-left) that opens a sliding drawer with placeholder nav items
   (no functionality yet).

All sensor values are dummy data that drift slightly every few seconds so
the gauges feel "live."

## Running it in Expo Go

```bash
npm install
npx expo install --fix   # aligns exact package versions to your installed SDK
npx expo start
```

Scan the QR code with the Expo Go app (Android: Expo Go from Play Store,
iOS: Expo Go from the App Store) on the same Wi-Fi network as your computer.

**A note on SDK versions:** this project targets Expo SDK 54. As of mid-2026,
Expo Go on the App Store had a brief lag before supporting the newest SDKs
(55/56), while SDK 54 was confirmed working on both the App Store and Play
Store versions of Expo Go. If `npx expo start` warns that your installed
Expo Go app expects a different SDK, either update Expo Go from your app
store, or run `npx expo install --fix` again after bumping the `expo`
version in `package.json` to match what your Expo Go app reports.

## Where to make it yours

- **Logo**: `components/Logo.js` — swap the placeholder ring mark for
  `<Image source={require('../assets/logo.png')} />` once you have real art.
- **Colors/fonts**: `constants/theme.js` — one file controls the whole
  palette (frost cyan / amber / danger red) and type choices.
- **Dummy data**: `components/SensorDashboard.js` — replace the
  `setInterval` jitter with real sensor reads (e.g. from your ColdNode/
  GrowNode MQTT feed) whenever you're ready to wire it up.
- **Drawer items**: `components/SideDrawer.js` — the `MENU_ITEMS` array.
- **Reefer graphic**: `components/ReeferGraphic.js` — pure SVG shapes, no
  image assets, so it's easy to keep tweaking dimensions/labels.

## Project structure

```
app/
  _layout.js     Stack navigator, headers hidden, fade transitions
  index.js       Splash (screen 1)
  home.js        Selector screen (screen 2)
  sensors.js     Primary node dashboard (screen 3)
  reefer.js      Reefer container + dashboard (screen 4)
components/
  Logo.js
  SelectorNode.js
  GaugeCard.js
  TemperatureBar.js
  SensorDashboard.js
  ReeferGraphic.js
  SideDrawer.js
constants/
  theme.js
  gaugeMath.js
```
