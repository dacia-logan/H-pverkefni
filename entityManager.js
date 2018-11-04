/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_platforms : [],
_dummies : [],


// "PRIVATE" METHODS



// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._platforms, this._dummies];
},

init: function() {
   this.generateMap();
},


setPlatforms: function(){

        var a = Math.floor(util.randRange(1,5));   

        for(var entity in this._platforms){
            if(this._platforms[entity].getPos().posX < 20 && !this._platforms[entity].getTouchingEdge()){
            this._platforms[entity].setTouchingEdge();
            this._platforms.push(new Platform(a));  
        }                   
    } 
},


//TODO
setObstacle: function(){

   /* for(var entity in this._platforms){


        }
    */
},

generateMap : function(){
    this._platforms.push(new Platform(1,100,400));
    this._dummies.push(new Kall());
},


update: function(du) {

            //  Range of numbers that give u different platform

    //Check if to push new platform or not
        //this.setObstacle();
    this.setPlatforms();

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);
            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }



},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks &&
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
