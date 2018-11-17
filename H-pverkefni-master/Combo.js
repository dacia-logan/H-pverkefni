// =====
// COMBO
// =====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

function Combo(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.x = Kall.x;
    this.y = Kall.y;

    this.combo = 0;  
};

Combo.prototype = new Entity();
    
// Convert times from milliseconds to "nominal" time units.
Combo.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Combo.prototype.update = function (du) {

    // Unregister
    spatialManager.unregister(this);

    // Check for death, if death, kill entity
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    // (Re-)Register
    spatialManager.register(this);
};

Combo.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    ctx.font = "bold 40px Consolas";
    ctx.textAlign = "center";

    // Color of the combo text
    ctx.fillStyle = "white";
  
    // Color of the shadow
    ctx.shadowColor = '#1c5e66';
    ctx.shadowBlur = 40;

    // Draw the combo text
    ctx.fillText("10", xPos, yPos);
    
    ctx.fill();

    // Make sure the shadow is only applied to the combo
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 1;
};