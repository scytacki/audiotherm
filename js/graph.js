function Graph(){
  var ctx;

  this.setup = function setup ( container ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 512; 
    canvas.height = 256; 
    ctx = canvas.getContext( '2d' );

    if (container)
      container.appendChild( canvas );
    else
      document.body.appendChild( canvas );
    return canvas;
  };

  this.draw = function draw(data, offset) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    ctx.clearRect(0,0,512,256); 
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(512,0);
    ctx.stroke();
    ctx.moveTo(0,256);
    ctx.lineTo(512,256);
    ctx.stroke();
    ctx.save();
    ctx.strokeStyle = "#006644";
    ctx.beginPath();
    if (ctx.setLineDash)
      ctx.setLineDash([5]);
    ctx.moveTo(0,64);
    ctx.lineTo(512,64);
    ctx.stroke();
    ctx.moveTo(0,192);
    ctx.lineTo(512,192);
    ctx.stroke();

    ctx.restore();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0,128);
    ctx.lineTo(512,128);
    ctx.stroke();

    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(0,256-data[0]);

    for (var i=offset, j=0; j<(512-offset); i++, j++)
      ctx.lineTo(j,256-data[i]);

    ctx.stroke();
  };

}