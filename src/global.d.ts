type ZoneRRule = {
	/** FREQ (default: `YEARLY`) */
	f?: string;
	/** BYMONTH */
	m: number;
	/** BYDAY */
	d: string;
};

type ZoneSubData = {
	/** TZNAME */
	n: string;
	/** TZOFFSETFROM */
	f: string;
	/** TZOFFSETTO (default: the value of `f`) */
	t?: string;
	/** RRULE */
	r?: ZoneRRule;
	/** DTSTART (default: `19700101T000000`, currently by far the most common value) */
	s?: string;
};

type ZoneData = {
	/** BEGIN:STANDARD...END:STANDARD */
	s: ZoneSubData,
	/** BEGIN:DAYLIGHT...END:DAYLIGHT */
	d?: ZoneSubData,
};
