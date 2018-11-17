// =====
// SCORE
// =====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var score = {
    // Counter for the score and variable for how fast it should go up.
    currentScore : 0,
    scoreSpeed : 2.5,

    // Variables for the combos, what the current combo is, how many combos the
    //    player has got in a row.
    shineCombo : 0,
    shineInRow : 0,

    gemCombo : 0,
    gemsInRow : 0,

    // Did the player get the last shine/last gem?
    gotLastShine : false,
    gotLastGem : false,

    // Convert times from milliseconds to "nominal" time units.
    lifeSpan : 1000 / NOMINAL_UPDATE_INTERVAL,

    updateScore : function (du) {
      // Update the score
      this.currentScore += Math.floor(this.scoreSpeed * du);
    },

    updateShine : function (du) {
      // Decrease the lifespan.
      this.lifeSpan -= du;
      //console.log(this.lifeSpan);
    },

    calculateShineCombo : function () {
      if (this.gotLastShine) {
        this.shineInRow++;
        this.shineCombo += 10;
        this.currentScore += this.shineCombo;
        console.log(this.shineInRow);
        console.log(this.shineCombo);
      } else if (!this.gotLastShine) {
        this.shineInRow = 1;
        this.shineCombo = 0;
        this.currentScore += this.shineCombo;
      }
    },

    calculateGemCombo : function () {
      if (this.gotLastGem) {
        this.gemsInRow++;
        this.gemCombo += 100;
        this.currentScore += this.gemCombo;
        console.log(this.gemsInRow);
        console.log(this.gemCombo);
      } else if (!this.gotLastGem) {
        this.gemsInRow = 1;
        this.gemCombo = 0;
        this.currentScore += this.gemCombo;
      }
    },

    drawShineCombo : function (ctx, xPos, yPos) {
      ctx.font = "bold 40px Consolas";
      ctx.textAlign = "center";

      // Color of the combo text
      ctx.fillStyle = "white";
    
      // Color of the shadow
      ctx.shadowColor = '#1c5e66';
      ctx.shadowBlur = 40;

      var fadeThresh = this.lifeSpan / 3;

      if (this.lifeSpan < fadeThresh) {
          ctx.globalAlpha = this.lifeSpan / fadeThresh;
      }

      // Draw the combo text
      if (this.lifeSpan > 0) {
        ctx.fillText(this.shineCombo, xPos, yPos);
      }
      
      ctx.fill();

      ctx.globalAlpha = 1;

      // Make sure the shadow is only applied to the combo
      ctx.shadowBlur = 0;
    },

    drawGemCombo : function (ctx, xPos, yPos) {
      ctx.font = "bold 40px Consolas";
      ctx.textAlign = "center";

      // Color of the combo text
      ctx.fillStyle = "white";
    
      // Color of the shadow
      ctx.shadowColor = '#1c5e66';
      ctx.shadowBlur = 40;

      var fadeThresh = this.lifeSpan / 3;

      if (this.lifeSpan < fadeThresh) {
          ctx.globalAlpha = this.lifeSpan / fadeThresh;
      }

      // Draw the combo text
      if (this.lifeSpan > 0) {
        ctx.fillText(this.gemCombo, xPos, yPos);
      }
      
      ctx.fill();

      ctx.globalAlpha = 1;

      // Make sure the shadow is only applied to the combo
      ctx.shadowBlur = 0;
    },

    drawScore : function (ctx) {
      ctx.font = "bold 40px Consolas";
      ctx.textAlign = "center";
    
      // Color of the score
      ctx.fillStyle = "white";
    
      // Color of the shadow
      ctx.shadowColor = '#1c5e66';
      ctx.shadowBlur = 40;
    
      // Draw the score if the game is not over
      if (!main._isGameOver) {
        ctx.fillText(this.currentScore, g_canvas.width / 2 + camera.getPos().posX - 20,
                                70 + camera.getPos().posY);
      } else if (main._isGameOver) {
        // VIRKAR EKKI, IMPLEMENTA Á ANNAN HÁTT
        ctx.fillText("You got " + this.currentScore + "points", g_canvas.width / 2 - 20, 70);
      }
    
      ctx.fill();
    
      // Make sure the shadow is only applied to the score
      ctx.shadowBlur = 0;
    }

}