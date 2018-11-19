// =========
// EXPLOSION
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var explode = {

    speed : 1,                 // the amount of frames for each pulse
    frameCounterGem : 0,       // starting point of the counter for gem
    frameCounterUnicorn : 0,   // starting point of the counter for unicorn
    counter : 0,
    extraSize : 0,

    // increases the frame on each call to the function
    frames : function (type, numberOfFrames) {
        if (type === "Gem" && this.frameCounterGem <= numberOfFrames-this.speed) {
            this.frameCounterGem += this.speed;
        }
        if (type === "Kall" && this.frameCounterUnicorn <= numberOfFrames-this.speed) {
            this.frameCounterUnicorn += this.speed; 
        } 
    },

    // returns if the animation for the explosion is over or not
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

    // draws the animation for the explosion
    draw : function (ctx,x,y,width,height,g_explosionSprite,type) {
        if (type === "Gem") {
            this.counter = this.frameCounterGem;
            this.extraSize = 90; 
        } 
        if (type === "Kall") {
            this.counter = this.frameCounterUnicorn;
            this.extraSize = 50;
        }

        g_explosionSprite[Math.floor(this.counter)].drawAtAndEnlarge(
            ctx,x,y,width+this.extraSize,width+this.extraSize);
    }

}