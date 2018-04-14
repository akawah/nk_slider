function Carousel(setting) {
    "use strict";
    let wrap = document.querySelector(setting.wrap);
    if(wrap === null) {
        console.error(`Не найден селектор карусели ${setting.wrap}`);
        return;
    }
    // если блоков мало слайдер не нужен
    if(wrap.children.length <= setting.perItem) {
        if(wrap.parentNode.querySelector(setting.prev) !== null) {
            wrap.parentNode.removeChild(document.querySelector(setting.prev));
        } else {
            wrap.parentNode.parentNode.removeChild(document.querySelector(setting.prev));
        }
        if(wrap.parentNode.querySelector(setting.next) !== null) {
            wrap.parentNode.removeChild(document.querySelector(setting.next));
        } else {
            wrap.parentNode.parentNode.removeChild(document.querySelector(setting.next));
        }
        return false;
    }

    /* область видимости приватных методов и свойств */
    let privates = {}, xDown, yDown, xUp, yUp, xDiff, yDiff;

    /* публичные методы */

    // Num
    this.num_slide = (n) => {
        if(!privates.isAnimationEnd) {
            return;
        }

        privates.isAnimationEnd = false;

        privates.sel.radioButtons.children[privates.opt.position].classList.remove('active');

        privates.opt.position = n;

        setTimeout(() => {
            privates.sel.wrap.classList.remove('s-notransition');
            privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;
        }, 10);

        privates.sel.radioButtons.children[privates.opt.position].classList.add('active');
        
        privates.sel.wrap.addEventListener('transitionend', () => {
            privates.isAnimationEnd = true;
        });

        if(privates.setting.autoplay === true) {
            privates.timer.become();
        }
    };


    // Prev
    this.prev_slide = () => {
        if(!privates.isAnimationEnd) {
            return;
        }

        privates.isAnimationEnd = false;

        if(privates.sel.radioButtons !== null) {
            privates.sel.radioButtons.children[privates.opt.position].classList.remove('active');
        }
        
        --privates.opt.position;

        if(privates.opt.position < 0) {
            privates.sel.wrap.classList.add('s-notransition');
            privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.max_position}00%)`;
            privates.opt.position = privates.opt.max_position - 1;
        }
        
        if(privates.sel.radioButtons !== null) {
            privates.sel.radioButtons.children[privates.opt.position].classList.add('active');
        }
        
        setTimeout(() => {
            privates.sel.wrap.classList.remove('s-notransition');
            privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;
        }, 10);

        privates.sel.wrap.addEventListener('transitionend', () => {
            privates.isAnimationEnd = true;
        });

        if(privates.setting.autoplay === true) {
            privates.timer.become();
        }
    };


    // Next
    this.next_slide = () => {
        if(!privates.isAnimationEnd) {
            return;
        }

        privates.isAnimationEnd = false;

        if(privates.sel.radioButtons !== null) {
            privates.sel.radioButtons.children[privates.opt.position].classList.remove('active');
        }

        if(privates.opt.position < privates.opt.max_position) {
            ++privates.opt.position;
        }

        if(privates.sel.radioButtons !== null) {
            if(privates.opt.position == privates.opt.max_position) {
                privates.sel.radioButtons.children[0].classList.add('active');
            } else {
                privates.sel.radioButtons.children[privates.opt.position].classList.add('active');
            }
        }
        
        privates.sel.wrap.classList.remove('s-notransition');
        privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;

        privates.sel.wrap.addEventListener('transitionend', () => {
            if(privates.opt.position >= privates.opt.max_position) {
                privates.sel.wrap.style["transform"] = 'translateX(0)';
                privates.sel.wrap.classList.add('s-notransition');
                privates.opt.position = 0;
            }

            privates.isAnimationEnd = true;
        });

        if(privates.setting.autoplay === true) {
            privates.timer.become();
        }
    };


    // пауза
    this.pause = () => {
        if(privates.setting.autoplay === true) {
            privates.timer.pause();
        }
    };


    // утановка таймера
    this.become = (autoplayDelay = privates.setting.autoplayDelay) => {
        if(privates.setting.autoplay === true) {
            privates.setting.autoplayDelay = autoplayDelay;
            privates.timer.become();
        }
    };


    // Go to
    this.goto = (index) => {
        privates.opt.position = index - 1;
        this.next_slide();
    };


    // Item
    this.index = () => {
        return privates.opt.position;
    };


    /* приватные методы */
    // палец
    privates.hts = (e) => {
        xDown = e.touches[0].clientX;
        yDown = e.touches[0].clientY;
    };
    privates.htm = (e) => {
        if ( ! xDown || ! yDown ) {
            return;
        }

        xUp = e.touches[0].clientX;
        yUp = e.touches[0].clientY;

        xDiff = xDown - xUp;
        yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 ) {
                this.next_slide();
            } else {
                this.prev_slide();
            }
        }

        xDown = 0;
        yDown = 0;
    };

    // добавление радиокнопок
    privates.addRadioButtons = (e) => {
        let shows = Math.ceil(privates.sel.children.length / privates.sel.perItem); // количество показов
        
        for (let i = 0; i < shows; i++) {
            let div = document.createElement('div');
            if(privates.sel.digitsInRadio) div.innerHTML = 1+i; // номер внутрь радиокнопки
            privates.sel.radioButtons.appendChild(div);
        }
        privates.sel.radioButtons.children[0].classList.add('active');
    };

    // количество элементов для показа за раз (берется из стилей)
    privates.getPerItem = () => {
        let widthItem = getComputedStyle(wrap.querySelector('.nk_item')).flexBasis;
        let result = widthItem.match(/([0-9]+)[\.0-9]*%/);
        return parseInt(100/result[1]);
    };

    // инициализация
    privates.initSlider = (e) => {
        let inWrap = privates.sel.children.length; // количество блоков
        let shows = Math.ceil( inWrap / privates.sel.perItem ); // количество показов
        let tail = inWrap % privates.sel.perItem; // количество блоков в последнем показе

        // добавить радио-кнопки, если нужны
        if(privates.sel.radioButtons !== null) {
            privates.addRadioButtons();
        }

        // добавить пустые блоки
        if(tail > 0) {
            for (let i = 0; i < privates.sel.perItem - tail; i++) {
                let div = document.createElement('div');
                div.className = 'nk_item item blank';
                privates.sel.wrap.appendChild(div);
            }
        }
        // дублировать первый показ
        for (let i = 0; i < privates.sel.perItem; i++) {
            let div = privates.sel.children[i].cloneNode(true);
            div.classList.add('added');
            privates.sel.wrap.appendChild(div);
        }

        privates.opt = {
            "position": 0,
            "max_position": shows
        };
    };
    
    // реинициализация
    privates.reInitSlider = (e) => {
        if(privates.sel.perItem == privates.getPerItem()) return;
        else privates.sel.perItem = privates.getPerItem();
        // удалить добавленные
        [].forEach.call(wrap.querySelectorAll('.added'),function(e){
            e.parentNode.removeChild(e);
        });
        // удалить пустые
        [].forEach.call(wrap.querySelectorAll('.blank'),function(e){
            e.parentNode.removeChild(e);
        });
        // удалить радио-кнопки, если есть
        if(privates.sel.radioButtons !== null) {
            privates.sel.radioButtons.innerHTML = '';
        }
        privates.sel.wrap.style["transform"] = 'translateX(0)';
        privates.initSlider(e);
    };

    /* приватные свойства */
    privates.default = {
        "touch": true,
        "autoplay": false,
        "autoplayDelay": 5000,
        "pauseOnFocus": true,
        "pauseOnHover": true
    };

    privates.setting = Object.assign(privates.default, setting);

    privates.isAnimationEnd = true;

    privates.sel = {
        "wrap": wrap,
        "children": wrap.children,
        "prev": document.querySelector(privates.setting.prev),
        "next": document.querySelector(privates.setting.next),
        "radioButtons": document.querySelector(privates.setting.radioButtons),
        "perItem": privates.getPerItem(),
        "digitsInRadio": privates.setting.digitsInRadio
    };

    /* конструктор */

    privates.initSlider();

    // resize
    let time;
    window.addEventListener('resize', (e) => {
       if (time) clearTimeout(time);
       time = setTimeout(function(){ privates.reInitSlider(e); },500);
    });

    // Autoplay
    if(privates.setting.autoplay === true) {
        privates.timer = new Timer(this.next_slide, privates.setting.autoplayDelay);
    }

    // Radio
    if(privates.sel.radioButtons !== null) {
        privates.sel.radioButtons.addEventListener('click', (e) => {
            for(let i = 0; i <= privates.opt.max_position; i++) {
                if(privates.sel.radioButtons.children[i] == e.target)
                    return this.num_slide(i);
            }
        });
    }

    // вперед-назад
    if(privates.sel.prev !== null) {
        privates.sel.prev.addEventListener('click', () => {
            this.prev_slide();
        });
    }

    if(privates.sel.next !== null) {
        privates.sel.next.addEventListener('click', () => {
            this.next_slide();
        });
    }

    // тач-события
    if(privates.setting.touch === true) {
        privates.sel.wrap.addEventListener('touchstart', privates.hts, false);
        privates.sel.wrap.addEventListener('touchmove', privates.htm, false);
    }

    // пауза на ховере
    if(privates.setting.autoplay === true && privates.setting.pauseOnHover === true) {
        privates.sel.wrap.addEventListener('mouseenter', () => {
            privates.timer.pause();
        });

        privates.sel.wrap.addEventListener('mouseleave', () => {
            privates.timer.become();
        });
    }
}

function Timer(callback, delay) {
    /* privates properties */
    let timerId, start, remaining = delay;

    /* Public methods */
    this.resume = () => {
        start = new Date();
        timerId = setTimeout(() => {
            remaining = delay;
            this.resume();
            callback();
        }, remaining);
    };

    this.pause = () => {
        clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.become = () => {
        clearTimeout(timerId);
        remaining = delay;
        this.resume();
    };

    /* Constructor */
    this.resume();
}