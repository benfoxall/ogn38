(function(exports){

  var HTMLs;

  /// HARD CODED SLIDE CONTENT
  HTMLs = {"hello":" <h1>Hello, I'm Ben</h1> <div class=\"badges\"> <img src=\"badge-wo-black.png\"> <img src=\"badge-jsoxford.png\"> <img src=\"badge-adventure-club.png\"> </div> ","demos":" <h1>A note about demos…</h1> <h1 class=\"fragment\">…and timing</h1> ","title":" <h1>Getting physical with the web</h1> <h2 class=\"fragment\"> How can we change the way that we build websites by utilising the physical properties and environment of the devices that we browse it with. </h2> ","meta":" <h1>The example we'll cover in this talk is <em>this talk</em></h1> <h2>a web-based, multi-device interaction with our environment</h2> ","sync-intro":" <h1>Device synchronisation</h1> <p>For a multi-device interaction, our devices have to share data</p> ","sync-web":" <h3>Device synchronisation</h3> <h1>with the web</h1> <ul> <li class=\"fragment\">Server sent events</li> <li class=\"fragment\">Web sockets</li> <li class=\"fragment\">WebRTC</li> </ul> ","sync-environment":" <h3>Device synchronisation</h3> <h1>using our environment</h1> <ul> <li class=\"fragment\">Audio</li> <li class=\"fragment\">Visual</li> <li class=\"fragment\">Humans</li> </ul> ","warning":" <h1> <span class=\"icon- warning\">warning</span> Your phone is about to start flashing on and off </h1> ","location-intro":" <h1> Location and orientation </h1> ","location-web":" <h3> Location and orientation </h3> <h1>using the web</h1> <ul> <li class=\"fragment\">Geolocation</li> <li class=\"fragment\">DeviceOrientation</li> </ul> ","location-world":" <h3> Location and orientation </h3> <h1>real world</h1> <h2 class=\"fragment\">…I think you're at the Jericho Tavern <!--(51&deg;45'36.6&quot;N 1&deg;15'59.3&quot;W)--></h2> <h2 class=\"fragment\">…facing the stage</h2> <!-- <h2 class=\"fragment\">&hellip;I can ask you where you're</h2> --> ","orientation-align":" <h1> Line up your phone with the map </h1> ","location-align":" <h1> Line up the map with your phone </h1> ","lets-do-stuff":" <h1> Lets do some things with this stuff </h1> ","screensharing":" <h1> Screensharing </h1> ","movement":" <h1> Movement </h1> ","capability-sharing":" <h1> Capability Sharing </h1> ","capability-combining":" <h1> Capability Combining <br> <small>(turn up your volume)</small> </h1> ","last":" <h1>This was offline</h1> <hr> <h2 class=\"fragment\">upcoming stuff</h2> <h3 class=\"fragment\">Tomorrow - <a target=\"_blank\" href=\"http://www.meetup.com/JSOxford/\">JSOxford</a></h3> <h3 class=\"fragment\">March - <a target=\"_blank\" href=\"http://jqueryuk.com/2015/\">jQueryUK</a></h3> <div class=\"fragment\"> <hr> <h1>Thanks</h1> <ul class=\"hyperlinks\"> <li><a target=\"_blank\" href=\"https://twitter.com/benjaminbenben\"><span class=\"icon-\">twitter</span> benjaminbenben</a></li> <li><a target=\"_blank\" href=\"https://github.com/benfoxall\"><span class=\"icon-\">github</span> benfoxall</a></li> </ul> <p> <a href=\"http://whiteoctober.co.uk\"> <img src=\"badge-wo-red.png\" style=\"width:2.5em\"> </a> </p><p>If you ever need someone to help you with building schematics, ask Gerard</p> <hr> </div> <h3 class=\"fragment\">**press six times to skip to this slide**</h3> ","sound-test":" <h3>Sound test</h3> <button onclick=\"play('bubbles')\">play</button> <hr> <button onclick=\"document.location.reload()\">reset</button> ","blank":" "}


  // TODO inline content
  function slideContent(key){
    if(HTMLs){
      return HTMLs[key] || ('no content for ' + key);
    }

    var el = document.querySelector('[data-slide='+key+']')
    return el ? el.innerHTML : 'no content for ' + key;
  }


  var play = noop;

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = parent.context || new AudioContext();

    var play = window.play = (function(sounds){

        var buffers = {}, firstLoaded, hasPlayed;

        for(sound in sounds){
            if(sounds.hasOwnProperty(sound))
                request(sound, sounds[sound]) // load it
            
        }

        return function play(name){
            if(!name && firstLoaded){
              if(hasPlayed) return;
              hasPlayed = true;

              var buffer = buffers[firstLoaded];
              var source = context.createBufferSource();
              var gainNode = context.createGain();
              gainNode.gain.value = 0.05;
              source.buffer = buffer;
              source.connect(gainNode);
              gainNode.connect(context.destination);

              console.log("playing blank", firstLoaded)

              return;
            }

            var buffer = buffers[name];
            if(buffer){
                  var source = context.createBufferSource();
                  source.buffer = buffer;
                  source.connect(context.destination);
                  source.start(0);
            }
        }

        function request(name,url){
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';

          // Decode asynchronously
          xhr.onload = function() {
            context.decodeAudioData(xhr.response, function(buffer) {
              buffers[name] = buffer;
              if(!firstLoaded) firstLoaded = name;
            }, function(e){
                console.log("an error occured requesting ", url, e)
            });
          }
          xhr.send();
        }
    })({
        'bubbles': '_bubbles.mp3',
        'spiral': '_dotted-spiral.mp3',
        // 'clap': '_clap.mp3',
        // 'ting': '_ting.mp3',
    })

  } catch (e) {
    console.log("couldn't load audio", e)
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
    intro(this);
    flashing(this);

    locationIntro(this);
    locationGeneral(this);
    inputLocation(this);
    locationSpecific(this);

    screenShare(this);

    movement(this);

    capabilitySharing(this)
    capabilityCombining(this);

    last(this)
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
    var a = 0;

    talk.queue(function(){
      a = Math.atan2(x-.5, y-.5);
      if(a < 0){
        a   = (a + Math.PI*2);// 0 -> Math.PI*2
      }

      body_className('no-transition inverse')
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




  function capabilitySharing(talk){

    var master;

    talk.queue(function(){
      master = y < 0.15;

      body_className('no-transition inverse')
      // body_css('backgroundColor', '#000')
    })

    talk.slide('capability-sharing')
    talk.pause(10000)

    talk.slide('blank')


    talk.pause(15000)


    // flash on and off
    for(var i=0; i < 2; i++){

      // on with beat from master
      talk.queue(
        new TWEEN.Tween({t:0})
          .to({t:1}, 500)
          .onStart(function(){if(master)play('bubbles')})
          .onUpdate(function() {
            bg(grey(this.t));
          })
      )

      talk.pause(1500)

      // off with a beat from the master
      talk.queue(
        new TWEEN.Tween({t:1})
          .to({t:0}, 500)
          .onStart(function(){if(master)play('bubbles')})
          .onUpdate(function() {
            bg(grey(this.t));
          })
      )

      talk.pause(3500)
    }


    // on to the right
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 1000)
        .onStart(function(){if(master)play('bubbles')})
        .onUpdate(function() {
          bg(grey(this.t > x ? 1 : 0));
        })
    )
    talk.pause(1000)

    // and back
    talk.queue(
      new TWEEN.Tween({t:1})
        .to({t:0}, 1000)
        .onStart(function(){if(master)play('bubbles')})
        .onUpdate(function() {
          bg(grey(this.t > x ? 1 : 0));
        })
    )
    talk.pause(3000)


    // on to the left
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 1000)
        .onStart(function(){if(master)play('bubbles')})
        .onUpdate(function() {
          bg(grey(this.t > (1-x) ? 1 : 0));
        })
    )
    talk.pause(1000)

    // and back
    talk.queue(
      new TWEEN.Tween({t:1})
        .to({t:0}, 1000)
        .onStart(function(){if(master)play('bubbles')})
        .onUpdate(function() {
          bg(grey(this.t > (1-x) ? 1 : 0));
        })
    )
    talk.pause(3000)



    // on to the top
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 1000)
        .onStart(function(){if(master)play('bubbles')})
        .onUpdate(function() {
          bg(grey(this.t > y ? 1 : 0));
        })
    )
    talk.pause(1000)


    talk.pause(4000)


    // down with fizz
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 2000)
        .onStart(function(){if(master)play('spiral')})
        .onUpdate(function() {
          bg(grey(this.t < y ? 1 : 0));
        })
    )


    talk.pause(5000)
    
    // this.footerHTML("")

  }




  function capabilityCombining(talk){

    var master, a = 0;

    talk.queue(function(){
      master = y < 0.15;

      a = Math.atan2(x-.5, y-.5);
      if(a < 0){
        a   = (a + Math.PI*2);// 0 -> Math.PI*2
      }

      // console.log(a)

      body_className('no-transition inverse')
      // body_css('backgroundColor', '#000')
    })

    talk.slide('capability-combining')
    talk.pause(10000)

    talk.slide('blank')


    talk.pause(15000)



    // sound moving down
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 7000)
        .onStart(function(){
          setTimeout(function(){play('bubbles')}, y*3000)
        })
        .onUpdate(noop)
    )


    talk.pause(4000);

    // sound moving up
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 7000)
        .onStart(function(){
          setTimeout(function(){play('bubbles')}, (1-y)*3000)
        })
        .onUpdate(noop)
    )

    talk.pause(5000);



    // sound moving around
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 10000)
        .onStart(function(){setTimeout(function(){
          play('bubbles');
        }, (a/(Math.PI*2))*10000)})
        .onUpdate(noop)
    )

    // faster
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 5000)
        .onStart(function(){setTimeout(function(){
          play('bubbles');
        }, (a/(Math.PI*2))*5000)})
        .onUpdate(noop)
    )

    // and faster
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 3000)
        .onStart(function(){setTimeout(function(){
          play('bubbles');
        }, (a/(Math.PI*2))*3000)})
        .onUpdate(noop)
    )

    talk.pause(10000);

    // sound moving around with light
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 10000)
        .onStart(function(){setTimeout(function(){
          play('bubbles');
          bg('#fff');
        }, (a/(Math.PI*2))*10000)})
        .onUpdate(noop)
    )


    // faster (blue)
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 5000)
        .onStart(function(){setTimeout(function(){
          play('bubbles');
          bg('#08f');
        }, (a/(Math.PI*2))*5000)})
        .onUpdate(noop)
    )


    // and faster (pink)
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 5000)
        .onStart(function(){setTimeout(function(){
          play('bubbles');
          bg('#f08');
        }, (a/(Math.PI*2))*5000)})
        .onUpdate(noop)
    )


    // across (hsv)
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 7000)
        .onStart(function(){
          setTimeout(function(){
            play('bubbles');
            bg(hsl_basic((a/(Math.PI*2))*360,1,.5));
          }, x*7000)
        })
        .onUpdate(noop)
    )

    // back (white)
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 7000)
        .onStart(function(){
          setTimeout(function(){
            play('bubbles');
            bg('#fff');
          }, (1-x)*7000)
        })
        .onUpdate(noop)
    )


    talk.pause(3000);

    // fizz (at same time) back to the bottom
    talk.queue(
      new TWEEN.Tween({t:0})
        .to({t:1}, 2000)
        .onStart(this.master ? noop: function(){play('spiral')})
        .onUpdate(function() {
          bg(grey(this.t < y ? 1 : 0));
        })
    )
  }



  function last(talk){
    talk.queue(function(){
      body_className('');
      body_css('backgroundColor', '#fff')
    })



    talk.slide('last')
    talk.pause(11000)
    talk.fragment()
    talk.pause(2000)
    talk.fragment()
    talk.pause(4000)
    talk.fragment()

    // thanks
    talk.pause(6500)
    talk.fragment()

    // 6 times to skip
    talk.pause(10000) 
    talk.fragment()
  }


  /****
  Support
  ****/

  function noop(){}

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
    this.firstTween.start(Date.now());
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

    TWEEN.update(Date.now());
  }


  exports.Talk = Talk;

  exports.displaySlide = function(key){
    document.getElementById('content').innerHTML = slideContent(key); 

    var fragments = document.getElementsByClassName('fragment');
    for (var i = fragments.length - 1; i >= 0; i--) {
      fragments[i].className = 'fragment-active'
    }
  }


})(this);