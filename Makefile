test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec

sass:
	sass --watch ./scss/style.scss:./public/stylesheets/style.css

templates:
	handlebars ./templates-html/* -f ./public/javascripts/templates.js

server:
	node app.js

.PHONY: test
