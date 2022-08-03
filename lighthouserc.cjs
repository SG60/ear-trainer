module.exports = {
	ci: {
		collect: {
			url: ['http://localhost:4173'],
			startServerCommand: 'npm run preview',
			numberOfRuns: 1
		},
		upload: {
			target: 'temporary-public-storage'
		},
		assert: {
			preset: 'lighthouse:no-pwa',
			assertions: {
				'csp-xss': 'off',
				'uses-text-compression': 'off',
				// 'unused-css-rules': 'off'
				// 'unused-javascript': 'off'
				// 'uses-passive-event-listeners': 'off'
			}
		}
	}
};
