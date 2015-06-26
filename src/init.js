// This is a temporary place where to place this prototype code
// I will place this code in a separate file to be shared by the whole application

(function(global) {

    var CharterFlight = {
        'version': '1.0'
    };

    if (global.CharterFlight) {
        throw new Error('Charterflight has alread been defined');
    } else {
        global.CharterFlight = CharterFlight;
    };

})(typeof window === 'undefined' ? this : window);
