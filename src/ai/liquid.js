/* Liquid glass sphere — WebGL fragment shader (ref: "Liquid AI sphere") */
window.CaiLiquid = (function () {
  var FS = [
    "precision highp float;",
    "uniform vec2 uRes; uniform float uT; uniform float uR;",
    "float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }",
    "float n2(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);",
    "  return mix(mix(h21(i),h21(i+vec2(1.,0.)),u.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),u.x), u.y); }",
    "float fbm(vec2 p){ float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<3;i++){ v+=a*n2(p); p=m*p; a*=.5; } return v; }",
    "vec3 irid(float x){ return .5+.5*cos(6.2832*(x+vec3(0.,.33,.67))); }",
    "void main(){",
    "  vec2 p=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);",
    "  vec2 q=p/uR; float r=length(q); float t=uT;",
    "  float z=sqrt(max(0.,1.-r*r)); float fres=pow(1.-z,2.);",
    "  float ang=atan(q.y,q.x);",
    "  vec2 lq=q*(1.+.9*(1.-z));",
    "  vec2 w=vec2(fbm(lq*.9+vec2(t*.10,-t*.07)), fbm(lq*.9+vec2(-t*.08,t*.11)+5.2));",
    "  float n=fbm(lq*.7+1.3*w+vec2(t*.03,t*.04));",
    "  float n2=fbm(lq*.9-1.1*w+vec2(-t*.04,t*.02)+3.7);",
    "  float v=r*1.05+n*1.2+sin(ang*2.+t*.3+n*3.)*.15;",
    "  float v2=r*.95+n2*1.25+cos(ang*3.-t*.25+n2*2.)*.13;",
    "  float b1=.5+.5*sin(v*6.2832-t*.5), b2=.5+.5*sin(v2*6.2832+t*.4+1.7);",
    "  float wt=smoothstep(.2,.85,r)*(1.-smoothstep(.97,1.,r));",
    "  wt*=.55+.45*smoothstep(.4,-.7,q.y);",
    "  vec3 deep=mix(vec3(.003,.006,.03), vec3(.015,.04,.17), smoothstep(.3,1.,r));",
    "  vec3 col=deep;",
    "  vec3 c1=mix(vec3(.04,.16,.75),vec3(.3,.75,1.),pow(b1,6.));",
    "  vec3 c2=mix(vec3(.12,.1,.6),vec3(.55,.6,1.),pow(b2,6.));",
    "  col+=c1*pow(b1,2.5)*wt*.75 + c2*pow(b2,3.)*wt*.45;",
    "  col+=(vec3(.8,.93,1.)+irid(v*1.3+t*.02)*.25)*(pow(b1,12.)*.6+pow(b2,18.)*.35)*wt;",
    "  col+=fres*mix(vec3(.2,.45,1.),irid(ang/6.2832-t*.04+.15),.35)*.4;",
    "  float s=.07;",
    "  float rr=exp(-pow((r-.94)/s,2.)), rg=exp(-pow((r*1.03-.94)/s,2.)), rb=exp(-pow((r*1.06-.94)/s,2.));",
    "  vec3 ir=mix(vec3(.55,.75,1.), irid(ang/6.2832*2.+t*.035), .45);",
    "  col+=vec3(rr,rg,rb)*ir*.85;",
    "  col+=pow(max(0.,1.-length(q-vec2(-.3,.48))/.42),3.)*.18;",
    "  float disc=smoothstep(1.02,.97,r);",
    "  float outR=max(r-1.,0.);",
    "  float glow=exp(-outR*7.)*(1.-disc);",
    "  vec2 g=p*80.; vec2 id=floor(g); float hh=h21(id);",
    "  vec2 f=fract(g)-.5; float d=length(f-(vec2(h21(id+3.1),h21(id+7.7))-.5)*.6);",
    "  float side=pow(abs(q.x)/max(r,.001),2.)*.85+.15;",
    "  float ring=exp(-pow((r-1.05)/.12,2.));",
    "  float tw=.5+.5*sin(t*2.4+hh*40.);",
    "  float spark=step(.8,hh)*smoothstep(.16,.0,d)*ring*side*tw*1.2;",
    "  vec3 sc=irid(hh+ang*.2)*.5+.6;",
    "  vec3 gc=mix(vec3(.25,.45,1.), irid(ang/6.2832*2.+t*.035), .4);",
    "  float aG=glow*.28; float aO=clamp(aG+spark,0.,1.);",
    "  vec3 oc=min(gc*aG+sc*spark, vec3(aO));",
    "  vec3 c=min(col,vec3(1.))*disc+oc*(1.-disc);",
    "  gl_FragColor=vec4(c, max(disc,aO));",
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
    var uRes = gl.getUniformLocation(pr, "uRes"), uT = gl.getUniformLocation(pr, "uT"), uR = gl.getUniformLocation(pr, "uR");
    var t = opts.t0 || 7.3, speed = 1, target = 1, last = 0, raf = 0, running = false;
    function size() { var d = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d); if (w && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); } }
    function draw() { size(); gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uT, t); gl.uniform1f(uR, opts.radius || .6); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    function frame(now) { if (!running) return; var dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; speed += (target - speed) * Math.min(1, dt * 3); t += dt * speed * .55; draw(); raf = requestAnimationFrame(frame); }
    return {
      draw: draw,
      start: function () { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      busy: function (on) { target = on ? 3.2 : 1; },
      set: function (v) { t = v; draw(); },
      drawFixed: function (px) { canvas.width = canvas.height = px; gl.viewport(0, 0, px, px); gl.uniform2f(uRes, px, px); gl.uniform1f(uT, t); gl.uniform1f(uR, opts.radius || .6); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); },
      dispose: function () { running = false; var ext = gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext(); }
    };
  }
  return { mount: mount };
})();
