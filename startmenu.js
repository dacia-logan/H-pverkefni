var startmenu = {
  startGame : false,
  framecounter : 0,
  alpha : 1,
  alphaChanger : 0.01,
  fontsize : 58,

  drawMenu : function(ctx){
    if (!this.startGame) {
      this.framecounter+=0.2;
      g_menuSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,camera.getPos().posX,camera.getPos().posY,g_canvas.width+50, g_canvas.height+50);
      if (this.framecounter>38) {
          this.framecounter=0;
      }
      ctx.globalAlpha=this.alpha;
      ctx.font = "bold "+ this.fontsize +"px Consolas";
      ctx.textAlign = "center";
      ctx.fillStyle ='white';
      ctx.shadowBlur=4;
      ctx.fillText("Press A to start your adventure",600,610);
      this.alpha-=this.alphaChanger;
      if (this.alpha<=0.3 || this.alpha>1) {
        this.alphaChanger*=-1;
      }
      ctx.globalAlpha=1;
    }
    },
    song : function(){
      if (this.startGame) {
        g_sounds.INTRO.pause();
      }
      else {
        if (g_sounds.INTRO.currentTime>220) {
          g_sounds.INTRO.currentTime=117;
        }
        g_sounds.INTRO.play();
      }
    }

}
