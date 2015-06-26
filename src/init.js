
(function(global) {

    var charterflight = {
        'version': '0.1'
    };

    if (global.charterflight) {
        throw new Error('Charterflight has already been defined');
    } else {
        global.charterflight = charterflight;
    };

})(typeof window === 'undefined' ? this : window);
