export PATH := ./.node/bin:$(PATH)

BUNGLE 		?= node_modules/.bin/bungle
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs

SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
TARGETS		= bundles/patterns.js bundles/patterns.min.js

JSHINTEXCEPTIONS = src/lib/depends_parse.js \
		   src/lib/dependshandler.js \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js
CHECKSOURCES	= $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))


all:: $(TARGETS)

# Installation of dependencies:

bungledeps: package.json
	$(BUNGLE) update
	$(BUNGLE) install
	touch bungledeps


# Bundle related rules

bundles: check-modules $(TARGETS)

bundles/patterns.js: $(SOURCES) bungledeps package.json
	./build.js -n

bundles/patterns.min.js: $(SOURCES) bungledeps package.json
	./build.js


ifdef REF
TAGARG = -t $(REF)
endif
bundle:
	./build.js -n $(TAGARG)
	echo $?
	./build.js $(TAGARG)
	echo $?

bundles-all-tags:
	$(foreach tag,$(shell git tag|sed 1d),./build.js -t $(tag); ./build.js -n -t $(tag);)


# Phony targets to switch all HTML pages between using modules and bundles.

use-bundle:
	sed -i~ -e 's,<script data-main="\(.*\)src/autoinit" src="\1bungledeps/require.js",<script src="\1bundles/patterns.min.js",' index.html demo/*.html demo/*/*.html

use-modules:
	sed -i~ -e 's,<script src="\(.*\)bundles/patterns\.min\.js",<script data-main="\1src/autoinit" src="\1bungledeps/require.js",' index.html demo/*.html demo/*/*.html


# Build documentation bits

demo/calendar/fullcalendar.css: bungledeps/jquery.fullcalendar-*/fullcalendar/fullcalendar.css
	cp $< $@

demo/auto-suggest/select2.css: bungledeps/jquery.select2-*/select2.css
	cp $< $@

demo/auto-suggest/select2.png: bungledeps/jquery.select2-*/select2.png
	cp $< $@

demo/auto-suggest/select2-spinner.gif: bungledeps/jquery.select2-*/select2-spinner.gif
	cp $< $@


# Development related rules

src/lib/depends_parse.js: src/lib/depends_parse.pegjs
	$(PEGJS) $^
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@


check:: jshint
jshint:
	$(JSHINT) --config jshintrc $(CHECKSOURCES)

check:: check-modules
check-modules: bungledeps
	@echo Running checks on modules
	@echo =========================
	$(MAKE) $(MFLAGS) -C tests TestRunner-modules.html TestRunner-modules.js
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-modules.html

check:: check-bundles
check-bundles: $(TARGETS)
	@echo Running checks on bundles
	@echo =========================
	$(MAKE) $(MFLAGS) -C tests
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-bundle.html
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-bundle-min.html


# PhantomJS installation on NixOS

nixenv/bin/phantomjs:
	nix-build --out-link nixenv dev.nix

phantom-via-nix: nixenv/bin/phantomjs
	rm -f $(PHANTOMJS)
	ln -s $(shell realpath ./nixenv/bin/phantomjs) $(PHANTOMJS)

check-nix: phantom-via-nix check


clean:
	$(MAKE) $(MFLAGS) -C tests clean
	rm -f $(TARGETS)

.PHONY: all bundle bundles bundles-all-tags jshint check check-bundles check-modules check-nix clean doc phantom-via-nix use-modules use-bundle

