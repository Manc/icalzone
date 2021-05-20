import { defaultStart, zonesMap } from './zones'; // This module must be generated with `yarn run build-zones`.

function renderZoneSub(data: ZoneSubData): string[] {
	const { n, f, t, r, s } = data;
	return [
		`TZNAME:${n}`,
		`TZOFFSETFROM:${f}`,
		`TZOFFSETTO:${t || f}`,
		`DTSTART:${s || defaultStart}`,
		...(r ? [`RRULE:FREQ=${r.f || 'YEARLY'};BYMONTH=${r.m};BYDAY=${r.d}`] : []),
	];
}

/**
 * Tries to resolve a given time zone to iCalendar time zone component
 * (`VTIMEZONE`) as string array (usually for further processing).
 * @param zoneName Time zone name (e.g. `America/Los_Angeles`)
 * @param includeWrapper Set to `false` to avoid including lines for
 * `BEGIN:VTIMEZONE` and `END:VTIMEZONE`.
 * @returns Lines of the iCalendar time zone component (`VTIMEZONE`), each line
 * individually as an array of strings.
 */
export function getZoneLines(zoneName: string, includeWrapper = true): string[] | undefined {
	const zoneData = zonesMap.get(zoneName);
	if (zoneData) {
		const { s, d } = zoneData;
		const lines: string[] = [
			...(includeWrapper ? ['BEGIN:VTIMEZONE'] : []),
			`TZID:${zoneName}`,
			// `X-LIC-LOCATION:${zoneName}`, // Who uses this?
			'BEGIN:STANDARD',
			...renderZoneSub(s),
			'END:STANDARD',
			...(d ? [
				'BEGIN:DAYLIGHT',
				...renderZoneSub(d),
				'END:DAYLIGHT',
			] : []),
			...(includeWrapper ? ['END:VTIMEZONE'] : []),
		];
		return lines;
	}
}

/**
 * Tries to resolve a given time zone to iCalendar time zone component
 * (`VTIMEZONE`) as string.
 * @param zoneName Time zone name (e.g. `America/Los_Angeles`)
 * @param includeWrapper Set to `false` to avoid including lines for
 * `BEGIN:VTIMEZONE` and `END:VTIMEZONE`.
 * @returns The iCalendar time zone component (`VTIMEZONE`) as string
 * with `\r\n` line breaks.
 */
export function getZoneString(zoneName: string, includeWrapper = true): string | undefined {
	const lines = getZoneLines(zoneName, includeWrapper);
	return lines?.join('\r\n');
}
