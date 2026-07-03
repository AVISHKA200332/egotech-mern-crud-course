const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../server');

function request(server, requestPath) {
	return new Promise((resolve, reject) => {
		const { port } = server.address();
		const req = http.get({ hostname: '127.0.0.1', port, path: requestPath }, (res) => {
			let body = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				body += chunk;
			});
			res.on('end', () => {
				resolve({ statusCode: res.statusCode, body });
			});
		});

		req.on('error', reject);
	});
}

test('static server serves the module pages', async () => {
	const server = app.listen(0);

	try {
		const response = await request(server, '/module6.html');

		assert.equal(response.statusCode, 200);
		assert.match(response.body, /Module 6 — React Frontend/);
		assert.match(response.body, /React Frontend/);
	} finally {
		await new Promise((resolve) => server.close(resolve));
	}
});
