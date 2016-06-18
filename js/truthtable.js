/**
 * Created by shahar on 10/27/13.
 */

/**
 * Map Operator codes to logic symbols
 */

var operatorMap = {
    "CON": "•",
    "DIS": "∨",
    "IMP": "⊃",
    "EQV": "≡",
    "NEG": "~"
};

/**
 * Map keyboard characters to logic symbols
 */
var symbolMap = {
    ".": operatorMap.CON,
    "*": operatorMap.CON,
    "&": operatorMap.CON,
    "v": operatorMap.DIS,
    "V": operatorMap.DIS,
    "+": operatorMap.DIS,
    "|": operatorMap.DIS,
    ">": operatorMap.IMP,
    "=": operatorMap.EQV,
    "!": operatorMap.NEG,
    "~": operatorMap.NEG
};

$(document).ready(function()
{
    $("#main-go").click(function ()
    {
        $("#results").text('');
        var t = $("#main-input").val();
        try {
            var vm = new TruthMachine(t);
        } catch (ex) {
            $("#results").html('<div class="error-pre">Syntax Error: ' + ex + '</div>');
            return;
        }

        var table = vm.generateTable();
        if (table.length < 2) {
            $("#results").html('<div class="error-pre">Truth Table contains too few rows</div>');
        } else {
            renderTruthTable($("#results"), table);
        }
    });

    $("#main-input").keypress(function(ev)
    {
        var k = String.fromCharCode(ev.charCode);
        if (symbolMap.hasOwnProperty(k) && ! ev.metaKey) {
            $(this).insertAtCaret(symbolMap[k]);
        } else {
            return true;
        }
        return false;
    });

    // Scroll to panels when they are opened
    $(".panel-collapse").on('shown.bs.collapse', function() {
        $("html, body").animate({ scrollTop: $(this).parent().offset().top }, 1000);
    });
});

/**
 * Modified from http://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery/946556#946556
 */
$.fn.extend({
    insertAtCaret: function(myValue) {
        var el = this[0];
        if (el.selectionStart || el.selectionStart == '0') {
            var startPos = el.selectionStart;
            var endPos = el.selectionEnd;
            var scrollTop = el.scrollTop;
            el.value = el.value.substring(0, startPos) + myValue + el.value.substring(endPos, el.value.length);
            el.focus();
            el.selectionStart = startPos + myValue.length;
            el.selectionEnd = startPos + myValue.length;
            el.scrollTop = scrollTop;
        } else {
            el.value += myValue;
            el.focus();
        }
    }
});

/**
 * Render results to an HTML table
 *
 * @param container
 * @param table
 */
function renderTruthTable(container, table)
{
    var tbl = $('<table id="results-table" class="truth-table"></table>');
    var cols = table[0].length;
    // Render header row
    var hdr = tbl.append($('<thead><tr></tr></thead>')).children().first();
    var header = table[0];
    for (var i = 0; i < cols; i++) {
        var th = $('<th></th>').text(table[0][i]);
        hdr.append(th);
    }

    // Render result rows
    var tbody = tbl.append('<tbody></tbody>');
    for (var i = 1; i < table.length; i++) {
        var tr = $('<tr></tr>');
        for (var j = 0; j < cols; j++) {
            var td = $('<td></td>').text(table[i][j] ? 'TRUE' : 'FALSE');
            td.addClass(table[i][j] ? 'state-true' : 'state-false')
            tr.append(td);
        }
        tr.addClass(table[i][cols - 1] ? 'state-true' : 'state-false');
        tbody.append(tr);
    }

    container.html(tbl);
};
