---
'@ship-it-ui/icons': patch
---

Expand the icon manifest with a travel & transport glyph set so the design
system covers consumer-mobility apps (car rental, rideshare, hotel,
flight-adjacent surfaces) — not just developer/observability UI.

**New glyph categories** in `glyphManifest`:

- **Vehicles**: `car`, `carFront`, `carTaxi`, `suv`, `truck`, `pickup`,
  `van`, `bus`, `caravan`, `motorcycle`, `scooter`, `bike`, `ev`, `plane`,
  `planeTakeoff`, `planeLanding`, `train`, `tram`, `ship`, `sailboat`,
  `ambulance`, `helicopter`.
- **Vehicle parts & telematics**: `steeringWheel`, `carKey`, `gearShift`,
  `engine`, `fuel`, `gasPump`, `evCharger`, `battery`, `batteryCharging`,
  `batteryFull`, `batteryLow`, `seat`, `seatbelt`, `camera`, `snowflake`,
  `trafficCone`.
- **Locations (pickup/dropoff)**: `airport`, `hotel`, `building`,
  `building2`, `trainStation`, `busStation`, `ferryTerminal`, `parking`,
  `parkingGarage`, `gasStation`, `chargingStation`, `valet`, `store`,
  `landmark`, `castle`, `tent`, `mountain`, `palmTree`, `city`.
- **Trip essentials & artifacts**: `luggage`, `briefcase`, `backpack`,
  `passport`, `boardingPass`, `idCard`, `driversLicense`, `signature`,
  `contract`, `agreement`.
- **Booking lifecycle**: `carPickup`, `carReturn`, `checkin`, `checkout`,
  `inspection`, `contactless`, `selfService`.
- **Safety, insurance, emergency**: `umbrella`, `firstAid`, `sos`,
  `roadsideAssistance`, `collision`, `damage`, `verified`, `notVerified`,
  `shieldHalf`.
- **Vehicle features (filter chips)**: `bluetooth`, `bluetoothConnected`,
  `usb`, `childSeat`, `baby`, `petFriendly`, `smokeFree`, `smoking`.
- **Weather (trip planning)**: `sunny`, `cloudy`, `rainy`, `snowy`,
  `foggy`, `windy`, `thermometer`, `droplets`, `sunrise`, `sunset`.
- **People (driver/passenger roles)**: `driver`, `passenger`, `coDriver`,
  `chauffeur`.
- **Map & routing**: `pickupPin`, `dropoffPin`, `oneWay`, `roundTrip`.
- **Commerce**: `priceTag`, `percent`, `promo`, `refund`, `piggyBank`.

**New `connectorManifest` entries** for consumer payments and rideshare:
`applePay`, `googlePay`, `venmo`, `cashApp`, `klarna`, `afterpay`, `amex`,
`visa`, `mastercard`, `discover`, `uber`, `lyft`.

All entries resolve against the existing Iconify pipeline — no source code,
docs, or component changes required. The iconography docs page derives
from the manifest and surfaces the new icons automatically. Total inventory
goes from ~245 to ~471 entries.

Iconify slugs that were initially requested but don't exist in the
installed collections were dropped: `helicopter` is now sourced from
`lucide` (Phosphor doesn't ship one); `airbag`, `affirm`, `applewallet`,
and `googlewallet` are deferred until the collections add them or a
custom SVG path is added under `src/svg/`.
