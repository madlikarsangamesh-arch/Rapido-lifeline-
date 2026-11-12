# RAPID LIFELINE
## UI/UX DESIGN SYSTEM & EXPERIENCE SPECIFICATION

**Version:** 2.1  
**Date:** 10 November 2026  
**Status:** Proposed — Pending Approval  
**Product:** Rapid Lifeline  
**Initial Market:** Bengaluru, Karnataka, India

---

# 1. Purpose and Scope

This document defines the visual identity, user experience, interface behaviour, reusable components and interaction standards for Rapid Lifeline.

Rapid Lifeline is an emergency ambulance coordination platform designed to connect customers, ambulance operators, drivers, hospitals and administrators.

The interface must communicate urgency without creating panic. Users must be able to understand what to do, where to go and what is happening at every stage.

The design must be:

- Professional and trustworthy.
- Premium without unnecessary decoration.
- Simple enough to use under emergency pressure.
- Consistent across mobile and web.
- Accessible to users with different abilities.
- Responsive to unreliable internet connections.
- Honest about availability, verification and simulated data.

**Core design principle: Every screen must have a clear purpose, every action must have a predictable result, and every important status must be understandable.**

# 2. Design Philosophy

## 2.1 Emergency-first design

Users may be stressed or unfamiliar with the application.

Therefore:

- Keep the primary action visually prominent.
- Avoid unnecessary questions and screens.
- Use simple, direct language.
- Display the primary booking action and private-service boundary prominently.
- Avoid confusing animations and decorative elements.
- Never hide critical information behind multiple menus.

## 2.2 Trust through transparency

The application must never imply that a service is available, verified or confirmed when it is not.

Rules:

- Clearly distinguish sample data from live data.
- Show the freshness of location and hospital information.
- Display fare estimates before confirmation.
- Explain why a hospital is recommended.
- Clearly communicate booking failures and delays.
- Never display a fake driver assignment as a real assignment.

## 2.3 Consistency

All five interfaces must use the same brand identity, typography, colour system, spacing principles and interaction patterns.

The five product interfaces are:

1. Customer mobile application.
2. Driver mobile application.
3. Operator dashboard.
4. Hospital dashboard.
5. Super admin dashboard.

The public family tracking page is a separate public web experience within the web application. It is not a sixth product interface.

The family tracking page must follow the same design system and accessibility, privacy, safety and data-transparency standards.

## 2.4 Private-service boundary and safety

Rapid Lifeline is a private ambulance coordination platform, not a government emergency response service. Do not present an in-app control as a direct connection to public emergency services. The service must not imply that it replaces public emergency services or provides medical advice.

Any separately approved emergency-access behavior and all driver motion-lock behavior must be validated on actual devices before production release. No emergency-access control may silently bypass the approved driver motion lock, and the interface must not encourage driver interaction while moving. The prototype must not claim unvalidated safety behavior or initiate real emergency calls during testing.

# 3. Brand Identity

## 3.1 Brand name

Rapid Lifeline

## 3.2 Logo and wordmark

- Use the original Rapid Lifeline logo.
- Wordmark: Inter Bold.
- Use the green cross-in-pulse symbol.
- App icon: white cross-with-pulse on a green rounded square.
- Never copy Rapido's logo, wordmark or photographs.

## 3.3 Brand personality

The brand should communicate:

- Reliability.
- Speed.
- Care.
- Safety.
- Professionalism.
- Clarity.

Avoid playful illustrations, excessive gradients, unnecessary shadows and distracting visual effects.

# 4. Colour System

The following approved colour tokens remain unchanged.

| Token | Hex | Purpose |
|---|---|---|
| primary-600 | #0B7D43 | Main buttons, active states |
| primary-700 | #09663A | Pressed states |
| primary-500 | #16A34A | Illustrations and route lines |
| primary-50 | #E8F6EE | Selected backgrounds |
| emergency-600 | #D92D20 | Critical in-app alerts, SOS and errors |
| emergency-50 | #FEF3F2 | Error backgrounds |
| warning-600 | #B54708 | Stale data and warnings |
| warning-50 | #FFFAEB | Warning backgrounds |
| info-600 | #1570EF | Information and patient transport |
| ink-900 | #101828 | Primary text |
| ink-600 | #475467 | Secondary text |
| ink-300 | #D0D5DD | Borders |
| surface-50 | #F9FAFB | Page background |
| surface-0 | #FFFFFF | Cards and surfaces |

