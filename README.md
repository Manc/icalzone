# iCalzone 🗓🌎

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![Size][min-size-image]][npm-url]
[![MIT License][license-image]][license-url]

**iCalzone** is a light-weight utility written in TypeScript that resolves time zone strings to iCalendar-compatible `VTIMEZONE` components fast.

All time zone information is stored in-memory and rendered on demand.

The time zone data is based on [@touch4it/ical-timezones](https://github.com/touch4it/ical-timezones), but reduced and somewhat compressed. Opposed to **@touch4it/ical-timezones**, this library does not require runtime disk access to look up and parse ICS files, which makes **iCalzone** much faster, although a bit more memory may be used, of course.

To look up a time zone, you must use the [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) with the two-part format `*/*`, such as `America/Los_Angeles` or `Etc/UTC`.


## 📦 Installation

```sh
yarn add icalzone
# or
npm install icalzone
```


## ⚡️ Quick Start

```typescript
import { getZoneLines, getZoneString } from 'icalzone';

const asArray = getZoneLines('Europe/London');
console.log(asArray);
/*
[
  'BEGIN:VTIMEZONE',
  'TZID:Europe/London',
  'BEGIN:STANDARD',
  'TZNAME:GMT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0000',
  'DTSTART:19701025T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'BEGIN:DAYLIGHT',
  'TZNAME:BST',
  'TZOFFSETFROM:+0000',
  'TZOFFSETTO:+0100',
  'DTSTART:19700329T010000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'END:VTIMEZONE'
]
*/

const asString = getZoneString('America/Los_Angeles');
console.log(asString);
/*
BEGIN:VTIMEZONE
TZID:America/Los_Angeles
BEGIN:STANDARD
TZNAME:PST
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
BEGIN:DAYLIGHT
TZNAME:PDT
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
END:VTIMEZONE
*/
```

> Tip: If you don’t need the opening `BEGIN:VTIMEZONE` and closing `END:VTIMEZONE` lines, set the second optional argument of either function to `false`.


[npm-url]: https://npmjs.org/package/icalzone
[npm-version-image]: https://img.shields.io/npm/v/icalzone.svg?style=flat

[travis-url]: https://travis-ci.org/Manc/icalzone
[travis-image]: https://img.shields.io/travis/Manc/icalzone/master.svg?style=flat

[min-size-image]: https://img.shields.io/bundlephobia/min/icalzone?style=flat

[license-url]: LICENSE
[license-image]: https://img.shields.io/badge/license-ISC-blue.svg?style=flat
