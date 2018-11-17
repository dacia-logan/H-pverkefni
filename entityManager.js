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
_knifes :[],
_rainbow : [],
_combo : [],


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
    this._categories = [this._platforms, this._dummies, this._star, this._knifes, this._rainbow, this._combo];
},

init: function() {
   this.generateMap();
},

// Platform functions \\
platSet1:function(){
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1+550;
    var y1 = 500;
    var y2 = 180;
    this._platforms.push(new Platform(1,true,x1, y1));
    this._platforms.push(new Platform(4,false,x2,y2));
},

platSet2:function(){
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1-100;
    var x3 = x1+1000;
    var y1 = 450;
    var y2 = 130;
    var y3 = 1;
    this._star.push(new Star(x3+100, y3-70));
    this._platforms.push(new Platform(1,false,x1, y1));
    this._platforms.push(new Platform(4,false,x2,y2));
    this._platforms.push(new Platform(4,true,x3,y3));
},

platSet3:function(){
    var x = camera.getPos().posX + g_canvas.width;
    var mainY = 400;
    this._platforms.push(new Platform(1,true,x, mainY));

},
platSet4:function(){
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1+800;
    var x3 = x1+1400;
    var y1 = 450;
    var y2 = 350;
    var y3 = 250;
    this._platforms.push(new Platform(4,false,x1,y1));
    this._platforms.push(new Platform(5,false,x2, y2));
    this._platforms.push(new Platform(3,true, x3, y3));
},

platSet5:function(){
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1+500;
    var x3 = x1+1000;
    var y1 = 330;
    var y2 = 230;
    this._platforms.push(new Platform(3,false,x1, y1));
    this._platforms.push(new Platform(7,false,x2,y2));
    this._platforms.push(new Platform(2,true, x3, y2));
},


setPlatforms: function(){
    //TODO nota þetta sem viðmið hvaða platform er verið að nota.
    var a = Math.floor(util.randRange(1,5)); 
    var plats = Math.floor(util.randRange(0,16));
    //creates a random number, when the number is 1 we create a star and butterfly
    var makeStar =  Math.floor(util.randRange(0,2));
    var makeButterfly =  Math.floor(util.randRange(0,2));

    for(var entity in this._platforms){

        var platX = this._platforms[entity].getPos().posX;
        var platWidth =this._platforms[entity].getWidth();
        var primary = this._platforms[entity].getPrimary();

        if(primary && platX + platWidth <= camera.getPos().posX+500 && !this._platforms[entity].getPlatformPushed()){
            this._platforms[entity].setPlatformPushed();
            
            if(plats >= 13) { this.platSet1(); }
            else if( plats >= 9) { this.platSet2(); }
            else if(plats >=6) { this.platSet3(); }
            else if(plats >=3) { this.platSet4(); }
            else{ this.platSet5(); }

            //make a new star when 'makeStar' is equal to 1
            if (makeStar === 1) this._star.push(new Star(a));
            //make a new butterfly when 'makeButterfly' is equal to 1
            if (makeButterfly === 1) {
                this._rainbow.push(new Rainbow(a));
                if (Rainbow.isCaught) {
                    this._combo.push(new Combo(a));
                }
            }

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