### Colour usage rules

- Green represents primary actions and positive progress.
- Red is reserved for emergency actions, SOS and critical errors.
- Amber represents warnings and outdated information.
- Blue represents informational elements.
- Colour must never be the only way of communicating a status.
- All text must satisfy WCAG 2.1 AA contrast requirements.

Dark mode is not included in v1.

# 5. Typography and Layout

## 5.1 Fonts

- English and numbers: Inter.
- Kannada: Noto Sans Kannada.
- Fonts must be bundled locally.
- Do not depend on network font loading.

## 5.2 Typography scale

| Style | Size / Line height | Weight |
|---|---|---|
| Display | 32 / 40 | 700 |
| Title | 22 / 28 | 700 |
| Heading | 18 / 24 | 600 |
| Body | 16 / 24 | 400 |
| Caption | 13 / 18 | 400 |

No text should be smaller than 13 px for normal interface labels.

## 5.3 Spacing

Approved spacing scale:

4, 8, 12, 16, 24, 32 and 48 px.

- Mobile side padding: 16 px.
- Card radius: 16 px.
- Button radius: 12 px.
- Chip radius: 999 px.
- Bottom sheet top corners: 24 px.
- Minimum interactive target: 48 × 48 dp.
- Minimum separation between tap targets: 8 dp.

## 5.4 Responsive layout

| Device | Width |
|---|---|
| Mobile | Up to 639 px |
| Tablet | 640–1023 px |
| Desktop | 1024 px and above |

Maximum web content width: 1200 px.

Desktop layouts should use available space intelligently without stretching mobile-sized cards across the entire screen.

Mobile layouts must prioritise one-handed use and keep primary actions in the bottom 40% of the screen wherever practical.

# 6. Reusable Component System

Every component must have consistent default, selected, pressed, disabled, loading and error states where applicable.

## 6.1 Primary button

- Green background.
- White text.
- 12 px radius.
- Minimum 48 dp touch target.
- Pressed state uses primary-700.
- Disabled state uses ink-300.
- Loading state displays a spinner without changing button width.

The main ambulance booking button remains 72 dp tall.

## 6.2 Secondary button

- White background.
- Green border.
- Green text.
- Used for secondary actions.

## 6.3 Critical alerts and service boundary

Use emergency-600 for critical in-app alerts and errors only. Do not use it to imply a direct public emergency-service connection or display a public emergency-call control. Clearly identify Rapid Lifeline as a private ambulance coordination platform in the customer onboarding/disclaimer experience and relevant failure states.

## 6.4 Cards

All cards should have:

- Consistent padding.
- Clear title and supporting information.
- Logical content hierarchy.
- Appropriate touch feedback when interactive.
- Consistent corner radius.
- No unnecessary decorative elements.

## 6.5 Status banners

| Status | Appearance |
|---|---|
| Stale data | Warning background |
| Offline | Dark background with white text |
| Error | Emergency background |
| Success | Green status styling |

Status messages must include text and, where useful, an icon.

## 6.6 Prototype indicator

Display the exact label:

**Prototype, test data**

Use a small warning-coloured pill in the top-left area of every prototype screen.

Remove it only in approved production builds.

## 6.7 Bottom sheets

Used for ambulance selection, hospital selection and trip status.

Must include:

- Drag handle.
- Clear heading.
- Scrollable content.
- Visible close or back action where applicable.
- Accessible controls.
- 24 px top corner radius.

# 7. Ambulance Illustration System

All ambulance illustrations must be original flat vector SVG artwork.

Common characteristics:

- Side view facing right.
- White ambulance body.
- Rounded box body and cab.
- Roof beacon.
- Medical cross symbol.
- 2 px rounded dark outlines.
- No copied commercial branding.
- No real vehicle photographs in v1.

