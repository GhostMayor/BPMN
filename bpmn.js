var background = document.getElementById('background');
var front = document.getElementById('front');
var tools = document.getElementById('tools');
tools.style.display = 'none';
var print = console.log;
var ctx_back
var ctx_front
var positionX;
var positionY;
console.log('test test')

var moveElement
var obj = []

class Tooltip{
  constructor(args){
    this.x = args.x || 0;
    this.y = args.y || 0;


    this.div = args.div || document.getElementById('tools');
    this.div.addEventListener('click',function(){
      print('test')
      e.preventDefault();
    })
    // this.display = 'none';
    this.redraw = this.redraw.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }


  show(x,y,args){
    this.div.style.top = x + "px";
    this.div.style.left = y + "px";
    this.div.style.display = 'block';

  }
  hide(){
    this.div.style.display = 'none';

  }
  redraw(){

  }
}

window.showDiwTools = function(x,y){
  tools.style.top = y + 'px';
  tools.style.left = x + 'px';
  tools.style.display = 'block';
}

class rect {
  constructor(args){
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.ctx = args.ctx;
    this.name = args.name || "";

    this.move = this.move.bind(this);
    this.render = this.render.bind(this);
    this.y1 = this.y1.bind(this);
    this.x1 = this.x1.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.render();
    obj.push(this);
    this.id = obj.length
  }
  render(){
    this.ctx.fillStyle = 'orange';
    this.ctx.beginPath()
    this.ctx.rect(this.x,this.y,this.width,this.height);
    this._out = [];
    this._in = [];

    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.fillStyle = 'black';
    this.ctx.font = "16px Verdana";
    this.ctx.fillText(this.name,
    this.x,
    this.y + (this.y1() - this.y)/2)
  }
  x1(){
    return this.x + this.width;
  }
  y1(){
    return this.y + this.height;
  }
  move(dx,dy){
    this.ctx.clearRect(this.x,
                       this.y,
                       this.width,
                       this.height);

    this.ctx.Collizion(this.x,this.y,this.x1(),this.y1(),this.id);

    this.x -= dx;
    this.y -= dy;

    this.render();
  }

  moveTo(x,y,width,height){
      width = width || this.width;
      height = height || this.height;

      this.ctx.clearRect(this.x,
                         this.y,
                         this.width,
                         this.height);

      this.ctx.Collizion(this.x,this.y,this.x1(),this.y1(),this.id);
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.render();
  }
}

front.addEventListener('dblclick',function(e){
  tooltip.show(e.clientY,e.clientX);
  // new rect({x:e.layerX,y:e.layerY,width:150,height:100,ctx:ctx_front,name:"Test Block"});
})

front.addEventListener('mousedown',function(e){
  switch (e.buttons) {
    case 1:
          for (var i = 0; i < obj.length; i++) {
            if (e.clientX >= obj[i].x &&
              e.clientX <= obj[i].x1() &&
              e.clientY >= obj[i].y &&
              e.clientY <= obj[i].y1())
              {
                moveElement = obj[i];
                return;
              }
          };
          positionX = e.clientX;
          positionY = e.clientY;
      break;
    case 2:

      break;
  }
  e.preventDefault();

})


front.addEventListener('mouseup',function(e){
  moveElement = undefined;
  positionX = undefined;
  positionY = undefined;
})

front.addEventListener('mousemove',function(e){
  if(moveElement){
    window.requestAnimationFrame(()=>{
      moveElement.moveTo(e.clientX,e.clientY);
    });
    return;
  }

  if(!moveElement && positionX && positionY){
    for (var i = 0; i < obj.length; i++) {
      obj[i].move(Math.round((positionX - e.clientX)/2) , Math.round((positionY - e.clientY)/2));
    }
    positionX = e.clientX;
    positionY = e.clientY;
  }
})

function Init(){
  background.width = window.innerWidth;
  background.height = window.innerHeight;
  ctx_back = background.getContext('2d');
  front.width = window.innerWidth;
  front.height = window.innerHeight;
  ctx_front = front.getContext('2d');
  document.getElementById('nav').addEventListener("click",function(e){e.preventDefault()})
  window.addEventListener('resize',function(){
    front.width = window.innerWidth;
    front.height = window.innerHeight;
    front.ReRender();
    background.width = window.innerWidth;
    background.height = window.innerHeight;
  })
  front.ReRender = function(){
    for (var i = 0; i < obj.length; i++) {
      obj[i].render();
    }
  }

  ctx_front.Collizion = function(x,y,x1,y1,id){
    for (var i = 0; i < obj.length; i++) {
      if(obj[i].id != id){
        if (obj[i].x >= x ||
          obj[i].x1()<= x1 ||
          obj[i].y >= y ||
          obj[i].y1() <= y1){
            obj[i].render();
          }
      }
    }
  }
  print('Init Complete.');
}



Init();
var tooltip = new Tooltip({});
