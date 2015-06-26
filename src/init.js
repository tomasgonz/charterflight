// This is a temporary place where to place this prototype code
// I will place this code in a separate file to be shared by the whole application

(function(global) {

    var charterflight = {
        'version': '1.0'
    };

    if (global.charterflight) {
        throw new Error('Charterflight has alread been defined');
    } else {
        global.charterflight = charterflight;
    };

})(typeof window === 'undefined' ? this : window);
