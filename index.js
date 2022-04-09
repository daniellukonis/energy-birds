// Author : daniellukonis

window.addEventListener("contextmenu",e => e.preventDefault())

function resizeCanvas(ratio = 1){
    const canvas = document.querySelector('canvas')
    if(window.innerWidth > window.innerHeight){
        const pixels = Math.floor(window.innerHeight * ratio)
        canvas.width = pixels
        canvas.height = pixels
        return null
    }
        const pixels = Math.floor(window.innerWidth * ratio)
        canvas.width = pixels
        canvas.height = pixels
        return null
}

function resizeCanvasFull(){
    const canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function fillBackground(color = "#FFF"){
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    context.save()
    context.fillStyle = color
    context.fillRect(0,0,canvas.width,canvas.height)
    context.restore()
}

resizeCanvas()
fillBackground("#000")


class Bird{
    constructor(){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')

        this.birdX = this.canvas.width/2
        this.birdXVelocity = this.randomXVelocity()

        this.birdY = this.canvas.height - 100
        this.birdYVelocity = -2 * fxrand()
        this.birdYVelocityClimb = this.birdYVelocity
        this.birdYVelocityGlide = -this.birdYVelocity / 2

        this.wingColor = `rgba(${this.randomColor()},${this.randomColor()},255`
        this.wingColorUp = `${this.wingColor},0.07)`
        this.wingColorDown = `${this.wingColor},0.03)`
        this.wingWidth = 5
        this.wingLength = this.canvas.width / 10
        
        this.wingQX = this.wingLength / 2
        this.wingQY = this.wingLength / 2
        
        this.wingQYClimb = this.wingQY
        this.wingQYGlide = this.wingQY / 2
        
        this.wingY = 0
        this.wingYVelocity = 5
        this.wingYVelocityClimb = 6
        this.wingYVelocityGlide = 1

        this.move = false

    }

    randomXVelocity(){
        const direction = fxrand() >= 0.5 ? 1 : -1 ;
        const velocity = Math.floor(fxrand()*3)+1
        return direction * velocity
    }

    randomColor(){
        return Math.floor(255*fxrand())
    }

    flapWing(){
        if(this.wingY > this.wingQY / 2){
            this.wingYVelocity *= -1
            this.wingColor = this.wingColorUp
        }
        if(this.wingY < -this.wingQY){
            this.wingYVelocity *= -1
            this.wingColor = this.wingColorDown
        }
        this.wingY += this.wingYVelocity
    }

    moveBird(){
        this.birdX += this.birdXVelocity
        this.birdY += this.birdYVelocity
        this.checkBoundary()
    }

    checkBoundary(){
        const border = this.wingLength
        if(this.birdX < 0 + border || this.birdX > this.canvas.width - border){
            this.birdXVelocity *= -1    
        }
        if(this.birdY < 0 + border/4){
            fxpreview()
            this.birdYVelocity *= -1
            this.wingYVelocity = -this.wingYVelocityGlide
            this.wingQY = this.wingQYGlide
            this.wingY = 0
            this.birdXVelocity = this.randomXVelocity()
            this.birdYVelocity = this.birdYVelocityGlide
            return
        }
        if(this.birdY > this.canvas.height - border/4){
            this.birdYVelocity *= -1
            this.wingYVelocity = -this.wingYVelocityClimb
            this.wingQY = this.wingQYClimb
            this.wingY = 0
            this.birdXVelocity = this.randomXVelocity()
            this.birdYVelocity = this.birdYVelocityClimb
            return
        }
    }

    drawWing({context} = this){
        context.save()
        context.lineWidth = this.wingWidth
        context.strokeStyle = this.wingColor
        context.lineCap = 'round'
        context.translate(this.birdX,this.birdY)
        context.beginPath()
        context.moveTo(-this.wingWidth / 2 , 0)
        context.quadraticCurveTo(this.wingQX,-this.wingQY,this.wingLength,this.wingY)
        context.stroke()
        context.beginPath()
        context.moveTo(this.wingWidth / 2 , 0)
        context.quadraticCurveTo(-this.wingQX,-this.wingQY,-this.wingLength,this.wingY)
        context.stroke()
        context.restore()
    }

    moveCanvas({context} = this){
        context.fillRect(0,0,this.canvas.width,1)
        const imageData = context.getImageData(0,0,this.canvas.width,this.canvas.height)
        context.putImageData(imageData,0,1)
    }

    animateBird(){
        this.flapWing()
        this.move ? this.moveCanvas() : null ;
        this.moveBird()
        this.drawWing()
    }
}

const birdCount = Math.floor(fxrand()*5)+5
const birdies = Array(birdCount).fill(0).map(()=>new Bird())
birdies[0].move = true

const fpsData = {
    interval: 1000 / 60,
    now: 0,
    then: Date.now(),
    delta: 0,
    loopTimer: 0
}

function draw(data){
    requestAnimationFrame(()=>draw(data))
    
    data.now = Date.now()
    data.delta = data.now - data.then

    if(data.delta > data.interval){
        data.then = data.now - (data.delta % data.interval)

        // loop functions below
        birdies.forEach(b=>b.animateBird())
        // end loop  funcitons
    }

    data.averageFPS = (data.averageFPS + data.delta) / 2

    data.loopTimer++
}

draw(fpsData)

window.$fxhashFeatures = {
    "Bird Count": birdCount
}