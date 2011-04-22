/*
	DashBench Time Iterator plugin
	------------

	Traditional Javascript benchmark technique: Loop the program n times and then time it.
	This plugin is designed to be extreamly simple so other people could use it as a pattern.
	The results produced by this plugin are not reliable, see:
	http://ejohn.org/blog/accuracy-of-javascript-time/

	This plugin is part of the DashBench Javascript performance suite and is released
	under the MIT license.

	Programmed by Nadav Tenenebaum
*/
(function Dash_Bench_Time_Iterations_Plugin_initialization() {
	function TimeIterator(options) {
		// Number of default iterations: 1
		//	Generally you will use something like 5 for slow tests, 100 for
		//	moderate tests and 500 for fast tests
		//	The default is 1 in order to prevent unintentional browser hang
		//	caused by forgetting to adjust the number of iterations 
		this.iterations = options.iterations | 1;
	}

	TimeIterator.prototype.onResult = function TimeIterator_onResult(callback) {
		this.onResultCallback = callback;
	}

	TimeIterator.prototype.benchmark = function TimeIterator_benchmark(callback, values) {
		// Define variables in order the perform the benchmark
		var totalTime,
			iterations = this.iterations;
		// Get the time before performing the benchmark in ms	
		var start	= (new Date).getTime();	
		
		while(iterations--)
			callback.apply(window, values);

		// Compute the time took to perform the benchmark
		totalTime = (new Date).getTime() - start;
		// Fire onResult event since we got the results
		// Adds ms suffix in order to make it visible what the result means
		this.onResultCallback(totalTime + 'ms');
	}

	db.addAlgorithm('TIMEITERATOR', TimeIterator);
})()