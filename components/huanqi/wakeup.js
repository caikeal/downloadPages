	TzblEmploy = {};

    (function() {
    	/*locked防止重复吊起应用*/
        var ua = navigator.userAgent.toLowerCase(),
            locked = false,
            domLoaded = document.readyState === 'complete',
            delayToRun;

        function customClickEvent() {
            var clickEvt;
            if (window.CustomEvent) {
                clickEvt = new window.CustomEvent('click', {
                    canBubble: true,
                    cancelable: true
                });
            } else {
                clickEvt = document.createEvent('Event');
                clickEvt.initEvent('click', true, true);
            }

            return clickEvt;
        }

        var noIntentTest = /tzbl|360 aphone|weibo|windvane|ucbrowser/.test(ua);
        var hasIntentTest = /chrome|samsung/.test(ua);
        var isAndroid = /android|adr/.test(ua);
        var canIntent = !noIntentTest && hasIntentTest && isAndroid;
        var inWeibo = ua.indexOf('weibo') > -1;

        if (ua.indexOf('m353') > -1 && !noIntentTest) {
            canIntent = false;
        }

        /**
         * 打开
         * @param   {string}    params  唤起的参数设置('alipays://platformapi/startapp?'后面的值)
         * @param   {boolean}   jumpUrl 唤起后，android下要跳转到的URL；
         *                      若传"default"，则为http://d.alipay.com/i/index.htm?nojump=1#once
         */
        TzblEmploy.open = function() {
            // 唤起锁定，避免重复唤起
            if (locked) {
                return;
            }
            locked = true;

            // 通过alipays协议唤起钱包
            var schemePrefix='tzbl';
            if (!canIntent) {
                var tzblUrl = schemePrefix + '://';

                if (ua.indexOf('qq/') > -1 || (ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1)) {
                    var openSchemeLink = document.getElementById('openSchemeLink');
                    if (!openSchemeLink) {
                        openSchemeLink = document.createElement('a');
                        openSchemeLink.id = 'openSchemeLink';
                        openSchemeLink.style.display = 'none';
                        document.body.appendChild(openSchemeLink);
                    }
                    openSchemeLink.href = tzblUrl;
                    // 执行click
                    openSchemeLink.dispatchEvent(customClickEvent());
                } else {
                    var ifr = document.createElement('iframe');
                    ifr.src = tzblUrl;
                    ifr.style.display = 'none';
                    document.body.appendChild(ifr);
                }
            } else {
                // android 下 chrome 浏览器通过 intent 协议唤起

                var intentUrl = schemePrefix + "://";

                var openIntentLink = document.getElementById('openIntentLink');
                if (!openIntentLink) {
                    openIntentLink = document.createElement('a');
                    openIntentLink.id = 'openIntentLink';
                    openIntentLink.style.display = 'none';
                    document.body.appendChild(openIntentLink);
                }
                openIntentLink.href = intentUrl;
                // 执行click
                openIntentLink.dispatchEvent(customClickEvent());
            }

            // 唤起加锁，避免短时间内被重复唤起
            setTimeout(function() {
                locked = false;
            }, 2500);
        }

        if (!domLoaded) {
            delayToRun = function() {
                TzblEmploy.open();
                delayToRun = null;
            };
        }

        if (!domLoaded) {
            document.addEventListener('DOMContentLoaded', function() {
                domLoaded = true;
                if (typeof delayToRun === 'function') {
                    delayToRun();
                }
            }, false);
        }
    })();