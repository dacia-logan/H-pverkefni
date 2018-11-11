var camera = {
  	x : 0,
    y : 0,

    Follow : function (ctx,entity,x,y){
      ctx.translate(-entity.getPos().posX+x,-entity.getPos().posY+y);
      this.x=entity.getPos().posX-x;
      this.y=entity.getPos().posY-y;
    },

    getPos : function(){
      return {posX: this.x, posY: this.y};
    },
    reset : function(ctx){
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
