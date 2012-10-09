describe("depends-pattern", function() {
    var pattern;

    requireDependencies(["patterns/depends"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("verify", function() {
        it("Reference to unknown input", function() {
            var $slave = $("#lab"),
                action = {action: "show",
                          type: "and",
                          on: ["unknown"]};
            expect(pattern.verify($slave, action)).toBe(false);
        });

        describe("Comparison types", function() {
            describe("on", function() {
                it("Unchecked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "on"]]};
                    $lab.append("<input type='checkbox' name='toggle'/>");
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Checked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "on"]]};
                    $lab.append("<input type='checkbox' name='toggle' checked='checked'/>");
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Empty text input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "on"]]};
                    $lab.append("<input type='text' name='title'/>"); 
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Filled text input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "on"]]};
                    $lab.append("<input type='text' name='title' value='Pink unicorns'/>"); 
                    expect(pattern.verify($lab, action)).toBe(true);
                });
            });

            describe("off", function() {
                it("Unchecked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "off"]]};
                    $lab.append("<input type='checkbox' name='toggle'/>");
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Checked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "off"]]};
                    $lab.append("<input type='checkbox' name='toggle' checked='checked'/>");
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Empty text input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "off"]]};
                    $lab.append("<input type='text' name='title'/>"); 
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Filled text input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "off"]]};
                    $lab.append("<input type='text' name='title' value='Pink unicorns'/>"); 
                    expect(pattern.verify($lab, action)).toBe(false);
                });
            });

            describe("equals", function() {
                it("Unchecked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "equals", 'yes']]};
                    $lab.append("<input type='checkbox' name='toggle' value='yes'/>");
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Checked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "equals", "yes"]]};
                    $lab.append("<input type='checkbox' name='toggle' value='yes' checked='checked'/>");
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Checked checkbox with different value", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "equals", "yes"]]};
                    $lab.append("<input type='checkbox' name='toggle' value='no' checked='checked'/>");
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Empty text input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "equals", "yes"]]};
                    $lab.append("<input type='text' name='title'/>"); 
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Filled text input with different input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "equals", "yes"]]};
                    $lab.append("<input type='text' name='title' value='Pink unicorns'/>"); 
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Filled text input with correct input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "equals", "yes"]]};
                    $lab.append("<input type='text' name='title' value='yes'/>"); 
                    expect(pattern.verify($lab, action)).toBe(true);
                });
            });

            describe("notEquals", function() {
                it("Unchecked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "notEquals", 'yes']]};
                    $lab.append("<input type='checkbox' name='toggle' value='yes'/>");
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Checked checkbox", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "notEquals", "yes"]]};
                    $lab.append("<input type='checkbox' name='toggle' value='yes' checked='checked'/>");
                    expect(pattern.verify($lab, action)).toBe(false);
                });

                it("Checked checkbox with different value", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["toggle", "notEquals", "yes"]]};
                    $lab.append("<input type='checkbox' name='toggle' value='no' checked='checked'/>");
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Empty text input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "notEquals", "yes"]]};
                    $lab.append("<input type='text' name='title'/>"); 
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Filled text input with different input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "notEquals", "yes"]]};
                    $lab.append("<input type='text' name='title' value='Pink unicorns'/>"); 
                    expect(pattern.verify($lab, action)).toBe(true);
                });

                it("Filled text input with correct input", function() {
                    var $lab = $("#lab"),
                        action = {action: "show",
                                  type: "and",
                                  on: [["title", "notEquals", "yes"]]};
                    $lab.append("<input type='text' name='title' value='yes'/>"); 
                    expect(pattern.verify($lab, action)).toBe(false);
                });
            });
        });

        describe("Check types", function() {
            it("OR", function() {
                var $lab = $("#lab"),
                    action = {action: "show",
                              type: "or",
                              on: [["one", "on"], ["two", "on"]]};
                $lab
                    .append("<input type='text' name='one'/>")
                    .append("<input type='text' name='two' value='yes'/>");
                expect(pattern.verify($lab, action)).toBe(true);
            });

            it("AND", function() {
                var $lab = $("#lab"),
                    action = {action: "show",
                              type: "and",
                              on: [["one", "on"], ["two", "on"]]};
                $lab
                    .append("<input type='text' name='one'/>")
                    .append("<input type='text' name='two' value='yes'/>");
                expect(pattern.verify($lab, action)).toBe(false);
                $("input[name=one]").val("yes");
                expect(pattern.verify($lab, action)).toBe(true);
            });
        });
    });

    describe("getMasters", function() {
        it("Unknown master", function() {
            var $lab = $("#lab"),
                action = {on: [["master"]]};
            expect(pattern.getMasters($lab, action).length).toBe(0);
        });

        it("Single master", function() {
            var $lab = $("#lab"),
                action = {on: [["master"]]};
            $lab.append("<input type='text' name='master'/>");
            var $masters = pattern.getMasters($lab, action);
            expect($masters.length).toBe(1);
            expect($masters[0].tagName).toBe("INPUT");
            expect($masters[0].name).toBe("master");
        });

        it("Multiple masters", function() {
            var $lab = $("#lab"),
                action = {on: [["master"]]};
            $lab
                .append("<input type='checkbox' name='master' value='one'/>") 
                .append("<input type='checkbox' name='master' value='two'/>");
            var $masters = pattern.getMasters($lab, action);
            expect($masters.length).toBe(2);
            expect($masters[0].value).toBe("one");
            expect($masters[1].value).toBe("two");
        });

        it("Limit to form", function() {
            var action = {on: [["master"]]};
            $("#lab")
                .append("<form><input type='checkbox' name='master' value='one'/><span id='slave'/></form>") 
                .append("<input type='checkbox' name='master' value='two'/>");
            var $masters = pattern.getMasters($("#slave"), action);
            expect($masters.length).toBe(1);
            expect($masters[0].value).toBe("one");
        });
    });

    describe("parse", function() {
        it("Default action ", function() {
            expect(pattern.parse("dependsOn-master")).toEqual(
                {action: "show", type: "and", on: [["master"]]});
        });

        it("Equality", function() {
            expect(pattern.parse("dependsOn-master-equals-nero")).toEqual(
                {action: "show", type: "and", on: [["master", "equals", "nero"]]});
        });

        it("Specify action", function() {
            expect(pattern.parse("dependsAction-visible")).toEqual(
                {action: "visible", type: "and", on: []});
        });

        it("Specify type", function() {
            expect(pattern.parse("dependsType-or")).toEqual(
                {action: "show", type: "or", on: []});
        });

        it("Multiple actions", function() {
            expect(pattern.parse("dependsOn-master dependsOn-caesar")).toEqual(
                {action: "show", type: "and", on: [["master"], ["caesar"]]});
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
