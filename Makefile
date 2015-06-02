
#
# Binaries
#

export PATH := ./node_modules/.bin/:$(PATH)
BIN := ./node_modules/.bin

#
# Variables
#

PORT     = 8080
SOURCE   = ./source
BUILD    = ./build
SCRIPTS  = $(shell find $(SOURCE)/js -type f -name '*.js')
STYLES   = $(shell find $(SOURCE)/css -type f -name '*.scss')

BROWSERS = "last 2 versions"

#
# Tasks
#

all: assets styles scripts
	@true

develop: install
	@make -j3 budo budo-assets budo-server

budo:
	@$(BIN)/budo $(SOURCE)/js/index.js:assets/index.js \
		--dir $(BUILD) \
		--port $(PORT) \
		--transform babelify \
		--live | $(BIN)/garnish
budo-assets:
	@watch make assets styles --silent
budo-server:
	@$(BIN)/nodemon --quiet -- --harmony --harmony_arrow_functions server.js

server:
	@node --harmony --harmony_arrow_functions server.js

clean:
	@rm -rf build
clean-deps:
	@rm -rf node_modules

#
# Shorthands
#

install: node_modules
	@clear
assets: $(BUILD)/index.html
scripts: $(BUILD)/assets/index.js
styles: $(BUILD)/assets/styles.css

#
# Targets
#

node_modules: package.json
	@npm install

$(BUILD)/%: $(SOURCE)/%
	@mkdir -p $(@D)
	@cp $< $@

$(BUILD)/assets/index.js: $(SCRIPTS)
	@mkdir -p $(@D)
	@browserify $(SOURCE)/js/index.js -t babelify -o $@

$(BUILD)/assets/styles.css: $(STYLES)
	@mkdir -p $(@D)
	@sassc --sourcemap --load-path $(SOURCE)/css/ $(SOURCE)/css/styles.scss $@ \
		| $(BIN)/postcss --use autoprefixer --autoprefixer.browsers $(BROWSERS) $@ > $@

#
# Phony
#

.PHONY: develop clean clean-deps