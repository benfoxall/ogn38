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
  function body_css(prop, value){
    body.style[prop] = value
  }

  // var html = document.getElementsByTagName('html')[0];
  // function html_className(className){
  //   html.className = className
  // }
  // function html_css(prop, value){
  //   html.style[prop] = value
  // }




  // create the talk object
  function Talk(){
    // intro(this);
    // flashing(this);

    // locationIntro(this);
    // locationGeneral(this);
    // inputLocation(this);
    // locationSpecific(this);

    // screenShare(this);

    movement(this);
  }



  /****
  The Content
  ****/

  // Content
  function intro(talk){
    talk.queue(function(){
      body_className('')
    })

    talk.slide('hello')
    talk.pause(20000)

    talk.slide('demos')
    talk.pause(15000)
    talk.fragment()
    talk.pause(15000)

    talk.slide('title')
    talk.pause(5000)
    talk.fragment()
    talk.pause(30000)

    talk.slide('meta')
    talk.pause(30000)

    talk.slide('sync-intro')
    talk.pause(15000)

    talk.slide('sync-web')
    talk.pause(8000)
    talk.fragment()
    talk.pause(4000)
    talk.fragment()
    talk.pause(4000)
    talk.fragment()
    talk.pause(20000)

    talk.slide('sync-environment')
    talk.pause(8000)
    talk.fragment()
    talk.pause(10000)
    talk.fragment()
    talk.pause(10000)
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

    talk.queue(function(){
      body_css('background','')
    })
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
    talk.pause(15000)

    talk.slide('location-world')
    talk.pause(10000)

    talk.fragment()
    talk.pause(7000)
    
    talk.fragment()
    talk.pause(10000)

  }

  function locationGeneral(talk){
    talk.queue(function(){
      body_className('map')
    })
    talk.slide('orientation-align')

    talk.pause(10000)

    talk.queue(display(places.pheonix, true))
    talk.queue(function(){
      body_className('content-hidden direction')
    })
    talk.pause(6000)

    talk.queue(display(places.pitt_rivers))
    talk.pause(6000)

    talk.queue(display(places.wo))
    talk.pause(6000)

    talk.queue(display(places.st_clements))
    talk.pause(6000)

    talk.queue(display(places.castle))
    talk.pause(6000)

    talk.queue(display(places.big_ben))
    talk.pause(6000)

    talk.queue(display(places.jsac))
    talk.pause(6000)

  }

  function inputLocation(talk){

    talk.queue(function(){
      body_className('')
    })

    talk.slide('location-align')

    talk.pause(6000)

    talk.queue(function(){
      body_className('content-hidden')
    })

    talk.queue(function(){
      locator.start()
    })

    talk.pause(15000)

    talk.queue(function(){
      locator.stop()
    })

    talk.pause(4000)

  }

  function locationSpecific(talk){

    talk.queue(function(){
      body_className('content-hidden xmap direction')
    })

    talk.queue(display(places.jt, true))
    talk.pause(6000)

    talk.queue(display(places.jt_bar))
    talk.pause(6000)

    // talk.queue(display(places.jt_bar_pump_left))
    // talk.pause(6000)

    // talk.queue(display(places.jt_bar_pump_right))
    // talk.pause(6000)

    talk.queue(display(places.jt_centre))
    talk.pause(6000)

    talk.queue(display(places.jt_corner))
    talk.pause(6000)

    talk.queue(display(places.jt_round_corner))
    talk.pause(6000)

    talk.queue(display(places.jt_round_pillar))
    talk.pause(6000)

    talk.queue(display(places.jt_stage))
    talk.pause(6000)


  }

  function screenShare(talk){
    talk.queue(function(){
      body_className('')
      // to it doesn't transition weird
      body_css('backgroundSize', '100%')
    })

    talk.slide('lets-do-stuff')
    talk.pause(10000)

    talk.slide('screensharing')
    talk.pause(5000)
    talk.queue(function(){
      body_className('screensharing')
    })

    talk.pause(10000)

    talk.queue(function(){
      body_css('backgroundSize', '1000%')
      body_css('backgroundPosition', (x*100) + '% ' + (y*100) + '%')
    })


    talk.pause(20000)

    talk.queue(function(){
      body_className('content-hidden no-transition')
      body_css('backgroundColor', '#000')
    })

    talk.pause(15000)


    // hsl up
    talk.queue(
      new TWEEN.Tween({h:0,s:1,l:0})
        .to({h:y * 120,s:1,l:0.5}, 5000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,this.s,this.l));
        })
    )

    talk.pause(10000)

    // hsl across
    talk.queue(
      new TWEEN.Tween({h:y * 120,s:1,l:0.5})
        .to({h:x * 120,s:1,l:0.5}, 5000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,this.s,this.l));
        })
    )

    talk.pause(10000)

    // back to black
    talk.queue(
      new TWEEN.Tween({h:x * 120,s:1,l:0.5})
        .to({h:0,s:0,l:0}, 5000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,this.s,this.l));
        })
    )

    talk.pause(10000)


  }



  function movement(talk){
    // console.log(x,y)
    var a    = Math.atan2(x-.5, y-.5);
    if(a < 0){
      a   = (a + Math.PI*2);// 0 -> Math.PI*2
    }

    talk.queue(function(){
      body_className('no-transition')
      // body_css('backgroundColor', '#000')
    })

    talk.slide('movement')
    talk.pause(10000)

    talk.slide('blank')


    this.pause(10000)

    // hsl across (static)
    talk.queue(
      new TWEEN.Tween({h:0,s:1,l:0})
        .to({h:x * 120,s:1,l:0.5}, 4000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,this.s,this.l));
        })
    )

    // hsl across + back (moving)
    talk.queue(
      new TWEEN.Tween({h:x * 120,s:1,l:0.5})
        .to({h:(x * 120)+240,s:1,l:0.5}, 10000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,this.s,this.l));
        })
        .repeat(1)
        .yoyo(true)
    )

    talk.queue(
      new TWEEN.Tween({h:x * 120,s:1,l:0.5})
        .to({h:0,s:0,l:0}, 5000)
        .onUpdate(function() {
          bg(hsl_basic(this.h,this.s,this.l));
        })
    )


    // black/white

    this.pause(3000)

    // 'on' up (and back)
    talk.queue(
      new TWEEN.Tween({t:1})
        .to({t:0}, 2500)
        // .onStart(master ? function(){play('spiral')} : noop)
        .onUpdate(function() {
          bg(grey(this.t < y ? 1 : 0));
        })
        .repeat(1)
        .yoyo(true)
    )

    // 'on' left (and back)
    talk.queue(
      new TWEEN.Tween({t:1})
        .to({t:0}, 2500)
        // .onStart(master ? function(){play('spiral')} : noop)
        .onUpdate(function() {
          bg(grey(this.t < x ? 1 : 0));
        })
        .repeat(1)
        .yoyo(true)
    )

    // 'on' right (and back)
    talk.queue(
      new TWEEN.Tween({t:1})
        .to({t:0}, 2500)
        // .onStart(master ? function(){play('spiral')} : noop)
        .onUpdate(function() {
          bg(grey(this.t < (1-x) ? 1 : 0));
        })
        .repeat(1)
        .yoyo(true)
    )

    // this.footerHTML("rotation")

    this.pause(5000)

    // 'on' rotate
    talk.queue(
      new TWEEN.Tween({a:-1})
        .to({a:(Math.PI*2)}, 7000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
          bg(grey(a > this.a ? 0 : 1));
        })
    )


    // 'off' rotate
    talk.queue(
      new TWEEN.Tween({a:0})
        .to({a:(Math.PI*2)+1}, 4000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
          bg(grey(a > this.a ? 1 : 0));
        })
    )


    this.pause(5000)



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