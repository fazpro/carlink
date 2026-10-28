/* Glass sphere with a liquid wave inside (ref: "Night mode for AI assistant").
   uDark = 0 → light version for white backgrounds, 1 → night version. */
window.CaiLiquid = (function () {
  var FS = [
    "precision highp float;",
    "uniform vec2 uRes; uniform float uT; uniform float uR; uniform float uDark;",
    // height of the inner sheet at (x, depth z)
    "float H(float x,float z,float t){",
    "  return .02+(.26*sin(t*.37)+.1*sin(t*.21+1.3))*x+.34*z",
    "    +.17*sin(x*2.3+z*1.1+t*.8)+.07*sin(x*4.1-z*2.+t*1.25)+.04*sin(t*.55);",
    "}",
    "void main(){",
    "  vec2 p=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);",
    "  vec2 q=p/uR; float r=length(q); float t=uT;",
    "  float zf=sqrt(max(0.,1.-r*r));",
    "  float fres=pow(1.-zf,1.6);",
    // sheet seen through the glass: band between its back and front edges
    "  float hf=H(q.x,zf,t), hb=H(q.x,-zf,t);",
    "  float lo=min(hf,hb), hi=max(hf,hb);",
    "  float w=.1;",
    "  float s=clamp((q.y-lo)/(hi-lo+1e-4),0.,1.);",            // 0 = lower edge, 1 = upper edge of the band
    "  float inBand=smoothstep(lo-w,lo+w*.5,q.y)*(1.-smoothstep(hi-w*.25,hi+w*.6,q.y));",
    "  float below=1.-smoothstep(lo-w,lo+w,q.y);",
    "  float topEdge=exp(-pow((q.y-hi+.02)/.06,2.));",
    "  float vio=smoothstep(-.3,.6,q.x+.25*q.y);",
    "  vec3 glassTop=vec3(.05,.1,.55), glassLit=vec3(.17,.36,.88);",
    "  vec3 vol=vec3(.1,.38,.82), volDeep=vec3(.05,.2,.6);",
    "  vec3 cyan=vec3(.38,.84,1.), cyanHi=vec3(.7,.96,1.);",
    "  vec3 violet=vec3(.6,.27,1.), rimC=vec3(.36,.62,1.);",
    "  vec3 col=mix(glassTop,glassLit,clamp(.25-.35*q.x-.2*q.y+fres*.6,0.,1.));",
    "  vec3 v=mix(vol,volDeep,clamp(-q.y*.8+.1,0.,1.));",
    "  col=mix(col,v,below);",
    "  vec3 sheet=mix(mix(vec3(.16,.48,.95),cyan,smoothstep(.0,.55,s)),mix(cyanHi,violet,vio),smoothstep(.55,1.,s)*mix(.35,.9,vio));",
    "  col=mix(col,sheet,inBand*.95);",
    "  col+=mix(cyanHi*.35,violet*.75,vio)*topEdge*.7;\n  col+=violet*exp(-pow((q.y-hi-.06)/.12,2.))*vio*.22;",
    "  col*=.78+.22*zf;",
    "  col=mix(col,rimC,fres*.6);",
    "  col+=rimC*smoothstep(.78,.98,r)*(1.-smoothstep(.98,1.,r))*.12;",
    "  col+=vec3(.3,.5,1.)*pow(max(0.,1.-length((q-vec2(-.15,.78))*vec2(.55,1.3))/.6),2.)*.15;",
    "  float disc=smoothstep(1.015,.94,r);",
    "  float outR=max(r-1.,0.);",
    "  float glow=exp(-outR*10.)*(1.-disc)*.32;",
    "  vec3 c=min(col,vec3(1.))*disc+vec3(.25,.5,1.)*glow;",
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
