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
_gem : [],
_knifes :[],
_shine : [],
_combo : [],

// TODO

didDie : false,

gameOver : false,
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
    this._categories = [this._platforms, this._gem, this._dummies, this._shine, this._combo];
},

reset : function(){
  for(var Id in this._platforms){
    this._platforms[Id].kill();
  }
  for(var Id in this._gem){
    this._gem[Id].kill();
  }
  for(var Id in this._shine){
    this._shine[Id].kill();
  }
  Background.reset();
  this._platforms.push(new Platform(1, true, 300, 500));
},

/*
resetGameOver : function(){
    for(var Id in this._platforms){
      this._platforms[Id].kill();
    }
    for(var Id in this._gem){
      this._gem[Id].kill();
    }
    for(var Id in this._shine){
      this._shine[Id].kill();
    }
    for(var Id in this._dummies){
        this._dummies[Id].kill();
      }
    this.init();
    Background.reset();
  },
*/


init: function() {
    this._platforms.push(new Platform(1, true, 300, 500));
    this._dummies.push(new Kall());
},

// Platform functions \\
platSet1:function(makeGem){
    // xExtra is extra distance between platforms, based on unicorns vel
    // only added to platforms that dont spawn at x1
    var xExtra = this.getMainCharacter().getDefVelX()*10;
    console.log(this.getMainCharacter().getDefVelX()*10)
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1 + 550 + xExtra;
    var y1 = 500;
    var y2 = 220;
    this._platforms.push(new Platform(1,true,x1, y1));
    this._platforms.push(new Platform(4,false,x2,y2));
    if (makeGem <= 8) this._gem.push(new Gem(x2,y2,4));
    this._shine.push(new Shine(x1,y1,1));
},

platSet2:function(makeGem){
    // xExtra is extra distance between platforms, based on unicorns vel
    // only added to platforms that dont spawn at x1
    var xExtra = this.getMainCharacter().getDefVelX()*10;
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1;
    var x3 = x1+1000 + xExtra;
    var y1 = 450;
    var y2 = 130;
    var y3 = 1;
    this._platforms.push(new Platform(4,false,x2,y2));
    this._platforms.push(new Platform(1,false,x1, y1));
    this._platforms.push(new Platform(4,true,x3,y3));
    if (makeGem <= 8) this._gem.push(new Gem(x2,y2,4));
    this._shine.push(new Shine(x3,y3,4));
    this._shine.push(new Shine(x1+1000,y1,1));
},

platSet3:function(makeGem){
    var x = camera.getPos().posX + g_canvas.width;
    var mainY = 400;
    this._platforms.push(new Platform(1,true,x, mainY));
    if (makeGem <= 8) this._gem.push(new Gem(x,mainY,1));
    this._shine.push(new Shine(x,mainY,1));
},

platSet4:function(makeGem){
    // xExtra is extra distance between platforms, based on unicorns vel
    // only added to platforms that dont spawn at x1
    var xExtra = this.getMainCharacter().getDefVelX()*10;
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1+800+xExtra;
    var x3 = x1+1400+xExtra;
    var y1 = 450;
    var y2 = 350;
    var y3 = 250;
    this._platforms.push(new Platform(4,false,x1,y1));
    this._platforms.push(new Platform(5,false,x2, y2));
    this._platforms.push(new Platform(3,true, x3, y3));
    if (makeGem <= 8) this._gem.push(new Gem(x2,y2,5));
    this._shine.push(new Shine(x3,y3,3));
},

platSet5:function(makeGem){
    // xExtra is extra distance between platforms, based on unicorns vel
    // only added to platforms that dont spawn at x1
    var xExtra = this.getMainCharacter().getDefVelX()*10;
    var x1 = camera.getPos().posX + g_canvas.width;
    var x2 = x1+500+xExtra;
    var x3 = x1+1000+xExtra;
    var y1 = 330;
    var y2 = 230;
    this._platforms.push(new Platform(3,false,x1,y1));
    this._platforms.push(new Platform(7,false,x2,y2));
    this._platforms.push(new Platform(2,true, x3,y2));
    if (makeGem <= 8) this._gem.push(new Gem(x2,y2,7));
    this._shine.push(new Shine(x3,y2,2));
},


setPlatforms: function(){
    //TODO nota þetta sem viðmið hvaða platform er verið að nota.
    var a = Math.floor(util.randRange(1,5));
    var plats = Math.floor(util.randRange(0,16));
    //creates a random number, when the number is 1 we create a gem and butterfly
    var makeGem =  Math.floor(util.randRange(0,10));
    //var makeButterfly =  1;/*Math.floor(util.randRange(0,2));*/

    for(var entity in this._platforms){

        var platX = this._platforms[entity].getPos().posX;
        var platWidth =this._platforms[entity].getWidth();
        var primary = this._platforms[entity].getPrimary();
        if(primary 
           && platX + platWidth <= camera.getPos().posX+500-(this.getMainCharacter().getDefVelX()*10)
           && !this._platforms[entity].getPlatformPushed())
           {
            this._platforms[entity].setPlatformPushed();

            if(plats >= 13) { this.platSet1(makeGem); }
            else if( plats >= 9) { this.platSet2(makeGem); }
            else if(plats >=6) { this.platSet3(makeGem); }
            else if(plats >=3) { this.platSet4(makeGem); }
            else{ this.platSet5(makeGem); }

            if (Shine.isCaught) {
                this._combo.push(new Combo(a));
            }
        }
    }
},


getMainCharacter : function(){
  return this._dummies[0];
},

update: function(du) {

    // TODO
    if (this.didDie) return;
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

    if (this.didDie) return;

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
