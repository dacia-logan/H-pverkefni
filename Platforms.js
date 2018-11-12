function Platform(descr, p, x, y) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.y = y || Math.floor(util.randRange(300, 520));
    this.x = x || camera.getPos().posX + g_canvas.width;             // position of the images

    this.vx = 5;                        // vel

    this.primary = p || false;
    this.plat = descr;
    this.platformPushed=false;

    if(descr===1){

        this.width = g_images.large.width*2.2/1.5;
        this.height = g_images.large.height*1.5/1.5;
    }

    else if(descr===2){

        this.width = g_images.normal1.width*2/1.5;
        this.height = g_images.normal1.height*1.7/1.5;

    }

    else if(descr===3){

        this.width = g_images.normal2.width*1.9/1.5;
        this.height = g_images.normal2.height*1.6/1.5;

        
        }

    else if(descr===4){

        this.width = g_images.normal3.width*2/1.5;
        this.height = g_images.normal3.height*1.4/1.5;
        
    }

    else if(descr===5){

        this.width = g_images.small.width*1.4/1.5;
        this.height = g_images.small.height*1.3/1.5;

    }

    else if(descr===6){

        this.width = g_images.esmall.width*1.6/1.5;
        this.height = g_images.esmall.height*1.6/1.5;

    }
    

    this.type = "Platform";

};

Platform.prototype = new Entity();


Platform.prototype.setPlatformPushed = function(){
    this.platformPushed = !this.platformPushed;
};

Platform.prototype.getPlatformPushed = function(){
    return this.platformPushed;
};

Platform.prototype.getPrimary = function(){
    return this.primary;
}

Platform.prototype.getSpeed = function(){
    return this.vx;
}

Platform.prototype.update = function(du){

    spatialManager.unregister(this);

  
    this.x-=this.vx*du;
    if(this.x <= -this.width){
        this.kill();
    }

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    else  spatialManager.register(this);

    
};


Platform.prototype._spawnPlatform = function () {
   
};

Platform.prototype.drawPlat = function(ctx){
  
if(this.plat===1){
    g_platforms.large.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===2){
    g_platforms.normal1.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===3){
    g_platforms.normal2.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===4){
    g_platforms.normal3.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===5){
    g_platforms.small.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===6) {
    g_platforms.esmall.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}
    
};

Platform.prototype.render = function(ctx){

    // Only draw the platforms if the game is not over
    if (!main._isGameOver) {
        this.drawPlat(ctx);
    }

}