## 7.1 Ambulance categories

| Category | Stripe colour | Distinguishing feature |
|---|---|---|
| BLS | Green | Single stripe, one beacon |
| ALS | Red | Double stripe, two beacons and monitor |
| ICU | Purple | Wider body and pulse-line icon |
| Patient Transport | Blue | Rear ramp and wheelchair icon |
| Neonatal | Pink | Incubator icon |

Illustration sizes:

- Card: 72 × 48 px.
- Hero: 360 × 240 px.
- Map marker: 40 × 40 px.

The hero illustration must be visually balanced with the booking card, not overpower it.

# 8. Customer Application

The customer application contains seven primary screens.

The approved primary booking flow is:

**C1 Home → C2 Ambulance Selection → C4 Confirmation → C5 Finding Ambulance → C6 Live Tracking → C7 Completion.**

The three primary actions are C1 Book, C2 Continue and C4 Confirm and book. C2 Continue navigates directly to C4 with the recommended hospital preselected. C3 is optional and is opened from C4 using Change hospital; selecting a hospital in C3 returns to C4 with the selected hospital preserved.

## C1 — Home

### Purpose

Allow customers to begin an ambulance request quickly.

### Layout

1. Header with Rapid Lifeline logo.
2. Prototype, test data indicator.
3. Greeting and short supporting message.
4. Pickup map and location information.
5. Booking for someone else toggle.
6. Primary Book ambulance button.

The home screen must prioritise the pickup location and primary booking action. Do not display a Recent hospitals section in v1. The PRD does not define recent-hospital history as a required feature; omitting it keeps the emergency booking screen focused and avoids introducing unsupported scope.

### Required interactions

- Pickup location opens an editable location interface.
- Booking for someone else updates the booking state.
- Map supports the approved location-selection behaviour.
- Book ambulance navigates to C2.

### Required states

- GPS permission denied.
- GPS disabled.
- Location unavailable.
- Manual location entry.
- Offline.
- Loading.
- Location update failure.

When GPS is unavailable, users must be able to enter a pickup address manually.

## C2 — Ambulance Choice

### Purpose

Allow the customer to choose the appropriate ambulance category.

### Layout

Display five category cards:

- BLS.
- ALS.
- ICU.
- Patient Transport.
- Neonatal.

Each card contains:

- Original ambulance illustration.
- Category name.
- Short description.
- Estimated arrival time when supported by data.
- Fare range when supported by data.

Selected cards use primary-50 background and a 2 px green border.

Include:

**Not sure? Answer 2 questions**

The triage flow must not be presented as medical diagnosis or medical advice.

### Required interactions

- Select ambulance category.
- Change selection.
- Open the two-question guidance flow.
- Continue navigates directly to C4.

A default category may be selected only according to approved product rules and available information.

The recommended hospital is preselected and passed to C4. The customer may use Change hospital on C4 to open C3. Do not invent an ETA or fare.

## C3 — Hospital Choice

### Purpose

Help the customer select a suitable hospital.

### Layout

- Three recommended hospital cards.
- Search field.
- Specialty filter chips.
- Why this hospital link.
- Verification status.
- Data freshness information.

Filters:

- Cardiac.
- Stroke.
- Trauma.
- Burns.
- Pediatric.
- Maternity.

### Hospital card information

- Hospital name.
- Distance when available.
- Estimated travel time when available.
- Emergency department status when verified.
- Specialties when verified.
- Verification status.
- Data freshness.

### Required interactions

- Select a hospital.
- Search hospitals.
- Apply specialty filters.
- View recommendation explanation.
- Change the preselected hospital.

Unavailable or closed hospitals must be visibly identified and must not appear as available.

## C4 — Confirmation

### Purpose

Allow the customer to review the complete booking before submission.

### Layout

1. Pickup location.
2. Destination hospital, including the selected hospital name and relevant available destination information.
3. Selected ambulance category.
4. Fare estimate.
5. Payment method.
6. Patient information.
7. Consent checkbox.
8. Cancellation rules.
9. Confirm and book button.

