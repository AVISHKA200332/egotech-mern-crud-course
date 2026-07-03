const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.join(__dirname, '..');

const pages = [
	{ file: 'module6.html', title: 'Module 6 — React Frontend | EgoTechWorld', heading: 'React Frontend' },
	{ file: 'module7.html', title: 'Module 7 — Connecting Frontend & Backend | EgoTechWorld', heading: 'Connecting Frontend &amp; Backend' },
	{ file: 'module8.html', title: 'Module 8 — CRUD Operations | EgoTechWorld', heading: 'CRUD Operations' },
	{ file: 'module9.html', title: 'Module 9 — Deployment | EgoTechWorld', heading: 'Deployment' },
	{ file: 'module10.html', title: 'Module 10 — Final Project & Best Practices | EgoTechWorld', heading: 'Final Project &amp; Best Practices' },
];

test('module lesson pages keep the expected titles and navigation', () => {
	for (const page of pages) {
		const filePath = path.join(rootDir, page.file);
		const contents = fs.readFileSync(filePath, 'utf8');

		assert.ok(contents.includes(`<title>${page.title}</title>`), `${page.file} should have the expected title`);
		assert.ok(contents.includes(page.heading), `${page.file} should include the expected module heading`);
		assert.ok(contents.includes('module-nav-bar'), `${page.file} should include the module navigation footer`);
	}
});
