/*
	DashBench
	------------

	Dashbench is a JavaScript performance suite that benchmark different functions with
	different arguments, and organize the results in a table.

	Programmed by Nadav Tenenebaum
	
	This program is released under the MIT license
	
	----------------------------------------------------------------------------
	Copyright (C) 2011 by Nadav Tenenbaum

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

(function Dash_Bench_initialization() {
	// Private variables
	var benchQueue		= [],
		benchmarks		= [],
		results			= [],
		algorithms		= [];			// Stores benchmarking algorithms. Adds the ability
										//	to create deshbench plugins.
	
	// The profiling interface
	/**
	 * @name db
	 * @namespace Dashbench frontend. Used to interact with the dashbench benchmarking suite
	 * @version 0.1 beta release
	 * @author Nadav Tenenbaum
	 */
	var db = {
		/**
		 * @name db.theme
		 * @function
		 * @public
		 * @description Defines a theme to be benchmarked
		 *		@param {String} description A description of the theme to be benchmarked
		 *		@param {Array[]} [values="[[]]"] An array of parameters to be benchmarked
		 *		@param {Integer} times Time in milliseconds to perform each benchmark
		 *		@param {Callback} callback A callback funcntion which is used to nest inside
		 * 			the theme all the functions to be benchmarked
		 * @exemple
		 * db.theme('Adding vs. subtracting', [[''], [1] , ['1'], ['', 1, '1']], 1000, function() {
		 * 	db.bench('Adding', function() {
		 * 		for (var i = 0; i < 1000000; i++);
		 * 	});
		 * 	db.bench('subtracting', function() {
		 *		for (var i = 1000000; i > 0; i--);
		 * 	});
		 * });
		 */
		'theme': function db_theme(description, values, callback, algorithmHandler) {
			console.log(algorithmHandler);
			if(values == null || values == '')
				values = [[]];
			callback.__DB_id	= benchmarks.push({
												'values': 			values,
												'description': 		description,
												'algorithmHandler':  algorithmHandler
												}) - 1;
			results[callback.__DB_id] = [];
			callback();
		},
		/**
		 * @name db.bench
		 * @function
		 * @public
		 * @description Benchmark a specific function inside a theme wanted to be compared.
		 * 		This function should be only used inside {@link dp.theme}, for exemple refer
		 *		it's documentation.
		 * 		@param {String} description A description for the specific function, will be
		 * 			used on the rendered table.
		 *		@param {Callback} callback The function to be benchmraked
		 */
		'bench': function db_bench(description, callback) {
			callback.__DB_description	= description;
			callback.__DB_pid			= db_bench.caller.__DB_id;
			callback.__DB_id			= results[callback.__DB_pid].push({
																	'description': description,
																	'values': []
																	}) - 1;
			benchQueue.push(callback);
		},
		'use': function db_use(algorithmId, options) {
			return new algorithms[algorithmId](options);
		},
		'addAlgorithm': function db_addAlgorithm(symbol, algorithm) {
			db[symbol] = algorithms.push(algorithm) - 1;
		}
	}
	// The profiling engine
	// Private variables:
	var callbackIndex	= 0,
		valuesIndex		= 0;
	function runBenchQueue() {
		var bench		= benchmarks[benchQueue[callbackIndex].__DB_pid];
		if(valuesIndex >= bench.values.length) {
			++callbackIndex;
			valuesIndex = 0;
		}
		var callback		= benchQueue[callbackIndex];
		if(typeof callback == 'undefined')
			return;

		var bench				= benchmarks[callback.__DB_pid],
			counter				= 0, 
			callbackValues		= benchmarks[callback.__DB_pid].values[valuesIndex],
			algorithmHandler	= bench.algorithmHandler || db.use(0, {});
		
		algorithmHandler.onResult(function(result) {
			results[callback.__DB_pid][callback.__DB_id].values.push({
																'values': callbackValues.toString(),
																'time': result
																});
			printResults();
			valuesIndex++;
			runBenchQueue();
		});

		setTimeout(function() {algorithmHandler.benchmark(callback, callbackValues)}, 0);
	}

	function printResults() {
		var htmlOutput		= '',
			resultsLength	= results.length;

		for(var i=0; i < resultsLength; ++i) {
			htmlOutput += '<li>'+
							'<h3>'+benchmarks[i].description+'<\/h3>'+
							'<table>'+
							'<thead>'+
								'<tr>'+
								'<td>Function name<\/td>';
			// Prints all the values for the function
			for(var ii=0, benchValues = benchmarks[i].values.length; ii < benchValues; ++ii) {
				var valueString = benchmarks[i].values[ii].toString()
				if(valueString == '')
					valueString = 'No values';

				htmlOutput += '<td>'+valueString+'<\/td>';
			}

			htmlOutput += 		'<\/tr>'+
							'<\/thead>'+
							'<\/tbody>';

			// Prints the function time resaults
			var callbacks = results[i].length;
			for(var ii = 0; ii < callbacks; ++ii) {
				htmlOutput += '<tr>'+
								'<td>'+results[i][ii].description+'<\/td>';
				
				// Print all function values time results
				for(var iii = 0, valuesLength = results[i][ii].values.length;
					iii < valuesLength;
					++iii) {

					htmlOutput += '<td>'+results[i][ii].values[iii].time+'<\/td>';
				}
				htmlOutput += '<\/tr>';
			}

			htmlOutput += 	'<\/tbody>'+
							'<\/table>'+
						'<\/li>';
		}

		document.getElementById('dp-tests').innerHTML = htmlOutput;
	}

	window.addEventListener("load", function Dash_bench_onload() {
		document.getElementById('dp-userAgent').innerHTML = navigator.userAgent;
		runBenchQueue();
	}, false);

	// Expose dashbench
	window['db'] = db;
})()