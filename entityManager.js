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
_star : [],
_knifes : [],

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
    this._categories = [this._platforms, this._dummies, this._star, this._knifes];
},

init: function() {
   this.generateMap();
},

generatePlat : function(descr,x,y) {
    this._platforms.push(new Platform(descr,x,y));
},

setPlatforms: function(){
    //TODO nota þetta sem viðmið hvaða platform er verið að nota.
    var a = Math.floor(util.randRange(1,5)); 
    //creates a random number, when the number is 1 we create a star
    var makeStar =  Math.floor(util.randRange(0,2));
    //random number deciding if the stars are one or two on the platform
    //var oneOrTwo = Math.floor(util.randRange(1,3));

    for(var entity in this._platforms){

        var platX = this._platforms[entity].getPos().posX;
        var platWidth =this._platforms[entity].getWidth();
        var primary = this._platforms[entity].getPrimary();

        if(primary && platX + platWidth <= camera.getPos().posX+500 && !this._platforms[entity].getPlatformPushed()){
            this._platforms[entity].setPlatformPushed();
            this._platforms.push(new Platform(a,true));

            //this._star.push(new Star(a));

            //make a new star when 'makeStar' is equal to 1
            if (makeStar === 1) this._star.push(new Star(a));
            //if oneOrTwo is equal to two then we make another star for this platform
            //if (oneOrTwo === 2) this._star.push(new Star(a));
        }
    }
},

generateMap : function(){
    this._platforms.push(new Platform(1, true, 300, 500));
    this._dummies.push(new Kall());
},

getMainCharacter : function(){
  return this._dummies[0];
},

update: function(du) {
    //Range of numbers that give u different platform
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
