iii = 0;
db.theme('Adding vs. Substacting', [[''], [1] , ['1'], ['', 1, '1']], 1000, function() {
	db.bench('Adding', function() {
		for (var i = 0; i < arguments.length; i++){
			for(ii = 0; ii < 1000000; ii++) {
				iii++;
			}
		}
	});
	db.bench('Substracting', function() {
		for (var i = 0; i < arguments.length; i++){
			for(ii = 0; ii < 10000; ii++) {
				iii--;
			}
		}
		
	});
});