Consent label:

**Share patient summary with the hospital**

Show a clearly visible Change hospital action that opens C3. After a selection in C3, return to C4 and display the new destination and corresponding estimate.

### Required interactions

- Edit booking information.
- Change payment method.
- Confirm consent.
- Validate required fields.
- Submit booking.

The fare note must read:

**Estimate. Final fare shown at trip end.**

The application must not show a real booking confirmation until the backend successfully accepts the request. In prototype mode, label the local booking state as simulated and never imply that a real dispatch or hospital alert was created.

On confirmation, start ambulance dispatch and hospital coordination in parallel. Show these as separate statuses; hospital acceptance must never delay driver assignment. A hospital destination change remains proposed until the assigned driver confirms it.

### Failure states

- Payment failure.
- Booking failure.
- Network interruption.
- Invalid details.

Cash remains available as the guest payment default, according to approved product rules.

## C5 — Finding Ambulance

### Purpose

Show that the system is searching for a suitable ambulance.

### Layout

- Map.
- Pickup marker.
- Search animation.
- Finding the nearest ambulance message.
- Elapsed timer.
- Cancellation action.

### Required behaviour

- Show actual search state from the backend.
- Display elapsed time.
- Do not invent driver information.
- Display an upgrade offer only after the approved 30-second threshold and only when a valid alternative exists.

### No-driver state

Display:

**No partner ambulance is currently available.**

Provide retry and Rapid Lifeline support actions. Do not imply that a public emergency service is available through the product.

### Hospital coordination status

Display hospital coordination separately from ambulance dispatch: pending response, accepted, declined, timed out, destination change awaiting driver confirmation, destination confirmed, or operations resolution required. A dispatch search or driver assignment must continue while hospital coordination is pending.

Show the hospital reminder and operations escalation at 10 seconds without a response. At 20 seconds, show the timeout as not accepted, and show that the system is searching for the next suitable hospital. A destination change is not shown as active until driver confirmation. If the driver rejects the proposed destination or no suitable hospital remains, show that operations must resolve it; do not silently change the destination.

## C6 — Live Tracking

### Purpose

Show the assigned ambulance's journey.

### Layout

- Map with ambulance marker.
- Route.
- Hospital pin.
- ETA chip.
- Driver card.
- Trip milestone stepper.
- Share live trip.
- Call driver.
- Share exact pickup pin.

### Driver card

- First name.
- Rating, when available.
- Vehicle registration.
- Ambulance category.
- Crew count.

### Milestones

1. Booked.
2. Driver assigned.
3. Arriving.
4. Picked up.
5. En route.
6. Arrived.

### Required behaviour

- Location must come from actual driver updates.
- Show stale-location warnings.
- Do not extrapolate ambulance position beyond the last real location.
- Re-routing must display a clear notice.
- Family tracking must use a controlled shareable link.

## C7 — Trip Complete

### Purpose

Close the journey and provide a clear summary.

### Layout

- Arrival confirmation.
- Hospital name.
- Final fare.
- Fare breakdown.
- Payment status.
- Rating.
- Receipt.

### Required interactions

- Confirm cash payment where applicable.
- Submit rating.
- View receipt.
- Finish trip.

Payment-pending state must be clearly displayed.

# 9. Additional Customer Screens

The following screens must follow the same design system:

- Phone login.
- OTP verification.
- Continue as guest.
- Language settings.
- Accessibility settings.
- Trusted contacts.
- Trip history.
- Receipt.
- Support.
- Consent.
- Medical disclaimer.

The emergency guest option must remain accessible.

# 10. Driver Application

The driver application must support one-handed operation and minimise distraction.

The approved driver screens remain:

| Screen | Purpose |
|---|---|
| D1 | Home and duty |
| D2 | Job offer |
| D3 | Navigate to patient |
| D4 | Pickup |
| D5 | Navigate to hospital |
| D6 | Hospital changed |
| D7 | Trip complete |
| D8 | Earnings and profile |

