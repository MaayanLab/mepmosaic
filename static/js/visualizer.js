
// Parses csv string into array of array.
// Default data type is string.
// formatter is a function that is applied to to each string element.
// It can be used to convert strings to numbers: parseCsv(csv, Number)
function parseCsv(csv, formatter) {
	// separate csv stream into its components
	return csv.split("\n")
		.filter(function(line) {return line !== ""})  // exclude empty lines
		.map(function(line) {
			if (typeof formatter === "undefined") {
				// return array of strings
				return line.split(",");
			} else {
				// apply formatter to each element of line and return 
				return line.split(",").map(formatter);
			}
		});
}


// Flatten nested arrays
Array.prototype.flatten = function() {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
        if (Array.isArray(this[i])) {
            ret = ret.concat(this[i].flatten());
        } else {
            ret.push(this[i]);
        }
    }
    return ret;
};

Array.prototype.contains = function(v) {
    for (var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

// Extension of indexOf which returns an array with all matches
Array.prototype.indexOfAll = function(val) {
	var indexes = [];
	i = - 1;

	while ((i = this.indexOf(val, i + 1)) !== -1) {
		indexes.push(i);
	}
	return indexes;
}

// data is array of array
// First entry of data is assumed to be the field specifier
function getColumn(data, field) {
	// find index of the field
	var k = data[0].indexOf(field);

	// extract values to vector
	var values = data
		.slice(1)  // excludes first element of data
		.map(function(row) {return row[k]});  // extract values
	return(values);
}

// Look up channel related metadata from table.
// Returns javascript object in the format fields: value.
function getChanMetaData(meta_data, id) {

	// Get the column numbers that describe the pertrubation.
	var chan_pattern = /^chan_/;
	var chan_fields_bool = meta_data[0].map(function(name) {
		return chan_pattern.test(name);
	});

	var chan_cols = chan_fields_bool.indexOfAll(true);

	// Find entry
	var chan_row = getColumn(meta_data, "id").indexOf(id);

	// Format metadata into javascript object.
	var out = {};

	for (var i = 0; i < chan_cols.length; i++) {
		var name = meta_data[0][chan_cols[i]];
		var value = meta_data[chan_row + 1][chan_cols[i]];
		out[name] = value;
		// console.log(value)
	}

	return out;
}

// Selects, and returns, either field pert_iname or pert_desc.
function chanDescrIname(meta_obj) {
	if (meta_obj.chan_iname !== "NA") {
		return meta_obj.chan_iname;
	} else {
		return meta_obj.chan_desc;
	}
};

function boolIntersect(a,b) {
	if (a.length !== b.length) {
		console.log("WARNING: boolIntersect() called with arrays of different lenght.")
	}

	var bool = new Array(a.length);

	for (var i = 0; i < a.length; i++) {
		bool[i] = (a[i] && b[i]);
	}
	return(bool);
};


function updateSelection() {

	if (typeof lig_sel !== 'undefined') {
		lig_val = lig_sel.value;
	} else { lig_val = -1 };

	if (typeof me_sel !== 'undefined') {
		me_val = me_sel.value;
	} else { me_val = -1 };


	if (lig_val < 0) {
		var lig_bool = getColumn(MEP_data.meta_row, "lig")
			.map(function(symbol) {return true})
	} else {
		lig_name = lig_list[lig_val];
		var lig_bool = getColumn(MEP_data.meta_row, "lig")
			.map(function(symbol) {return lig_name.contains(symbol)})
	};

	if (me_val < 0) {
		var me_bool = getColumn(MEP_data.meta_row, "ecm")
			.map(function(symbol) {return true})
	} else {
		me_name = me_list[me_val];
		var me_bool = getColumn(MEP_data.meta_row, "ecm")
			.map(function(symbol) {return me_name.contains(symbol)})
	};

	var both_bool = boolIntersect(lig_bool,me_bool);

	sel_index = both_bool.indexOfAll(true);

	d3.selectAll("svg").selectAll(".rect-MEP")
		.style("fill", function(d) {
				if (sel_index.contains(d.feature_id)) {
					// in colors
					if (isNaN(d.num)) {
						return "white";
					} else {
						return(colorScale(d.num));
					}
				} else {
					// greyscale
					if (isNaN(d.num)) {
						return "white";
					} else {
						return(monoScale(d.num));
					}
				}
			}
		);
}

function percentile(arr, p) {
    if (arr.length === 0) return 0;
    if (typeof p !== 'number') throw new TypeError('p must be a number');
    var sortarr = arr.sort()
    if (p <= 0) return sortarr[0];
    if (p >= 1) return sortarr[arr.length - 1];

    var index = sortarr.length * p,
        lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

    if (upper >= arr.length) return sortarr[lower];
    return sortarr[lower] * (1 - weight) + arr[upper] * weight;
}

function scaleColor(input) {

	console.log(input.value)

	var epsilon = input.value

	// Global visualization options
	var newColorScale = d3.scale.linear()
	    .domain([-epsilon, 0, epsilon])
	    .clamp(true)
	    .range(["rgb(33,102,172)", "rgb(247,247,247)", "rgb(178,24,34)"])
	      // RdBu from Colorbrewer

	d3.selectAll("svg").selectAll(".rect-MEP")
		.style("fill", function(d) {
			// return(colorScale(d.num/epsilon));
			return(newColorScale(d.num));
		}
	);
}
// function seeScale(input) {
// 	console.log("Seeing color!")
// }
function resetColorScale(input) {
	d3.selectAll("svg").selectAll(".rect-MEP")
		.style("fill", function(d) {
			return(colorScale(d.num));
		}
	);
	range_colorScale.value = 2.5
}

// function resetColorScale(nodes, canvasRGB, canvasSize){
// 	var scale = 1.00;
// 	for (var i = 0; i < nodes.length; i++){
// 		nodes[i].colorizer(scale, canvasRGB);
// 	}
// 	weight_visualize(nodes, canvasSize);
// 	G_VAR.scale = scale; 

// 	document.getElementById('colorScale').innerHTML = G_VAR.avgWeight.toString().slice(0,4);
// 	document.getElementById('range_colorScale').value = G_VAR.avgWeight.toString().slice(0,4);
// }

// Constructs grid data with coordinates.
// frame_size specifies the maximum
// order can contain duplicates and specifies the layout.
function buildGridData(numbers, order, frame_size) {

	// Default order array
	if (typeof order === "undefined" || order.constructor !== Array) {
		order = d3.range(numbers.length);
		console.log("WARNING: buildGridData called without an order array.");
	}

	// Calculate dimensionality of layout. The maximum number of cells
	var dim = Math.ceil(Math.sqrt(numbers.length));

	// Calculate square size
	var square_size = frame_size / dim;

	// Pen (cursor) position
	var pen_xpos = 0.0;
	var pen_ypos = 0.0;

	// gene symbols
	var grid_data = [];
	for (var i = 0; i < order.length; i++) {

		// Check if new row should be initiated.
		if (i !== 0 && i % dim == 0) {
			// new row
			pen_xpos = 0.0;
			pen_ypos += square_size;
		} 

		// Construct data object
		dobj = {};
		dobj.x = pen_xpos;
		dobj.y = pen_ypos;
		dobj.size = square_size;
		dobj.num = numbers[order[i]];  // data value
		dobj.feature_id = order[i];  // for looking up metadata

		grid_data.push(dobj);

		// Advance cursor
		pen_xpos += square_size;
	}

	return(grid_data);
}


// Trim svg element to bounday box
function trimSvg(svg) {
	var box = svg.node().getBBox();
	svg.attr("width", box.width + box.x);
	svg.attr("height", box.height + box.y);
};


