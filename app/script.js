window.onload = function () {

    (function() {
        "use strict";
        let a = new Carousel({
            "wrap": ".one .nk_wrap",
            "prev": ".one .nk_prev",
            "next": ".one .nk_next",
            "touch": true,
            "autoplay": true,
            "autoplayDelay": 3000,
            "pauseOnHover": true
        });
    })();
    (function() {
        "use strict";
        let a = new Carousel({
            "wrap": ".multi .nk_wrap",
            "prev": ".multi .nk_prev",
            "next": ".multi .nk_next",
            "touch": true,
            "autoplay": true,
            "autoplayDelay": 4000,
            "pauseOnHover": true
        });
    })();
    (function() {
        "use strict";
        let a = new Carousel({
            "wrap": ".nums .nk_wrap",
            "prev": ".nums .nk_prev",
            "next": ".nums .nk_next",
            "radioButtons": ".nums .nk_radio", // если нужны радиокнопки
            "digitsInRadio": true,             // цифры в радиокнопках
            "touch": true,
            "autoplay": true,
            "autoplayDelay": 5000,
            "pauseOnHover": true
        });
    })();

};