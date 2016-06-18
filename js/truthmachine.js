/**
 * The ThruthMachine "VM" constructor
 *
 * @constructor
 */
var TruthMachine = function(sentence) {
    this._tree = [];
    this._vars = [];
    this._sentence = null;

    if (sentence) {
        this.parse(sentence);
    }
};

/**
 * Parse source code, also resetting the variable table. This is called
 *
 * @param sentence
 */
TruthMachine.prototype.parse = function(sentence)
{
    // Invoke parser
    this._tree = sententialLogic.parse(sentence);

    // Build variables list
    this._vars = [];
    this._scan_vars(this._tree);

    // Save original sentence
    this._sentence = sentence;
};

/**
 * Recursive function to scan the opcode tree for variables
 *
 * @param tree
 * @private
 */
TruthMachine.prototype._scan_vars = function(tree)
{
    for(var i = 0; i < tree.length; i++) {
        if (Object.prototype.toString.call(tree[i]) === '[object Array]') {
            this._scan_vars(tree[i]);
        } else if(typeof tree[i] === 'string' && tree[i].length === 1) {
            if (this._vars.indexOf(tree[i]) === -1) {
                this._vars.push(tree[i]);
            }
        }
    }
};

/**
 * Generate a truth table for the parsed sentence
 *
 * @returns {Array}
 */
TruthMachine.prototype.generateTable = function()
{
    var bits = this._vars.length;
    if (bits == 0) return [];

    // First line of the table is headers: var columns and a result column
    var result = [ this._vars ];
    result[0].push(this._sentence);

    // For 2^n rows
    for (var perms = Math.pow(2, bits) - 1; perms >= 0; perms--) {
        // Set values for each var
        var values = {};
        var row = [];
        for (var i = 0; i < bits; i++) {
            var val = !! (perms & 1 << (bits - i - 1));
            values[this._vars[i]] = val;
            row.push(val);
        }

        // Compute result for row
        row.push(this.compute(values));
        result.push(row);
    }

    return result;
};

/**
 * Compute truth value for a set of variable values
 *
 * @returns {boolean}
 */
TruthMachine.prototype.compute = function(values)
{
    var node = this._tree;
    return this._run_tree(node, values);
};

TruthMachine.prototype._run_tree = function(node, values)
{
	var op    = node[0];
    var left  = node[1];
    var right = (node.length > 2 ? node[2] : null);

    if (Object.prototype.toString.call(left) === '[object Array]') {
        left = this._run_tree(left, values);
    } else if (typeof left === 'string') {
        left = values[left];
    }

    if (Object.prototype.toString.call(right) === '[object Array]') {
        right = this._run_tree(right, values);
    } else if (typeof right === 'string') {
        right = values[right];
    }

    /** Showtime **/
    switch (op) {
        case 'CON':
            return left && right;
        case 'DIS':
            return left || right;
        case 'IMP':
            return (! left) || (right && left);
        case 'EQV':
            return (left === right);
        case 'NEG':
            return ! left;
        case 'NAND':
            return !( left && right );
        case 'NOR':
            return !(left || right);
        case 'XOR':
            return ((left||right) && !(left&&right));
        default:
            throw "Unknown operator: '" + op + "'";
    }
};
