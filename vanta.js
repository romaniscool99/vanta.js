!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports._vantaEffect = e() : t._vantaEffect = e()
}("undefined" != typeof self ? self : this, ( () => ( () => {
    "use strict";
    var t = {
        d: (e, i) => {
            for (var s in i)
                t.o(i, s) && !t.o(e, s) && Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: i[s]
                })
        }
        ,
        o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
        r: t => {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }
    }
      , e = {};
    function i(t, e) {
        return null == t && (t = 0),
        null == e && (e = 1),
        Math.floor(t + Math.random() * (e - t + 1))
    }
    t.r(e),
    t.d(e, {
        default: () => c
    }),
    Number.prototype.clamp = function(t, e) {
        return Math.min(Math.max(this, t), e)
    }
    ;
    function s(t) {
        for (; t.children && t.children.length > 0; )
            s(t.children[0]),
            t.remove(t.children[0]);
        t.geometry && t.geometry.dispose(),
        t.material && (Object.keys(t.material).forEach((e => {
            t.material[e] && null !== t.material[e] && "function" == typeof t.material[e].dispose && t.material[e].dispose()
        }
        )),
        t.material.dispose())
    }
    const o = "object" == typeof window;
    let n = o && window.THREE || {};
    o && !window.VANTA && (window.VANTA = {});
    const r = o && window.VANTA || {};
    r.register = (t, e) => r[t] = t => new e(t),
    r.version = "0.5.24";
    const h = function() {
        return Array.prototype.unshift.call(arguments, "[VANTA]"),
        console.error.apply(this, arguments)
    };
    r.VantaBase = class {
        constructor(t={}) {
            if (!o)
                return !1;
            r.current = this,
            this.windowMouseMoveWrapper = this.windowMouseMoveWrapper.bind(this),
            this.windowTouchWrapper = this.windowTouchWrapper.bind(this),
            this.windowGyroWrapper = this.windowGyroWrapper.bind(this),
            this.resize = this.resize.bind(this),
            this.animationLoop = this.animationLoop.bind(this),
            this.restart = this.restart.bind(this);
            const e = "function" == typeof this.getDefaultOptions ? this.getDefaultOptions() : this.defaultOptions;
            if (this.options = Object.assign({
                mouseControls: !0,
                touchControls: !0,
                gyroControls: !1,
                minHeight: 200,
                minWidth: 200,
                scale: 1,
                scaleMobile: 1
            }, e),
            (t instanceof HTMLElement || "string" == typeof t) && (t = {
                el: t
            }),
            Object.assign(this.options, t),
            this.options.THREE && (n = this.options.THREE),
            this.el = this.options.el,
            null == this.el)
                h('Instance needs "el" param!');
            else if (!(this.options.el instanceof HTMLElement)) {
                const t = this.el;
                if (this.el = (i = t,
                document.querySelector(i)),
                !this.el)
                    return void h("Cannot find element", t)
            }
            var i, s;
            this.prepareEl(),
            this.initThree(),
            this.setSize();
            try {
                this.init()
            } catch (t) {
                return h("Init error", t),
                this.renderer && this.renderer.domElement && this.el.removeChild(this.renderer.domElement),
                void (this.options.backgroundColor && (console.log("[VANTA] Falling back to backgroundColor"),
                this.el.style.background = (s = this.options.backgroundColor,
                "number" == typeof s ? "#" + ("00000" + s.toString(16)).slice(-6) : s)))
            }
            this.initMouse(),
            this.resize(),
            this.animationLoop();
            const a = window.addEventListener;
            a("resize", this.resize),
            window.requestAnimationFrame(this.resize),
            this.options.mouseControls && (a("scroll", this.windowMouseMoveWrapper),
            a("mousemove", this.windowMouseMoveWrapper)),
            this.options.touchControls && (a("touchstart", this.windowTouchWrapper),
            a("touchmove", this.windowTouchWrapper)),
            this.options.gyroControls && a("deviceorientation", this.windowGyroWrapper)
        }
        setOptions(t={}) {
            Object.assign(this.options, t),
            this.triggerMouseMove()
        }
        prepareEl() {
            let t, e;
            if ("undefined" != typeof Node && Node.TEXT_NODE)
                for (t = 0; t < this.el.childNodes.length; t++) {
                    const e = this.el.childNodes[t];
                    if (e.nodeType === Node.TEXT_NODE) {
                        const t = document.createElement("span");
                        t.textContent = e.textContent,
                        e.parentElement.insertBefore(t, e),
                        e.remove()
                    }
                }
            for (t = 0; t < this.el.children.length; t++)
                e = this.el.children[t],
                "static" === getComputedStyle(e).position && (e.style.position = "relative"),
                "auto" === getComputedStyle(e).zIndex && (e.style.zIndex = 1);
            "static" === getComputedStyle(this.el).position && (this.el.style.position = "relative")
        }
        applyCanvasStyles(t, e={}) {
            Object.assign(t.style, {
                position: "absolute",
                zIndex: 0,
                top: 0,
                left: 0,
                background: ""
            }),
            Object.assign(t.style, e),
            t.classList.add("vanta-canvas")
        }
        initThree() {
            n.WebGLRenderer ? (this.renderer = new n.WebGLRenderer({
                alpha: !0,
                antialias: !0
            }),
            this.el.appendChild(this.renderer.domElement),
            this.applyCanvasStyles(this.renderer.domElement),
            isNaN(this.options.backgroundAlpha) && (this.options.backgroundAlpha = 1),
            this.scene = new n.Scene) : console.warn("[VANTA] No THREE defined on window")
        }
        getCanvasElement() {
            return this.renderer ? this.renderer.domElement : this.p5renderer ? this.p5renderer.canvas : void 0
        }
        getCanvasRect() {
            const t = this.getCanvasElement();
            return !!t && t.getBoundingClientRect()
        }
        windowMouseMoveWrapper(t) {
            const e = this.getCanvasRect();
            if (!e)
                return !1;
            const i = t.clientX - e.left
              , s = t.clientY - e.top;
            i >= 0 && s >= 0 && i <= e.width && s <= e.height && (this.mouseX = i,
            this.mouseY = s,
            this.options.mouseEase || this.triggerMouseMove(i, s))
        }
        windowTouchWrapper(t) {
            const e = this.getCanvasRect();
            if (!e)
                return !1;
            if (1 === t.touches.length) {
                const i = t.touches[0].clientX - e.left
                  , s = t.touches[0].clientY - e.top;
                i >= 0 && s >= 0 && i <= e.width && s <= e.height && (this.mouseX = i,
                this.mouseY = s,
                this.options.mouseEase || this.triggerMouseMove(i, s))
            }
        }
        windowGyroWrapper(t) {
            const e = this.getCanvasRect();
            if (!e)
                return !1;
            const i = Math.round(2 * t.alpha) - e.left
              , s = Math.round(2 * t.beta) - e.top;
            i >= 0 && s >= 0 && i <= e.width && s <= e.height && (this.mouseX = i,
            this.mouseY = s,
            this.options.mouseEase || this.triggerMouseMove(i, s))
        }
        triggerMouseMove(t, e) {
            void 0 === t && void 0 === e && (this.options.mouseEase ? (t = this.mouseEaseX,
            e = this.mouseEaseY) : (t = this.mouseX,
            e = this.mouseY)),
            this.uniforms && (this.uniforms.iMouse.value.x = t / this.scale,
            this.uniforms.iMouse.value.y = e / this.scale);
            const i = t / this.width
              , s = e / this.height;
            "function" == typeof this.onMouseMove && this.onMouseMove(i, s)
        }
        setSize() {
            this.scale || (this.scale = 1),
            "undefined" != typeof navigator && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600) && this.options.scaleMobile ? this.scale = this.options.scaleMobile : this.options.scale && (this.scale = this.options.scale),
            this.width = Math.max(this.el.offsetWidth, this.options.minWidth),
            this.height = Math.max(this.el.offsetHeight, this.options.minHeight)
        }
        initMouse() {
            (!this.mouseX && !this.mouseY || this.mouseX === this.options.minWidth / 2 && this.mouseY === this.options.minHeight / 2) && (this.mouseX = this.width / 2,
            this.mouseY = this.height / 2,
            this.triggerMouseMove(this.mouseX, this.mouseY))
        }
        resize() {
            this.setSize(),
            this.camera && (this.camera.aspect = this.width / this.height,
            "function" == typeof this.camera.updateProjectionMatrix && this.camera.updateProjectionMatrix()),
            this.renderer && (this.renderer.setSize(this.width, this.height),
            this.renderer.setPixelRatio(window.devicePixelRatio / this.scale)),
            "function" == typeof this.onResize && this.onResize()
        }
        isOnScreen() {
            const t = this.el.offsetHeight
              , e = this.el.getBoundingClientRect()
              , i = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
              , s = e.top + i;
            return s - window.innerHeight <= i && i <= s + t
        }
        animationLoop() {
            this.t || (this.t = 0),
            this.t2 || (this.t2 = 0);
            const t = performance.now();
            if (this.prevNow) {
                let e = (t - this.prevNow) / (1e3 / 60);
                e = Math.max(.2, Math.min(e, 5)),
                this.t += e,
                this.t2 += (this.options.speed || 1) * e,
                this.uniforms && (this.uniforms.iTime.value = .016667 * this.t2)
            }
            return this.prevNow = t,
            this.options.mouseEase && (this.mouseEaseX = this.mouseEaseX || this.mouseX || 0,
            this.mouseEaseY = this.mouseEaseY || this.mouseY || 0,
            Math.abs(this.mouseEaseX - this.mouseX) + Math.abs(this.mouseEaseY - this.mouseY) > .1 && (this.mouseEaseX += .05 * (this.mouseX - this.mouseEaseX),
            this.mouseEaseY += .05 * (this.mouseY - this.mouseEaseY),
            this.triggerMouseMove(this.mouseEaseX, this.mouseEaseY))),
            (this.isOnScreen() || this.options.forceAnimate) && ("function" == typeof this.onUpdate && this.onUpdate(),
            this.scene && this.camera && (this.renderer.render(this.scene, this.camera),
            this.renderer.setClearColor(this.options.backgroundColor, this.options.backgroundAlpha)),
            this.fps && this.fps.update && this.fps.update(),
            "function" == typeof this.afterRender && this.afterRender()),
            this.req = window.requestAnimationFrame(this.animationLoop)
        }
        restart() {
            if (this.scene)
                for (; this.scene.children.length; )
                    this.scene.remove(this.scene.children[0]);
            "function" == typeof this.onRestart && this.onRestart(),
            this.init()
        }
        init() {
            "function" == typeof this.onInit && this.onInit()
        }
        destroy() {
            "function" == typeof this.onDestroy && this.onDestroy();
            const t = window.removeEventListener;
            t("touchstart", this.windowTouchWrapper),
            t("touchmove", this.windowTouchWrapper),
            t("scroll", this.windowMouseMoveWrapper),
            t("mousemove", this.windowMouseMoveWrapper),
            t("deviceorientation", this.windowGyroWrapper),
            t("resize", this.resize),
            window.cancelAnimationFrame(this.req);
            const e = this.scene;
            e && e.children && s(e),
            this.renderer && (this.renderer.domElement && this.el.removeChild(this.renderer.domElement),
            this.renderer = null,
            this.scene = null),
            r.current === this && (r.current = null)
        }
    }
    ;
    const a = r.VantaBase;
    let p = "object" == typeof window && window.THREE;
    class l extends a {
        static initClass() {
            this.prototype.ww = 100,
            this.prototype.hh = 80,
            this.prototype.waveNoise = 4
        }
        constructor(t) {
            p = t.THREE || p,
            super(t)
        }
        getMaterial() {
            const t = {
                color: this.options.color,
                shininess: this.options.shininess,
                flatShading: !0,
                side: p.DoubleSide
            };
            return new p.MeshPhongMaterial(t)
        }
        onInit() {
            let t, e;
            const s = this.getMaterial()
              , o = new p.BufferGeometry;
            this.gg = [];
            const n = [];
            for (t = 0; t <= this.ww; t++)
                for (this.gg[t] = [],
                e = 0; e <= this.hh; e++) {
                    const i = n.length
                      , s = new p.Vector3(18 * (t - .5 * this.ww),(null == (r = 0) && (r = 0),
                    null == (h = this.waveNoise) && (h = 1),
                    r + Math.random() * (h - r) - 10),18 * (.5 * this.hh - e));
                    n.push(s),
                    this.gg[t][e] = i
                }
            var r, h;
            o.setFromPoints(n);
            const a = [];
            for (t = 1; t <= this.ww; t++)
                for (e = 1; e <= this.hh; e++) {
                    let s, o;
                    const n = this.gg[t][e]
                      , r = this.gg[t][e - 1]
                      , h = this.gg[t - 1][e]
                      , p = this.gg[t - 1][e - 1];
                    i(0, 1) ? (s = [p, r, h],
                    o = [r, h, n]) : (s = [p, r, n],
                    o = [p, h, n]),
                    a.push(...s, ...o)
                }
            o.setIndex(a),
            this.plane = new p.Mesh(o,s),
            this.scene.add(this.plane);
            const l = new p.AmbientLight(16777215,.9);
            this.scene.add(l);
            const c = new p.PointLight(16777215,.9);
            c.position.set(-100, 250, -100),
            this.scene.add(c),
            this.camera = new p.PerspectiveCamera(35,this.width / this.height,50,1e4),
            this.cameraPosition = new p.Vector3(240,200,390),
            this.cameraTarget = new p.Vector3(140,-30,190),
            this.camera.position.copy(this.cameraPosition),
            this.scene.add(this.camera)
        }
        onUpdate() {
            let t;
            this.plane.material.color.set(this.options.color),
            this.plane.material.shininess = this.options.shininess,
            this.camera.ox = this.cameraPosition.x / this.options.zoom,
            this.camera.oy = this.cameraPosition.y / this.options.zoom,
            this.camera.oz = this.cameraPosition.z / this.options.zoom,
            null != this.controls && this.controls.update();
            const e = this.camera;
            Math.abs(e.tx - e.position.x) > .01 && (t = e.tx - e.position.x,
            e.position.x += .02 * t),
            Math.abs(e.ty - e.position.y) > .01 && (t = e.ty - e.position.y,
            e.position.y += .02 * t),
            Math.abs(e.tz - e.position.z) > .01 && (t = e.tz - e.position.z,
            e.position.z += .02 * t),
            e.lookAt(this.cameraTarget),
            this.oy = this.oy || {};
            for (let t = 0; t < this.plane.geometry.attributes.position.array.length; t += 3) {
                const e = {
                    x: this.plane.geometry.attributes.position.array[t],
                    y: this.plane.geometry.attributes.position.array[t + 1],
                    z: this.plane.geometry.attributes.position.array[t + 2],
                    oy: this.oy[t]
                };
                if (e.oy) {
                    const i = this.options.waveSpeed
                      , s = Math.sqrt(i) * Math.cos(-e.x - .7 * e.z)
                      , o = Math.sin(i * this.t * .02 - i * e.x * .025 + i * e.z * .015 + s)
                      , n = Math.pow(o + 1, 2) / 4;
                    e.y = e.oy + n * this.options.waveHeight,
                    this.plane.geometry.attributes.position.array[t + 1] = e.y
                } else
                    this.oy[t] = e.y
            }
            this.plane.geometry.attributes.position.setUsage(p.DynamicDrawUsage),
            this.plane.geometry.computeVertexNormals(),
            this.plane.geometry.attributes.position.needsUpdate = !0,
            this.wireframe && (this.wireframe.geometry.fromGeometry(this.plane.geometry),
            this.wireframe.geometry.computeFaceNormals())
        }
        onMouseMove(t, e) {
            const i = this.camera;
            return i.oy || (i.oy = i.position.y,
            i.ox = i.position.x,
            i.oz = i.position.z),
            i.tx = i.ox + 100 * (t - .5) / this.options.zoom,
            i.ty = i.oy + -100 * (e - .5) / this.options.zoom,
            i.tz = i.oz + -50 * (t - .5) / this.options.zoom
        }
    }
    l.prototype.defaultOptions = {
        color: 21896,
        shininess: 30,
        waveHeight: 15,
        waveSpeed: 1,
        zoom: 1
    },
    l.initClass();
    const c = r.register("WAVES", l);
    return e
}
)()));
