(function(exports){

  // TODO inline content
  function slideContent(key){
    var el = document.querySelector('[data-slide='+key+']')
    return el ? el.innerHTML : 'no content for ' + key;
  }

  // create the talk object
  function Talk(){
    intro(this)
  }



  /****
  The content
  ****/

  // Content
  function intro(talk){
    talk.slide("hello")
    talk.pause(10000)

    talk.slide("warning")
    talk.pause(10000)
    talk.fragment()
    talk.pause(5000)
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
      console.log("0")
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