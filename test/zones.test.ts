import { defaultStart, zonesMap } from '../src/zones';


describe('defaultStart', () => {
	it('is a string with the expected date-time format', () => {
		expect(defaultStart).toMatch(/^(19|20)\d{2}[01]\d[0123]\dT[012]\d{5}$/); // Example: "19700101T000000"
	});
});

describe('zonesMap', () => {
	it('is an instance of Map', () => {
		expect(zonesMap).toBeInstanceOf(Map);
	});

	// Note: This value may, of course, change slightly when the source
	// is updated of filters during conversion are applied.
	it('has 461 entries', () => {
		expect(zonesMap.size).toBe(461);
	});

	it('has `s` (standard) a object in every entry', () => {
		const entryWithoutS = [...zonesMap.values()].findIndex(zone =>
			!zone.s || typeof zone.s !== 'object'
		);
		expect(entryWithoutS).toBe(-1);
	});

	it('has `d` (daylight) objects in many entries', () => {
		const entriesWithD = [...zonesMap.values()].filter(zone =>
			!!zone.d && typeof zone.d === 'object'
		);
		expect(entriesWithD.length).toBeGreaterThan(100);
	});

	it('does not include the start date in a zone known to use the default value', () => {
		const zoneData = zonesMap.get('Etc/GMT-1');
		expect(zoneData).toBeDefined();
		expect(zoneData!.s.s).toBeUndefined();
	});

	it('does include the start date in a zone known not to use the default value', () => {
		const zoneData = zonesMap.get('Atlantic/Azores');
		expect(zoneData).toBeDefined();
		expect(zoneData!.s.s).toBeDefined();
		expect(zoneData!.s.s).not.toBe(defaultStart);
	});

	it('has expected time values from a selection of zones across all main areas', () => {
		expect(zonesMap.get('Africa/Johannesburg')?.s.f).toBe('+0200');
		expect(zonesMap.get('America/Los_Angeles')?.s.f).toBe('-0700');
		expect(zonesMap.get('Antarctica/Casey')?.s.f).toBe('+0800'); // TODO: Check the `n` value of that one!
		expect(zonesMap.get('Asia/Bangkok')?.s.f).toBe('+0700'); // TODO: Check the `n` value of that one!
		expect(zonesMap.get('Atlantic/Faroe')?.s.f).toBe('+0100');
		expect(zonesMap.get('Australia/Melbourne')?.s.f).toBe('+1100');
		expect(zonesMap.get('Etc/GMT-0')?.s.f).toBe('+0000');
		expect(zonesMap.get('Etc/GMT-12')?.s.f).toBe('-1200');
		expect(zonesMap.get('Etc/GMT+0')?.s.f).toBe('+0000');
		expect(zonesMap.get('Etc/GMT+14')?.s.f).toBe('+1400');
		expect(zonesMap.get('Etc/UCT')?.s.f).toBe('+0000');
		expect(zonesMap.get('Etc/UTC')?.s.f).toBe('+0000');
		expect(zonesMap.get('Etc/Universal')?.s.f).toBe('+0000');
		expect(zonesMap.get('Etc/Zulu')?.s.f).toBe('+0000');
		expect(zonesMap.get('Europe/Berlin')?.s.f).toBe('+0200');
		expect(zonesMap.get('Indian/Maldives')?.s.f).toBe('+0500');
		expect(zonesMap.get('Pacific/Fiji')?.s.f).toBe('+1300');
	});
});
