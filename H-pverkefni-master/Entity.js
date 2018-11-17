
// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();
    // I am not dead yet!
    this._isDeadNow = false;
};

Entity.prototype.setPos = function (x, y) {
    this.x = x;
    this.y = y;
};

Entity.prototype.getPos = function () {
    return {posX : this.x, posY : this.y};
};

Entity.prototype.getWidth = function () {
    return this.width;
};

Entity.prototype.getHeight = function () {
    return this.height;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.getType = function(){
    return this.type;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

//ÞETTA ER PRUFA TIL AÐ REYNA AÐ EIGA VIÐ COMBOIÐ
Entity.prototype.lostCombo = function() {
    this.hasRainbowCombo = false; 
    this.combo = 0; 
};

Entity.prototype.findHitEntity = function () {
    
    var pos = this.getPos();
    var w = this.getWidth();
    var h = this.getHeight();

    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.radius()
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};


Entity.prototype.wrapPosition = function () {
    this.x = util.wrapRange(this.x, 0, g_canvas.width);
    this.y = util.wrapRange(this.y, 0, g_canvas.height);
};