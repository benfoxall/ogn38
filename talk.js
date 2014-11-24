(function(exports){

  // TODO inline content
  function slideContent(key){
    var el = document.querySelector('[data-slide='+key+']')
    return el ? el.innerHTML : 'no content for ' + key;
  }

  // This generates a stepper that I can only really describe when
  // I'm at a whiteboard and have three different coloured pens
  function generateStepper(steps, initial){
    var c = steps * initial * 2 * Math.PI;
    return function(i){
      return (-Math.cos((~~(i * steps)+1) * i * c) + 0.5)
    }
  }

  var stepper = generateStepper(5,1);
  var stepper10 = generateStepper(1,6);


  // 0->1, #000000 -> #ffffff
  function grey(v){
    
    // snap to black/white
    v = v < 0.2 ? 0 : v > 0.8 ? 1 : v

    var g = (~~(v*255)).toString(16);

    if(g.length == 1) g = '0' + g;

    return '#' + g + g + g;
  }

  // h - [0,360], s - [0,1], l - [0,1]
  function hsl_basic(h,s,l){
    h = h % 360; // s = s % 1; l = l % 1;
    return 'hsl('+Math.round(h)+', '+Math.round(s*100)+'%, '+(l*100)+'%)'
  }

  var body = document.getElementsByTagName('body')[0];
  function bg(color){
    body.style.background = color;
  }
  function body_className(className){
    body.className = className
  }




  // create the talk object
  function Talk(){
    intro(this);
    flashing(this);

    locationIntro(this);
    locationGeneral(this);
    inputLocation(this);
    locationSpecific(this);

    // TODO
    // screenShare(this);

  }



  /****
  The Content
  ****/

  // Content
  function intro(talk){

    talk.slide('hello')
    talk.pause(20000)

    talk.slide('demos')
    talk.pause(15000)
    talk.fragment()
    talk.pause(15000)

    talk.slide('title')
    talk.pause(15000)
    talk.fragment()
    talk.pause(20000)

    talk.slide('meta')
    talk.pause(15000)

    talk.slide('sync-intro')
    talk.pause(15000)

    talk.slide('sync-web')
    talk.pause(15000)
    talk.fragment()
    talk.pause(5000)
    talk.fragment()
    talk.pause(5000)
    talk.fragment()
    talk.pause(20000)

    talk.slide('sync-environment')
    talk.pause(15000)
    talk.fragment()
    talk.pause(5000)
    talk.fragment()
    talk.pause(5000)
    talk.fragment()
    talk.pause(20000)

    talk.slide('warning')
    talk.pause(15000)

  }

  function flashing(talk){
    talk.queue(function(){
      body_className('no-transition content-hidden')
    })

    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 20000)
        .onUpdate(function() {
          bg(grey(stepper10(this.t)));
        })
    )

    talk.queue(
      new TWEEN.Tween({t:0,h:0})
        .to({t:1,h:360}, 6000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,1,0.3*stepper10(this.t)));
        })
    )
    talk.queue(
      new TWEEN.Tween({t:0,h:360})
        .to({t:1,h:0}, 6000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,1,0.3*stepper10(this.t)));
        })
    )
  }

  function locationIntro(talk){

    talk.queue(function(){
      body_className('')
    })

    talk.slide('location-intro')
    talk.pause(15000)

    talk.slide('location-web')
    talk.pause(5000)

    talk.fragment()
    talk.pause(5000)

    talk.fragment()
    talk.pause(5000)

    talk.slide('location-world')
    talk.pause(10000)

    talk.fragment()
    talk.pause(7000)
    
    talk.fragment()
    talk.pause(5000)

  }

  function locationGeneral(talk){
    // talk.queue(function(){
    //   body_className('content-hidden map')
    // })

    // talk.pause(10000)

    talk.queue(function(){
      body_className('content-hidden map direction')
    })

    talk.pause(10000)

    talk.queue(display(places.pheonix))

    talk.pause(10000)

    talk.queue(display(places.pri))

    talk.pause(10000)

    talk.queue(display(places.big_ben))

    talk.pause(10000)
  }

  function inputLocation(talk){

    talk.queue(function(){
      body_className('content-hidden')
    })

    talk.pause(5000)

    talk.queue(function(){
      locator.start()
    })

    talk.pause(15000)

    talk.queue(function(){
      locator.stop()
    })

    talk.pause(5000)

  }

  function locationSpecific(talk){
    // talk.queue(function(){
    //   body_className('content-hidden map')
    // })

    // talk.pause(10000)

    talk.queue(function(){
      body_className('content-hidden xmap direction')
    })

    talk.pause(10000)

    talk.queue(display(places.jt_bar))

    talk.pause(10000)

    talk.queue(display(places.jt_centre))

    talk.pause(10000)

    talk.queue(display(places.jt_stage))

    talk.pause(10000)

  }



  /****
  Support
  ****/

  Talk.prototype.slide = function(key) {
    this.queue(function(){
      document.getElementById('content').innerHTML = slideContent(key)  
    })
  }

  Talk.prototype.fragment = function(key) {
    this.queue(function(){
      // find the next inactive fragment and display
      var fragments = document.getElementsByClassName('fragment');
      if(fragments[0]){
        fragments[0].className = 'fragment-active'
      }
    })
  }


  Talk.prototype.blank = Talk.prototype.pause = function(millis){
    this.queue(
      new TWEEN.Tween({t:0})
      .to({t:1}, millis)
    )
  }

  Talk.prototype.queue = function(tween){

    if(!(tween instanceof TWEEN.Tween)){
      // wrap up in a 100ms tween
      var tween2 = new TWEEN.Tween({t:0})
                  .to({t:1}, 100)
                  .onStart(tween);

      tween = tween2;
    }

    if(!this.firstTween) 
      return this.firstTween = this.lastTween = tween

    this.lastTween.chain(this.lastTween = tween)
  }

  Talk.prototype.cancel = function(){
    TWEEN.removeAll();
    stopRendering();
  }

  Talk.prototype.start = function(){
    this.firstTween.start();
    startRendering();
  }


  // a global rendering thing (calls tween update on rAF)
  var isRendering, kill;
  function startRendering(){
    if(isRendering) return;
    isRendering = true; kill = false; 
    render()
  }
  function stopRendering(){
    if(!isRendering) return;
    kill = true;
  }

  function render(){
    if(kill) return kill = isRendering = false;
    requestAnimationFrame(render);

    TWEEN.update();
  }


  return exports.Talk = Talk;



})(this);