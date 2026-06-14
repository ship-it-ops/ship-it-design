---
'@ship-it-ui/icons': patch
---

Add social-media and tech brand glyphs to the icon manifest.

`connectorManifest` gains a curated set of `simple-icons` brand logos, available
via `<IconGlyph kind="connector" name="…" />`:

- **Social & content:** `instagram`, `facebook`, `x`, `twitter`, `youtube`,
  `tiktok`, `linkedin`, `reddit`, `pinterest`, `snapchat`, `whatsapp`,
  `messenger`, `signal`, `wechat`, `line`, `threads`, `mastodon`, `bluesky`,
  `twitch`, `tumblr`, `vimeo`, `medium`, `substack`, `spotify`, `soundcloud`,
  `patreon`, `behance`, `dribbble`.
- **Platforms & OS:** `apple`, `google`, `microsoft`, `amazon`, `meta`,
  `android`, `linux`, `ubuntu`.
- **Languages:** `kotlin`, `swift`, `php`, `ruby`, `rubyOnRails`, `cSharp`,
  `dotNet`, `cPlusPlus`, `c`, `scala`, `elixir`, `dart`.
- **Frameworks & runtimes:** `angular`, `solid`, `astro`, `remix`, `nuxt`,
  `flutter`, `tailwind`, `bun`, `deno`.
- **Package managers & tooling:** `npm`, `pnpm`, `yarn`, `webpack`, `esbuild`,
  `rollup`, `jest`, `vitestRunner`, `cypress`, `playwright`, `storybook`,
  `eslint`, `prettier`, `git`.
- **Messaging & infra:** `nginx`, `apacheKafka`, `rabbitmq`, `graphql`.
- **Car manufacturers (every brand in simple-icons):** `toyota`, `acura`,
  `honda`, `nissan`, `infiniti`, `mazda`, `mitsubishi`, `subaru`, `suzuki`,
  `hyundai`, `kia`, `ford`, `chevrolet`, `cadillac`, `chrysler`, `jeep`, `ram`,
  `tesla`, `lucidMotors`, `volkswagen`, `audi`, `porsche`, `bmw`, `mini`,
  `mercedes`, `smart`, `opel`, `vauxhall`, `skoda`, `seatCar`, `renault`,
  `dacia`, `peugeot`, `citroen`, `dsAutomobiles`, `fiat`, `alfaRomeo`,
  `maserati`, `ferrari`, `lamborghini`, `bugatti`, `bentley`, `rollsRoyce`,
  `astonMartin`, `jaguar`, `landRover`, `mclaren`, `volvo`, `polestar`,
  `koenigsegg`, `mg`, `tata`, `mahindra`, `proton`.

`src/icon-data.ts` is regenerated accordingly. Also rewrites the package README
to lead with the Iconify manifest (the canonical path) and document the SVGR
pipeline as the bespoke-SVG escape hatch.