### Driving safety and motion lock

The PRD defines the driving motion-lock threshold as above 10 km/h.

- Touch interaction must be locked when detected vehicle speed is greater than 10 km/h.
- The lock must not activate solely because the vehicle reaches exactly 10 km/h.
- Voice navigation guidance must remain available when implemented and tested.
- The interface must minimise driver distraction.
- The prototype must not claim that motion lock or voice guidance is operational unless each capability has actually been implemented and tested.
- Do not include an emergency-pause long-press interaction in v1. It is not defined in the PRD or Architecture as an approved feature.

Any future exception to the motion lock requires an explicitly approved safety design and validation before implementation.

### Driver job offer

Display:

- Pickup address.
- Distance.
- ETA.
- Ambulance category.
- Fare.
- 20-second countdown.
- Accept.
- Decline.

The job offer must clearly expire when its countdown reaches zero.

### Driver navigation

Display large next-turn instructions, distance, ETA and voice prompts.

Touch interaction must lock only when the detected speed is greater than 10 km/h; exactly 10 km/h must not trigger the lock. The motion lock and any emergency-access behavior remain subject to actual-device validation. Do not claim either capability is operational until implemented and tested on actual devices. Never encourage a driver to interact with the app while moving.

### Pickup and hospital arrival

Record each milestone as a backend event. Do not advance trip status solely because a button was visually pressed.

# 11. Public Family Tracking Page

Route:

`track.rapidlifeline.in/t/<token>`

The page must work without login or application installation.

### Layout

1. Rapid Lifeline header.
2. Live map.
3. Ambulance marker.
4. Hospital marker.
5. ETA.
6. Milestone stepper.
7. Driver card.
8. Location freshness indicator.

Do not expose:

- Patient medical information.
- Driver personal phone number.
- Unnecessary personal information.

The tracking token must be securely generated, difficult to guess and revocable.

The page should remain lightweight, with a target payload below 300 KB before map assets.

# 12. Web Home Page

The public website follows the approved section order.

1. Header.
2. Hero.
3. Ambulance categories.
4. How it works.
5. Safety and trust.
6. Hospital partners.
7. Partner with us.
8. App download band.
9. Footer.

### Hero

Headline:

**Ambulance in minutes, hospital ready on arrival**

Include:

- Pickup field.
- Situation chips.
- Ambulance category chips.
- Fare summary when supported.
- Book ambulance.
- Original ALS ambulance illustration.

Do not advertise unverified service availability.

Mobile layout:

- Headline first.
- Booking card second.
- Illustration below.

# 13. Hospital, Operator and Super Admin Dashboards

All dashboards must use a consistent desktop-first layout.

### Shared layout

- Left sidebar.
- Top navigation.
- User menu.
- Main content area.
- Tables and white cards.
- Clear status indicators.

Minimum desktop target: 1280 px.

Usable tablet target: 768 px.

## Hospital dashboard

Screens:

- Inbound.
- Trip detail.
- Capacity.
- History.

Important interactions:

- Accept inbound.
- Redirect inbound.
- Update emergency department status.
- Update capacity.
- View patient summary only with consent.

Hospital coordination starts in parallel with ambulance dispatch; hospital acceptance must never delay driver assignment. The hospital alert states are pending_response, accepted, declined, redirected and timed_out. At 10 seconds without a response, send an urgent reminder to the hospital and alert operations. At 20 seconds, mark the alert timed_out (never accepted), record timeout and rerouting events, alert operations, and immediately search for the next suitable hospital. A decline starts the same search. Proposed destination states are destination_change_pending_driver, destination_confirmed and needs_ops_resolution. Only an explicit confirmation from the assigned driver applies a destination change; rejection or no suitable hospital requires operations resolution, with no silent reroute. Show the states and actions to the hospital coordinator, driver, customer and operations roles as appropriate; never imply that silence is acceptance.

