// =========
// EXPLOSION
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var explode = {

    speed : 1,                            // The amount of frames for each pulse.
    frameCounterGem : 0,                  // Starting point of the counter for gem.
    frameCounterUnicorn : 0,              // Starting point of the counter for unicorn.
    counter : 0,                          // Defines the index for the draw function.
    extraSize : 0,                        // The pixels to add to the explosion when drawing.


    // Increases the frame on each call to the function.
    frames : function (type, numberOfFrames,du) {
        if (type === "Gem" && this.frameCounterGem <= numberOfFrames-this.speed) {
            this.frameCounterGem += this.speed;
        }
        if (type === "Kall" && this.frameCounterUnicorn <= numberOfFrames-this.speed) {
            this.frameCounterUnicorn += this.speed; 
        } 
    },

    preShake : function(ctx) {
        ctx.save();
  
        var dx = Math.random()*10;
        var dy = Math.random()*10;
  
        ctx.translate(dx,dy); 
    },

    postShake : function(ctx) {
        ctx.restore();
        
    },

    // Returns if the animation for the explosion is over or not.
    done : function (numberOfFrames,type) {
        if (type === "Gem" && this.frameCounterGem >= numberOfFrames) {
            this.frameCounterGem = 0;
            return true;
        } 
        if (type === "Kall" && this.frameCounterUnicorn >= numberOfFrames) {
            this.frameCounterUnicorn = 0; 
            return true;
        }
        return false;
    },

    // Draws the animation for the explosion.
    draw : function (ctx,x,y,width,height,g_explosionSprite,type,du) {
        
        if (type === "Gem") {
            this.counter = this.frameCounterGem;
            this.extraSize = 110;
        } 
        if (type === "Kall") {
            this.counter = this.frameCounterUnicorn;
            this.extraSize = 50;
        }

        // explode.preShake(ctx); //AFKOMMENTA TIL AÐ SJÁ HRISTING Á SPRENGJU

        g_explosionSprite[Math.floor(this.counter)].drawAtAndEnlarge(
            ctx,x,y,width+this.extraSize,width+this.extraSize);

        // explode.postShake(ctx); //AFKOMMENTA TIL AÐ SJÁ HRISTING Á SPRENGJU
    }
}