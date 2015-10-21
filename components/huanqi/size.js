    !(function(window) {
        var document = window.document,
            setSize = function() {
                var zoom = document.documentElement.clientWidth / 320;
                zoom = zoom > 2.5 ? 2.5 : zoom < 1 ? 1 : zoom;
                document.documentElement.style.fontSize = zoom * 20 + "px";
                document.body.style.fontSize = zoom * 20 + "px";
            };
        setSize();
        window.addEventListener("resize", setSize, false);
        window.addEventListener("load", setSize, false);
        window._dateNow = new Date();
    })(window);