The corresponding user-visible events are hospital.alerted, hospital.reminder_sent, hospital.accepted, hospital.declined, hospital.redirected, hospital.timed_out, hospital.alternative_search_started, hospital.alternative_found, hospital.destination_change_proposed, hospital.destination_change_confirmed, hospital.destination_change_rejected and hospital.needs_ops_resolution. If a coordination or notification action fails, show a truthful pending/error state and route the issue to operations; do not imply acceptance or stop ambulance dispatch.

## Operator dashboard

Screens:

- Fleet.
- Drivers.
- Vehicles.
- Earnings.

Important interactions:

- Add vehicle.
- Add driver.
- View verification status.
- Track fleet.
- View earnings.

## Super admin dashboard

Screens:

- Verification queue.
- Live fleet map.
- Trips.
- Hospitals.
- Fare card.
- Users.
- Audit log.
- Support.

All approval and rejection actions must be recorded in the audit log.

# 14. Accessibility and Language

The application supports:

- English.
- Kannada.

Default language:

- Kannada when the device language is Kannada.
- English otherwise.

All interface strings must use translation files.

### Accessibility requirements

- WCAG 2.1 AA contrast.
- Screen-reader labels.
- Minimum 48 × 48 dp tap targets.
- Large-text mode at 1.3 scale.
- No clipped text.
- Logical reading order.
- Clear focus indicators.
- Icons accompanied by meaningful labels where needed.

### Low-data mode

When enabled:

- Use lightweight map rendering or static map imagery where appropriate.
- Keep ambulance position and tracking information within the PRD's maximum location-age requirement of 5 seconds.
- Reduce unnecessary map-tile downloads and image assets.
- Replace large illustrations with lightweight icons where appropriate.
- Keep the page payload target below 100 KB, excluding external map assets.

Low-data mode must not relax location freshness or display outdated ambulance positions as live.

The application may suggest low-data mode after two failed loads on 2G or 3G, where network information is available.

# 15. Motion and Interaction

Motion must communicate state changes, not merely decorate the interface.

| Element | Motion |
|---|---|
| Book button | Soft 2-second pulse |
| Bottom sheet | 250 ms slide |
| Screen transition | 200 ms |
| Finding ambulance | 1.8-second radar loop |
| Ambulance marker | Movement based on actual updates in production; simulated movement must be identified as prototype data under Section 18 |
| Milestone | 300 ms transition |
| Re-route notice | 4-second notice |

Respect the operating system's reduced-motion preference.

When reduced motion is enabled, animations become static or instantaneous.

# 16. Error Handling and System States

Every screen must have appropriate:

- Loading state.
- Empty state.
- Error state.
- Offline state.
- Stale-data state.
- Disabled state.
- Retry behaviour.

Every error screen must provide a meaningful recovery action.

Where appropriate, provide:

- Retry.
- Rapid Lifeline support.

Never leave users looking at a blank screen after an API failure.

# 17. Approved Interface Copy

Use short, calm and direct language.

| Key | Text |
|---|---|
| book.cta | Book ambulance |
| fare.note | Estimate. Final fare shown at trip end. |
| search.finding | Finding the nearest ambulance |
| search.none | No partner ambulance is currently available. |
| trip.assigned | Driver assigned |
| trip.arriving | Ambulance is on the way |
| trip.picked | Patient on board |
| trip.enroute | Heading to the hospital |
| trip.arrived | Arrived at the hospital |
| trip.reroute | New route found. ETA updated. |
| hospital.verified | Verified |
| hospital.unverified | Unverified hospital |
| hospital.closed | ER closed |
| hospital.why | Why this hospital |
| proto.label | Prototype, test data |
| offline.banner | No internet connection. Reconnect to continue your booking. |
| error.server | Something went wrong. Please retry or contact Rapid Lifeline support. |
| disclaimer | Rapid Lifeline is a private ambulance coordination platform, not a government emergency response service. It does not provide medical advice or replace public emergency services. |

Kannada translations must preserve the meaning and tone of the English strings.

# 18. Data Integrity and Visual Honesty

This section is mandatory.

The interface must distinguish between:

**Live data:** received from a functioning backend or connected service.

**Sample data:** manually prepared information used for demonstrations.

