MOCHA = ./node_modules/.bin/mocha

init: install test

install:
	@npm install

test: install
	@$(MOCHA) -r jscoverage ./test
	
.PHONY: instal test
