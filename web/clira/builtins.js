/*
 * $Id$
 *  -*-  indent-tabs-mode:nil -*-
 * Copyright 2013, Juniper Network Inc.
 * All rights reserved.
 * This SOFTWARE is licensed under the LICENSE provided in the
 * ../Copyright file. By downloading, installing, copying, or otherwise
 * using the SOFTWARE, you agree to be bound by the terms of that
 * LICENSE.
 */

jQuery(function ($) {
    $.clira.loadBuiltins = function () {
        $.clira.addCommand([
            {
                command: "show commands",
                help: "Display a list of all available commands currently "
                    + "loaded in CLIRA",
                execute: function ($output, cmd, parse, poss) {
                    var html = "\
<div class='show-command-top'>\
    {{#each commands}}\
        <div class='show-command'>\
            <div class='show-command-name'>{{command}}</div>\
            <div class='command-help'>{{help}}</div>\
        </div>\
    {{/each}}\
</div>\
";
                    var template = Handlebars.compile(html);
                    var content = template({ commands: $.clira.commands});
                    $output.html(content);
                }
            },
            {
                command: "reload commands",
                help: "Reload CLIRA command set",
                execute: function ($output, cmd, parse, poss) {
                    $output.text("Reloading commands");
                    $.clira.loadCommandFiles();
                }
            },
            {
                command: "test something",
                help: "mumble mumble",
                execute: function ($output, cmd, parse, poss) {
                    $output.text("Testing....");
                    var filename = "/clira/test.js";

                    $.ajax({
                        url: filename,
                        dataType: "text",
                        success: function (data, status, jqxhr) {
                            $.dbgpr("test: success:" + status);
                            try {
                                var res = eval(data);
                                if ($.isArray(res)) {
                                    $.clira.addCommand(res);
                                }
                            } catch (e) {
                                $.dbgpr("error: " + e.toString() + " at " +
                                        filename + ":" + e.lineNumber);
                                if (console && console.exception) {
                                    console.log("error: " + e.toString()
                                                + " at " +
                                                filename + ":" + e.lineNumber);
                                    console.exception(e);
                                }
                            }
                        },
                        error: function (jqxhr, status, message) {
                            $.dbgpr("test: error: " + status + "::" + message);
                        }
                    });
                }
            }
        ]);
    }
});