**Simulated data:** generated information used to demonstrate a system process.

**Unavailable data:** information that cannot currently be retrieved.

### Prototype data

The prototype may use synthetic data, fixtures and simulated driver GPS/ETA updates to demonstrate booking, dispatch and tracking workflows.

All simulated information must be clearly identified with the existing **Prototype, test data** label.

Where tracking data is simulated:

- Clearly identify the ambulance position and ETA as simulated.
- Never describe simulated movement as actual live GPS.
- Never imply that a real driver has been assigned when the assignment is simulated.
- Never imply that a real ambulance is travelling to the customer.
- Show appropriate timestamps and data-freshness information.

### Production data

Production tracking must use actual location updates received from the assigned driver's device.

- Display stale-location warnings when updates exceed the approved freshness requirement.
- Do not extrapolate an ambulance's position beyond its last valid location.
- Display the actual tracking status and timestamp.
- Do not present simulated GPS or synthetic trip data as production information.

The existing privacy, consent and tracking-link requirements remain unchanged.

Additional integrity rules:

1. Never label sample hospitals as verified partners.
2. Never invent ambulance availability.
3. Never display a fake payment success.
4. Never claim a booking is confirmed before backend confirmation.
5. Clearly mark estimated fares and ETAs.
6. Keep medical and emergency disclaimers visible where required.

# 19. Implementation and Quality Assurance

The coding agent must follow these rules.

- Use the approved React Native and Expo architecture.
- Reuse existing design tokens.
- Reuse existing components where possible.
- Keep the approved backend architecture unchanged.
- Avoid unnecessary dependencies.
- Do not create duplicate implementations.
- Do not replace existing working functionality without approval.
- Do not silently change product requirements.
- Keep the implementation consistent across mobile and web.

### Document-wide implementation rules

Apply these rules to every screen:

- Preserve the approved PRD requirements and architecture, and reuse existing design tokens and shared components.
- Do not introduce features that are not defined in the approved product scope.
- Every visible interactive control must have a defined and tested outcome.
- Use synthetic data in the prototype.
- Never represent a simulated action as a completed real-world action.

### Required testing

Every interactive element must be tested.

The following must be verified:

- Navigation.
- Form validation.
- Selection states.
- Button actions.
- Loading indicators.
- Error recovery.
- Offline behaviour.
- Responsive layouts.
- Accessibility labels.
- Backend integration.
- Booking state transitions.

A successful typecheck is not sufficient evidence that a feature works.

The implementation report must distinguish:

- Implemented and tested.
- Implemented but not tested.
- Simulated.
- Not implemented.
- Blocked by dependencies or infrastructure.

# 20. Design Approval and Change Management

This document is the proposed UI/UX specification for Version 2.1.

The original approved product requirements and architecture remain authoritative for their respective areas.

Any change to an approved requirement must:

1. Be identified.
2. Include a reason.
3. Explain the impact on the user experience.
4. Identify affected screens and components.
5. Be approved before implementation.
6. Be recorded in the change history.

The coding agent must not treat this document as permission to redesign unrelated systems.

### Approval principle

No major design or functional change should be implemented without review.

### Change history

- **v2.1 — 10 Nov 2026 — Proposed, pending approval:** Aligns the service boundary, customer booking flow, parallel ambulance dispatch and hospital coordination, 10-second reminder/20-second timeout, driver-confirmed destination changes, and prototype/live-data disclosure. Removes direct public emergency-service call controls from product interfaces. Pricing, cancellation, hospital ranking and unrelated approved design decisions are unchanged.
- **v2.0 — 10 Nov 2026 — Proposed, pending approval:** UI/UX Design System & Experience Specification.

---

# DESIGN STANDARD

Rapid Lifeline must look and behave like a professional private ambulance coordination platform.

It must not feel like a generic booking application, a static college project or a collection of disconnected screens.

Every screen must be visually consistent, logically connected, accessible, responsive and honest about its functionality.

**Our standard: Professional design. Clear decisions. Reliable interactions. Safe ambulance-coordination workflows. Verified implementation.**