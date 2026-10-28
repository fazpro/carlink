/* Glass sphere with a liquid wave inside (ref: "Night mode for AI assistant").
   uDark = 0 → light version for white backgrounds, 1 → night version. */
window.CaiLiquid = (function () {
  var FS = [
    "precision highp float;",
    "uniform vec2 uRes; uniform float uT; uniform float uR; uniform float uDark;",
    "void main(){",
    "  vec2 p=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);",
    "  vec2 q=p/uR; float r=length(q); float t=uT;",
    "  float z=sqrt(max(0.,1.-r*r)); float fres=pow(1.-z,2.2);",
    // liquid surface: a sloshing wave with a slow tilt
    "  float tilt=.32*sin(t*.42)+.12*sin(t*.23+1.);",
    "  float ys=.06+tilt*q.x+.22*sin(q.x*2.1+t*.9)+.05*sin(q.x*4.3-t*1.3)+.05*sin(t*.6)-.18*q.x*q.x;",
    "  float d=q.y-ys;",
    "  float liq=smoothstep(.02,-.02,d);",
    "  float sheet=exp(-max(-d,0.)*1.35);",           // lit surface sheet just under the crest
    "  float crest=exp(-pow((d+.01)/.035,2.));",
    "  float edge=exp(-pow((d-.018)/.02,2.))*smoothstep(0.,.9,q.x+.4*q.y);",
    "  float above=exp(-max(d,0.)*2.6);",              // liquid light bleeding into the glass above
    "  float shade=.72+.28*z;",
    // palettes
    "  vec3 Ldeep=mix(vec3(.0,.17,.72),vec3(.0,.1,.5),uDark);",
    "  vec3 Lmid =mix(vec3(.12,.55,1.),vec3(.1,.45,.95),uDark);",
    "  vec3 Lhi  =mix(vec3(.55,.92,1.),vec3(.45,.95,1.),uDark);",
    "  vec3 Vio  =mix(vec3(.62,.42,1.),vec3(.7,.35,1.),uDark);",
    "  vec3 Gtop =mix(vec3(.93,.95,1.),vec3(.04,.12,.5),uDark);",
    "  vec3 Gbot =mix(vec3(.74,.82,1.),vec3(.1,.25,.85),uDark);",
    "  vec3 Rim  =mix(vec3(.55,.68,1.),vec3(.35,.65,1.),uDark);",
    // glass (upper part)
    "  vec3 glass=mix(Gtop,Gbot,smoothstep(-.9,.6,-q.y)*.6+fres*.4);",
    "  glass=mix(glass,mix(Lmid,Lhi,.35),above*mix(.38,.55,uDark));",
    "  glass+=Vio*edge*.0;",
    // liquid
    "  vec3 liquid=mix(Ldeep,Lmid,smoothstep(0.,.7,sheet));",
    "  liquid=mix(liquid,Lhi,pow(sheet,1.25)*.85);",
    "  liquid*=mix(.78+.22*z,shade,uDark);",
    "  vec3 col=mix(glass,liquid,liq);",
    "  col=mix(col,mix(Lhi,vec3(1.),.35),crest*.6);",
    "  col=mix(col,Vio,edge*.85);",
    // glass volume: rim light + soft inner shadow + specular
    "  col=mix(col,Rim,fres*mix(.55,.6,uDark));",
    "  col+=vec3(1.)*pow(max(0.,1.-length((q-vec2(-.25,.62))*vec2(.6,1.2))/.5),2.)*mix(.18,.1,uDark);",
    "  col=mix(col,col*mix(vec3(.8,.85,1.),vec3(.55,.65,1.),uDark),smoothstep(.55,1.,r)*.45);",
    "  float disc=smoothstep(1.,.985,r);",
    "  float outR=max(r-1.,0.);",
    "  float glow=exp(-outR*mix(9.,7.,uDark))*(1.-disc)*mix(.22,.4,uDark);",
    "  vec3 gc=mix(vec3(.35,.55,1.),vec3(.2,.45,1.),uDark);",
    "  vec3 c=min(col,vec3(1.))*disc+gc*glow;",
    "  gl_FragColor=vec4(c, max(disc,glow));",
    "}"].join("\n");
  var VS = "attribute vec2 a; void main(){ gl_Position=vec4(a,0.,1.); }";
  function mount(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true, preserveDrawingBuffer: !!opts.t0 });
    if (!gl) return null;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(pr, "uRes"), uT = gl.getUniformLocation(pr, "uT"), uR = gl.getUniformLocation(pr, "uR"), uDark = gl.getUniformLocation(pr, "uDark");
    var t = opts.t0 || 7.3, speed = 1, target = 1, last = 0, raf = 0, running = false, dark = opts.dark ? 1 : 0, darkT = dark;
    function paint(w, h) { gl.uniform2f(uRes, w, h); gl.uniform1f(uT, t); gl.uniform1f(uR, opts.radius || .6); gl.uniform1f(uDark, dark); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    function size() { var d = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d); if (w && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); } }
    function draw() { size(); paint(canvas.width, canvas.height); }
    function frame(now) { if (!running) return; var dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; speed += (target - speed) * Math.min(1, dt * 3); dark += (darkT - dark) * Math.min(1, dt * 4); t += dt * speed * .6; draw(); raf = requestAnimationFrame(frame); }
    return {
      draw: draw,
      start: function () { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      busy: function (on) { target = on ? 2.6 : 1; },
      theme: function (isDark) { darkT = isDark ? 1 : 0; if (!running) { dark = darkT; draw(); } },
      set: function (v) { t = v; draw(); },
      drawFixed: function (px) { canvas.width = canvas.height = px; gl.viewport(0, 0, px, px); paint(px, px); },
      dispose: function () { running = false; var ext = gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext(); }
    };
  }
  return { mount: mount };
})();
