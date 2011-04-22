iii = 0;
db.theme('Adding vs. Substacting (Runs per second plugin)', [[''], [1] , ['1'], ['', 1, '1']], function() {
	db.bench('Adding', function() {
		for (var i = 0; i < arguments.length; i++){
			for(ii = 0; ii < 1000000; ii++) {
				iii++;
			}
		}
	});
	db.bench('Substracting', function() {
		for (var i = 0; i < arguments.length; i++){
			for(ii = 0; ii < 1000000; ii++) {
				iii--;
			}
		}
		
	});
}, db.use(db.RUNSPERSEC, {'time':1000}));