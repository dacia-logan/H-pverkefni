// =========
// EXPLOSION
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var explode = {

    speed : 2.2,            // the amount of frames for each pulse
    frameCounter : 0,       // starting point of the counter
    extraSize : 70,         // have the explosion be a little bigger than the original

    // increases the frame on each call to the function
    frames : function () {
        this.frameCounter += this.speed;
    },

    // returns if the animation for the explosion is over or not
    done : function (numberOfFrames) {
        if (this.frameCounter >= numberOfFrames-this.speed) {
            this.frameCounter = 0; 
            return true;
        } 
        else return false;
    },

    // draws the animation for the explosion
    draw : function (ctx,x,y,width,height,g_explosionSprite) {
        g_explosionSprite[Math.floor(this.frameCounter)].drawAtAndEnlarge(
            ctx,x,y,width+this.extraSize,height+this.extraSize);
        console.log("hello draw");
    }

}