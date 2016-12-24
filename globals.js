const mindandbody = ['span.hc_day', 'span.hc_starttime']
const providers = ['xtend'];
const selectors = [
	['span.headText', '#classSchedule-mainTable > tbody > tr:nth-child(2) > td:nth-child(1)', 'body > main > section > div > div:nth-child(1) > div.studio-widget-area.sidebar > div > div > ul > li:nth-child(1) > a']
];

const merchants = {
	turnstyle: {
		shop: 'Turnstyle',
		locations: ['South End', 'Back Bay', 'Kendall'],
		courses: [['Indoor Cycling', 'Bootcamp'], [''], ['Indoor Cycling', 'Bootcamp']],
		url: 'https://www.turnstylecycle.com/schedule-',
		variants: ['south-end', 'back-bay', 'kendall'],
		selectors: ['span.hc_day', ['tr:has(span.visit_type:contains("', '")) > td > span > span.hc_starttime']]
	},
	barresoul: {
		shop: 'Barre & Soul',
		locations: ['Brookline', 'Harvard'],
		courses: [[''], ['Vinyasa Yoga', 'Slow Flow Restorative Yoga', 'Yoga Sculpt', 'Friday Night Beats']],
		url: 'http://barresoul.com/',
		variants: ['brookline', 'harvard-square'],
		selectors: ['span.hc_day', ['tr:has(td.mbo_class:contains("', '")) > td > span > span.hc_starttime']]
	},
	heartbreak: {
		shop: 'Heartbreak Hill',
		locations: [],
		courses: [],
		url: 'http://www.heartbreakhillrunningcompany.com.usrfiles.com/html/babc73_c03d64a197db99ed8a7e031036c0d20b.html',
		variants: [],
		selectors: mindandbody
	},
	handlebar: {
		shop: 'Handlebar',
		locations: [],
		courses: [],
		url: 'http://handlebarcycling.liveeditaurora.com/Schedule',
		variants: [],
		selectors: ['#le_mb_list_schedule > div.mb_schedule > div > div.title_date', 'td.row_date']
	},
	yogaworks: {
		shop: 'YogaWorks',
		locations: ['Allston', 'Back Bay'],
		courses: [['Vinyasa Flow', 'Hip Hop Yoga', 'SculptWorks', 'Flow Express'], ['Vinyasa', 'Hip Hop Yoga']],
		url: ['http://www.yogaworks.com/location/', '/#find-a-class'],
		variants: ['commonwealth-avenue', 'back-bay'],
		selectors: ['span.hc_day', ['tr:has(td.mbo_class:contains("', '")) > td > span > span.hc_starttime']]
	},
	studio: {
		shop: 'Studio 52',
		locations: [],
		courses: ['Lunch Break', 'Yoga to Hip Hop', 'Vinyasa'],
		url: 'https://widgets.healcode.com/iframe/schedules/4a316356524/',
		variants: [],
		selectors: ['span.hc_day', ['tr:has(td.mbo_class:contains("', '")) > td > span > span.hc_starttime']]
	}
};

module.exports = merchants;