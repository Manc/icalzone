import { getZoneLines, getZoneString } from '../src';
import { defaultStart } from '../src/zones';


describe('getZoneLines()', () => {
	it('renders zone "Europe/Budapest" with wrapping by default', () => {
		const result = getZoneLines('Europe/Budapest');
		expect(result).toBeDefined();
		expect(result![0]).toBe('BEGIN:VTIMEZONE');
		expect(result![result!.length - 1]).toBe('END:VTIMEZONE');
		expect(result).toMatchSnapshot();
	});

	it('renders zone "Europe/Budapest" without wrapping', () => {
		const result = getZoneLines('Europe/Budapest', false);
		expect(result).toBeDefined();
		expect(result!).not.toContain('BEGIN:VTIMEZONE');
		expect(result!).not.toContain('END:VTIMEZONE');
		expect(result).toMatchSnapshot();
	});

	// Note: This test should be adapted if the value defaultStart changes.
	it('renders zone known to use the current default start time', () => {
		const result = getZoneLines('Etc/GMT-1', false);
		expect(result).toBeDefined();
		expect(result!).toContain(`DTSTART:${defaultStart}`);
	});

	// Note: This test should be adapted if the value defaultStart changes.
	it('renders zone known not to use the current default start time', () => {
		const result = getZoneLines('Australia/Broken_Hill', false);
		expect(result).toBeDefined();
		expect(result!).not.toContain(`DTSTART:${defaultStart}`);
		expect(result!).toContain(`DTSTART:19700405T030000`);
		expect(result!).toContain(`DTSTART:19701004T020000`);
	});

	it('returns undefined if zone does not exist', () => {
		const result = getZoneLines('random string');
		expect(result).toBeUndefined();
	});
});

describe('getZoneString()', () => {
	it('renders zone "Europe/Budapest" with wrapping by default', () => {
		const result = getZoneString('Europe/Budapest');
		expect(result).toBeDefined();
		expect(result!.startsWith('BEGIN:VTIMEZONE')).toBeTruthy();
		expect(result!.endsWith('END:VTIMEZONE')).toBeTruthy();
		expect(result!.indexOf('\r\n')).toBe(15);
		expect(result).toMatchSnapshot();
	});

	it('renders zone "Europe/Budapest" without wrapping', () => {
		const result = getZoneString('Europe/Budapest', false);
		expect(result).toBeDefined();
		expect(result!).not.toContain('BEGIN:VTIMEZONE');
		expect(result!).not.toContain('END:VTIMEZONE');
		expect(result).toMatchSnapshot();
	});

	it('returns undefined if zone does not exist', () => {
		const result = getZoneString('random string');
		expect(result).toBeUndefined();
	});
});
