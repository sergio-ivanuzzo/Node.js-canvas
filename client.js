// внимание, переменные player, slime, map я вынес за функцию jQuery, дабы сделать ее доступной
// в других скриптах

var player, slime, map;

$(function() {
  
  var url = "http://localhost:9000";
  var canvas = $("canvas");
  var context = canvas.get(0).getContext("2d")
  var x = 10;
  var y = 10;
  
  // прозрачность
  //context.globalAlpha = 0.5

  $("body").on("keypress", function(e) {
    if (e.which == 119) {
      player.draw("north")
    } else if (e.which == 115) {
      player.draw("south")
    } else if (e.which == 97) {
      player.draw("west")
    } else if (e.which == 100) {
      player.draw("east")
    }
  })
  
  function draw(direction) {
    // clear
    map.draw()
    player.draw(direction)
    AI()
  }
  
  function AI() {
    var direction = ["north", "south", "west", "east"]
    var index = getRandomInt(0, direction.length)
    slime.draw(direction[index])
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // в отличие от прошлого кода - здесь новый параметр name
  // который я буду передавать в ajax запросе с каждой перерисовкой
  // для отслеживания изменения координат
  function Entity(name, color, x, y, width, height, speed, image) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(direction) {
      if (direction == "north") {
        if (this.y - this.speed > 0) this.y -= this.speed;
      } else if (direction == "south") {
        if (this.y + this.speed + this.height < canvas.height()) this.y += this.speed;
      } else if (direction == "west") {
        if(this.x - this.speed > 0) this.x -= this.speed;
      } else if (direction == "east") {
        if (this.x + this.width + this.speed < canvas.width()) this.x += this.speed;
      }
      
      if (image) {
        var pic = new Image()
        pic.src = image
        context.drawImage(pic, this.x, this.y, this.width, this.height)
      } else {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height)  
      }

      $.ajax({
          url: url + "/redraw",
          method: "POST",
          data: JSON.stringify({
              uid: this.name,
              x: this.x,
              y: this.y
          })
      })
    }
  }

  var slimeImage = "http://hydra-media.cursecdn.com/minecraft.gamepedia.com/thumb/3/38/Slime.png/150px-Slime.png?version=a77c30fa96f4b2c79fecd73a9852225c";
  var playerImage = "http://vignette2.wikia.nocookie.net/minecraft/images/1/18/Mcsteve90dturn.png/revision/latest?cb=20140516022432"
  var appleImage = "http://hydra-media.cursecdn.com/minecraft.gamepedia.com/7/73/Apple2.png?version=cb63e60bbdc0be5d6829b9a8668283d8"
  
  map = new Entity("map", "white", 0, 0, canvas.width(), canvas.height(), null)  
  player = new Entity("player", "red", 10, 15, 15, 25, 7, playerImage)
  slime = new Entity("slime", "lightgreen", canvas.width()/2, canvas.height()/2, 30, 30, 0.7, slimeImage)
  setInterval(function() {draw()}, 500)
})
