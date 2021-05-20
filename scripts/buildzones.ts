/// <reference path="../src/global.d.ts" />

import fs from 'fs';
import path from 'path';
import zoneMap from '@touch4it/ical-timezones/zones';


const defaultStart = '19700101T000000';

function loadZoneIcs(filename: string) {
	return fs.readFileSync(
		path.join(__dirname, '../node_modules/@touch4it/ical-timezones/zones', filename),
		'utf8'
	);
}

function parseRRuleStr(str: string): ZoneRRule {
	// const match = str.match(/FREQ=([A-Z]+);BYMONTH=([0-9]+);BYDAY=(-?[0-9A-Z]+)/);
	const match = str.match(/FREQ=YEARLY;BYMONTH=([0-9]+);BYDAY=(-?[0-9A-Z]+)/);
	if (!match) {
		throw new Error('Unexpected RRULE string. Manually check and adapt code accordingly.');
	}
	const [, monthStr, dayStr] = match;
	return {
		// f: 'YEARLY', // "YEARLY" is the implicitly assumed default value
		m: parseInt(monthStr, 10),
		d: dayStr,
	};
}

function extractVTZData(icsContent: string): ZoneData {
	const lines = icsContent.substring(
		icsContent.indexOf('BEGIN:VTIMEZONE') + 16,
		icsContent.indexOf('END:VTIMEZONE') - 1
	)
		.split('\n')
		.filter(l =>
			!!l.match(/^(BEGIN:|END:|TZOFFSET|TZNAME:|DTSTART:|RRULE:)/)
		)
		.map(l => l.trimEnd());

		
	let standard: Partial<ZoneSubData> = {};
	let daylight: Partial<ZoneSubData> = {};
	let currentObject: Partial<ZoneSubData> | null = null;
	lines.forEach(line => {
		const [key, value] = line.split(':');
		if (key === 'BEGIN') {
			if (value === 'STANDARD' || value === 'DAYLIGHT') {
				// section = value;
				if (value === 'STANDARD') {
					currentObject = standard;
				} else {
					currentObject = daylight;
				}
			}
			return;
		}
		if (key === 'END') {
			currentObject = null;
			return;
		}
		if (currentObject) {
			switch (key) {
				case 'TZNAME': {
					currentObject.n = value;
					return;
				}
				case 'TZOFFSETFROM': {
					currentObject.f = value;
					return;
				}
				case 'TZOFFSETTO': {
					currentObject.t = value;
					return;
				}
				case 'RRULE': {
					currentObject.r = parseRRuleStr(value);
					return;
				}
				case 'DTSTART': {
					currentObject.s = value;
					return;
				}
			}
		}
	});

	// Delete redundant `t` properties (TZOFFSETTO).
	if (standard.t && standard.t === standard.f) {
		delete standard.t;
	}
	if (daylight.t && daylight.t === daylight.f) {
		delete daylight.t;
	}

	const data: ZoneData = { s: standard as ZoneSubData };
	if (Object.keys(daylight).length) {
		data.d = daylight as ZoneSubData;
	}

	return data;
}

const zoneDataMap = new Map<string, ZoneData>();
const statsStart = new Map<string, number>();

const filteredKeys = Object.entries(zoneMap).filter(([key, value]) =>
	!!key.match(/^[A-Za-z]+\/.+/)
	&& !value.match(/\s/)
	&& value?.endsWith('.ics')
).map(([, value]) => value);

filteredKeys
	.forEach(zoneFileName => {
		const tzData = extractVTZData(loadZoneIcs(zoneFileName));

		// Collect data for analysis and remove start date if unnecessary.
		const startStandard = tzData.s.s;
		if (!startStandard) {
			throw new Error('Time zone data has no DTSTART value');
		}
		const count = statsStart.get(startStandard) || 0;
		statsStart.set(startStandard, count + 1);
		
		if (startStandard === defaultStart) {
			// Delete attribute from object to safe bytes
			delete tzData.s.s;
		}

		// Do the same for the "daytime" part if it exists.
		if (tzData.d) {
			const startDaylight = tzData.d.s;
			if (!startDaylight) {
				throw new Error('Time zone data has no DTSTART value');
			}
			const count = statsStart.get(startDaylight) || 0;
			statsStart.set(startDaylight, count + 1);

			if (startDaylight === defaultStart) {
				// Delete attribute from object to safe bytes
				delete tzData.d.s;
			}
		}

		// Add entry to the map.
		zoneDataMap.set(
			zoneFileName.replace('.ics', ''),
			tzData
		);
	});

// Analyze the collected DTSTART values and check whether the value
// defined in `defaultStart` really is the most common value.
const statsStartSorted = [...statsStart].sort(([, countA], [, countB]) => countB - countA);
const topStart = statsStartSorted[0][0];
if (topStart !== defaultStart) {
	throw new Error('The value of defaultStart does not match the most commonly used DTSTART value.');
}

// Generate and write a TypeScript file.
fs.writeFileSync(
	path.join(__dirname, '../src/zones.ts'),
	[
		`export const defaultStart = "${defaultStart}";`,
		`export const zonesMap = new Map<string, ZoneData>(${JSON.stringify([...zoneDataMap], null, '\t')});`
	].join('\n')
);
