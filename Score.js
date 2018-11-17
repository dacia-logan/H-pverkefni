// =====
// SCORE
// =====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var score = {
    // Counter for the score and variable for how fast it should go up
    currentScore : 0,
    scoreSpeed : 2.5,

    combo = 0,

    // Convert times from milliseconds to "nominal" time units.
    lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL,

  update : function (du) {
    // Decrease the lifespan
    this.lifeSpan -= du;

    // Update the score
    this.currentScore += Math.floor(this.scoreSpeed * du);
  },

  drawCombo : function (ctx, xPos, yPos) {
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
      ctx.fillText(this.score, g_canvas.width / 2 + camera.getPos().posX - 20,
                              70 + camera.getPos().posY);
    } else if (main._isGameOver) {
      // VIRKAR EKKI, IMPLEMENTA Á ANNAN HÁTT
      ctx.fillText("You got " + this.currentScore + "points", g_canvas.width / 2 - 20, 70);
    }
  
    ctx.fill();
  
    // Make sure the shadow is only applied to the score
    ctx.shadowBlur = 0;
  },

  render : function (ctx) {
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
  }

}

/*
  
    this.comboLifeSpan -= du;
  
   // var fadeThresh = this.comboLifeSpan / 3;
    var lifespanNow = this.comboLifeSpan;
  
  
  
    lifespanNow
  
  
      if (this.comboLifeSpan < fadeThresh) {
          ctx.globalAlpha = this.comboLifeSpan / fadeThresh;
      }
  
      ctx.globalAlpha = 1;
  };

  */


/*
Score.prototype.render = function (ctx) {

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
*/