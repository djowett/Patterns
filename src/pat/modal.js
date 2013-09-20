define([
    "jquery",
    "pat-parser",
    "pat-registry",
    "pat-utils",
    "pat-inject"
], function($, Parser, registry, utils, inject) {
    var parser = new Parser("modal");

    parser.add_argument("class");

    var modal = {
        name: "modal",
        jquery_plugin: true,
        // div's are turned into modals
        // links and forms inject modals
        trigger: "div.pat-modal, a.pat-modal, form.pat-modal",
        init: function($el, opts) {
            if ($el.length > 1) {
                // We enforce a one-to-one mapping between modal objects and
                // DOM elements, so here we recurse and instantiate a new modal
                // for each $el
                $el.each(function() {
                    modal.init($(this));
                });
            } else if ($el.length === 1) {
                var cfg = parser.parse($el, opts);
                if ($el.is("div"))
                    modal._init_div1($el, cfg);
                else
                    modal._init_inject1($el, cfg);
            }
        },

        _init_inject1: function($el, cfg) {
            var opts = {
                target: "#pat-modal",
                "class": "pat-modal" + (cfg["class"] ? " " + cfg["class"] : "")
            };
            // if $el is already inside a modal, do not detach #pat-modal,
            // because this would unnecessarily close the modal itself
            if (!$el.closest("#pat-modal")) {
                $("#pat-modal").detach();
            }
            inject.init($el, opts);
        },

        _init_div1: function($el) {
            var $header = $("<div class='header' />"),
                activeElement = document.activeElement;

            $("<button type='button' class='close-panel'>Close</button>").appendTo($header);

            // We cannot handle text nodes here
            $el.children(":last, :not(:first)")
                .wrapAll("<div class='panel-content' />");
            $(".panel-content", $el).before($header);
            $el.children(":first:not(.header)").prependTo($header);

            // Restore focus in case the active element was a child of $el and
            // the focus was lost during the wrapping.
            activeElement.focus();
            modal._init_handlers($el);
            modal.setPosition($el);
        },

        _init_handlers: function($el) {
            // event handlers remove modal - first arg to bind is ``this``
            $(document).on("click.pat-modal", ".close-panel", modal.destroy.bind($el, $el));
            // remove on ESC
            $(document).on("keyup.pat-modal", modal.destroy.bind($el, $el));

            $(window).on("resize.pat-modal-position", 
                utils.debounce(modal.setPosition.bind(modal, $el), 400));
            $(document).on("pat-inject-content-loaded.pat-modal-position", "#pat-modal",
                utils.debounce(modal.setPosition.bind(modal, $el), 400));
            $(document).on("patterns-injected.pat-modal-position", "#pat-modal,div.pat-modal",
                utils.debounce(modal.setPosition.bind(modal, $el), 400));
        },

        setPosition: function($el) {
            var $tallest_child;
            var true_height = $el.outerHeight(); // the height of the highest element (after the function runs)
            $("*", $el).each(function () {
                if ($(this).outerHeight(true) > true_height) {
                    $tallest_child = $(this);
                    true_height = $tallest_child.outerHeight(true);
                }
            });
            if ($tallest_child) {
                // There is a child that's taller than $el. We need to make the
                // height the height of this child plus it's offset from the top
                // of $el.
                true_height += $tallest_child.offset().top - $el.offset().top;
            }
            // Maximum height is visible browser area minus modal padding
            var maxHeight = $(window).innerHeight() - ($el.outerHeight(true) - $el.outerHeight());
            if (maxHeight - true_height < 0) {
                $el.addClass("max-height").css("height", maxHeight);
            } else if (true_height !== $el.height()) {
                $el.removeClass("max-height").css("height", true_height);
            } else {
                return;
            }
            $el.css("top", ($(window).innerHeight() - $el.outerHeight(true)) / 2);

            // XXX: This is a hack. When you have a modal inside a
            // modal.max-height, the CSS of the outermost modal affects the
            // innermost .panel-body. By redrawing here, it's fixed.
            //
            // I think ideally the CSS needs to be fixed here, but I need to
            // discuss with Cornelis first.
            if ($el.parent().closest('.pat-modal').length > 0) {
                utils.redraw($el.find('.panel-body'));
            }
        },

        destroy: function($el, ev) {
            if (ev && ev.type === "keyup" && ev.which !== 27)
                return;
            $(document).off(".pat-modal");
            $el.remove();
        }
    };

    registry.register(modal);
    return modal;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
