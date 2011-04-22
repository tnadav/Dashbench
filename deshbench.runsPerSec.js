/*
	DashBench Runs Per Second plugin
	------------

	Calculate how many runs did a function ruuned per a period of time

	This plugin is part of the DashBench Javascript performance suite and is released
	under the MIT license.

	Programmed by Nadav Tenenebaum
*/
(function Dash_Bench_Runs_Per_Seond_Plugin_initialization() {
	function RunsPerSec(options) {
		// Time in milliseconds to perform the benchmark
		//	Defaults to one second
		this.time = options.time || 1000;
	}

	RunsPerSec.prototype.onResult = function RunsPerSec_onResult(callback) {
		
		this.onResultCallback = callback;
		
	}

	RunsPerSec.prototype.benchmark = function RunsPerSec_benchmark(callback, values) {
		var	totalTime	= 0;
		var start 		= (new Date).getTime();
		
		for(var counter = 0; totalTime < this.time; counter++) {
			callback.apply(window, values);
			totalTime = (new Date).getTime() - start;
		}
		
		// Convert the result into runs per second (and not per this.time milliseconds)
		counter /= this.time / 1000;
		this.onResultCallback(counter + ' runs/s');
		/*
			// Benchmark is performed in itervals
			interval = window.setInterval(function() {
							callback.apply(window, values);
							counter++;
						}, 0);
		// Interrupt the benchmark after this.time milliseconds
		window.setTimeout(function() {
			window.clearInterval(interval);
			// Convert the result into runs per second (and not per this.time milliseconds)
			counter /= that.time / 1000;
			that.onResultCallback(counter + ' runs/s');
		}, this.time);*/
	}

	db.addAlgorithm('RUNSPERSEC', RunsPerSec);
})()