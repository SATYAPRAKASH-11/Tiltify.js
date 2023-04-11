const $$ = e => document.querySelectorAll(e)
class TiltEffect {
    constructor(element, options){
        this.element = element
        this.options = Object.assign({
          max: 50,
          perspective: 1000,
          speed: 300
    }, options)
        this.isTilting = false
        this.tiltX = 0
        this.tiltY = 0
        this.elementCenterX = this.element.offsetLeft + this.element.offsetWidth / 2
        this.elementCenterY = this.element.offsetTop + this.element.offsetHeight / 2
        this.addEventListeners()
    }
    addEventListeners(){
        ["mouseenter", "touchstart"].forEach(eventType => this.element.addEventListener(eventType, () => {
                this.isTilting = true
                this.tilt()
            })
        );
        ["mousemove", "touchmove"].forEach(eventType => this.element.addEventListener(eventType, event => {
                if(!this.isTilting) return
                const { clientX, clientY } = eventType === "touchmove" ? event.touches[0] : event,
                bounds = this.element.getBoundingClientRect(),
                x = bounds.left + bounds.width / 2,
                y = bounds.top + bounds.height / 2
                this.tiltX = (clientX - x) / bounds.width * this.options.max
                this.tiltY = (clientY - y) / bounds.height * this.options.max
            })
        );
        ["mouseleave", "touchend"].forEach(eventType => this.element.addEventListener(eventType, () => {
                this.isTilting = false
                this.resetTilt()
            })
        )
    }
    tilt(){
        if(!this.isTilting) return
        requestAnimationFrame(() => {
            const tiltX = Math.abs(this.tiltX) > this.options.max ? Math.sign(this.tiltX) * this.options.max : this.tiltX,
            tiltY = Math.abs(this.tiltY) > this.options.max ? Math.sign(this.tiltY) * this.options.max : this.tiltY,
            transformString = `perspective(${this.options.perspective}px) rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`
            this.element.style.transition = `${this.options.speed}ms transform`
            this.element.style.transform = transformString
            this.tilt()
        })
    }
    resetTilt(){
        this.tiltX = 0
        this.tiltY = 0
        this.element.style.transition = `${this.options.speed}ms transform`
        this.element.style.transform = "none"
    }
}
class Tiltify {
    constructor(elements, options){
        this.elements = Array.from(elements)
        this.options = Object.assign({
            max: 50,
            perspective: 1000,
            speed: 300
        }, options)
        this.instances = []
        this.init()
    }
    init(){
        this.elements.forEach(element => {
            const instance = new TiltEffect(element, this.options)
            this.instances.push(instance)
        })
    }
    destroy(){
        this.instances.forEach(instance => {
            instance.resetTilt()
            instance.element.style.transition = ""
            instance.element.style.transform = ""
        })
        this.instances = []
    }
}