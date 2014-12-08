MOCHA = ./node_modules/mocha/bin/_mocha
TEST = $(shell ls -S `find test -type f -name "*.test.js" -print`)

install:
	@npm install

test: install
	@$(MOCHA) -t 60000 -r ./index.js -R spec --covinject true $(TEST)

test-cov: install
	@$(MOCHA) -t 60000 -r ./index.js -R spec   --overrideIgnore=true --covout=html --covinject=true $(TEST)

.PHONY: instal test
