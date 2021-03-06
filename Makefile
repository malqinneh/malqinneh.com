
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

DOMAIN   = $(shell cat CNAME)
REPO     = malqinneh/malqinneh.com
BRANCH   = $(shell git rev-parse --abbrev-ref HEAD)
HOST     = $(shell node -pe "require('./config').server.host")

#
# Tasks
#

build: assets styles scripts
	@true

build-server: $(BUILD)/server.js $(BUILD)/package.json $(BUILD)/config.json

watch: install
	@clear
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
	@$(BIN)/nodemon --quiet -- --harmony server.js

deploy:
	@echo "Deploying branch \033[0;33m$(BRANCH)\033[0m to Github pages..."
	@make clean && make build
	@(cd $(BUILD) && \
		git init -q .  && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "\033[0;90m" && \
		git push "git@github.com:$(REPO).git" master:gh-pages --force && \
		echo "\033[0m")
	@make clean
	@echo "Deployed to \033[0;32mhttp://$(DOMAIN)\033[0m"

deploy-server:
	@echo "Deploying server from branch \033[0;33m$(BRANCH)\033[0m to \033[0;32m$(HOST)\033[0m..."
	@make clean && make build-server
		@(cd $(BUILD) && \
		git init -q .  && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "\033[0;90m" && \
		git remote add dokku dokku@signal.to:malqinneh && \
		git push dokku master --force && \
		echo "\033[0m")
	@make clean
	@echo "Deployed to \033[0;32m$(HOST)\033[0m"

clean:
	@rm -rf build
clean-deps:
	@rm -rf node_modules

#
# Shorthands
#

install: node_modules
assets: $(BUILD)/CNAME $(BUILD)/index.html $(BUILD)/favicon.png $(BUILD)/assets/fonts/
scripts: $(BUILD)/assets/index.js
styles: $(BUILD)/assets/styles.css

#
# Targets
#

node_modules: package.json
	@npm install

$(BUILD)/%: $(SOURCE)/%
	@mkdir -p $(@D)
	@cp -r $< $@

$(BUILD)/assets/%: $(SOURCE)/%
	@mkdir -p $(@D)
	@cp -r $< $@

$(BUILD)/%: %
	@mkdir -p $(@D)
	@cp -r $< $@

$(BUILD)/server.js: server.js
	@mkdir -p $(@D)
	@babel $< > $@

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
