/* Carlink AI sphere — physically shaded glass sphere with a slow inner light field */
window.CaiOrb = (function () {
  var V = { sky: 0, glow: 1, glass: 2 };
  var FS = [
    "precision highp float;",
    "uniform vec2 uRes; uniform float uT; uniform float uR; uniform float uMode;",
    "mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);}",
    "mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,s,0.,1.,0.,-s,0.,c);}",
    "float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}",
    "float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);",
    "  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),",
    "             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}",
    "float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}",
    "vec3 blob(vec2 q,vec2 c,float s,vec3 col){return col*exp(-dot(q-c,q-c)/(s*s));}",
    "void main(){",
    "  vec2 p=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);",
    "  vec2 q=p/uR; float r=length(q); float t=uT;",
    "  float zz=sqrt(max(0.,1.-min(r*r,1.)));",
    "  vec3 n=vec3(q,zz); float fr=pow(1.-zz,2.4);",
    "  vec3 col; vec3 G;",
    "  if(uMode<.5){",
    // SKY: blue gradient body with white cloud wisps drifting through it
    "    vec3 m=ry(t*.16)*rx(.35)*n;",
    "    float c1=fbm(m*1.05+vec3(0.,t*.06,t*.04));",
    "    float c2=fbm(m*1.9-vec3(t*.05,0.,t*.03)+4.);",
    "    float cl=smoothstep(.33,.66,c1*.8+c2*.32)*(.55+.45*smoothstep(.9,-.4,q.y));",
    "    vec3 top=vec3(.0,.3,.97), mid=vec3(.2,.55,1.), bot=vec3(.6,.83,1.);",
    "    col=mix(top,mid,smoothstep(.85,-.1,q.y));",
    "    col=mix(col,bot,smoothstep(-.1,-.95,q.y));",
    "    col=mix(col,vec3(.96,.985,1.),cl*(.62+.35*zz));",
    "    col*=.9+.12*zz;",
    "    col=mix(col,vec3(.75,.88,1.),fr*.45);",
    "    col+=vec3(1.)*.1*smoothstep(.5,.0,length((q-vec2(-.3,.55))*vec2(1.,1.5)));",
    "    G=vec3(.2,.5,1.);",
    "  } else if(uMode<1.5){",
    // GLOW: luminous colour masses blending like light
    "    vec2 w=q*(1.+.25*(1.-zz));",
    "    vec3 c=vec3(.0,.22,.9);",
    "    c+=blob(w,vec2(.45*sin(t*.5),.4*cos(t*.43)),.62,vec3(.0,.42,1.));",
    "    c+=blob(w,vec2(.5*cos(t*.37+1.),-.35*sin(t*.31)),.55,vec3(.2,.85,1.));",
    "    c+=blob(w,vec2(-.45*sin(t*.29+2.),.45*sin(t*.41+.7)),.5,vec3(.55,.4,1.));",
    "    c+=blob(w,vec2(.3*cos(t*.6+3.),-.1+.3*sin(t*.47)),.38,vec3(.85,.8,1.)*.7);",
    "    col=1.-exp(-c*1.5);",
    "    col=mix(col,vec3(.85,.93,1.),fr*.55);",
    "    col+=vec3(1.)*.12*smoothstep(.5,.0,length((q-vec2(-.25,.55))*vec2(1.,1.5)));",
    "    G=vec3(.25,.45,1.);",
    "  } else {",
    // GLASS: clear airy marble, blue light core, caustic at the bottom
    "    vec3 m=ry(t*.2)*rx(t*.11)*n;",
    "    float f=fbm(m*1.8+t*.05);",
    "    float core=exp(-dot(q-vec2(.05*sin(t*.4),-.08+.05*cos(t*.33)),q-vec2(.05*sin(t*.4),-.08+.05*cos(t*.33)))/.28);",
    "    vec3 body=mix(vec3(.9,.94,1.),vec3(.72,.82,1.),smoothstep(-.2,1.,fr+.3*q.y));",
    "    col=mix(body,vec3(.05,.42,1.),core*(.75+.25*f));",
    "    col=mix(col,vec3(.4,.8,1.),core*smoothstep(.55,.8,f)*.6);",
    "    float caus=smoothstep(.25,.95,dot(n,normalize(vec3(.2,-.7,.68))))*(.6+.4*f);",
    "    col+=vec3(.25,.55,1.)*caus*.35;",
    "    col=mix(col,vec3(.55,.72,1.),fr*.65);",
    "    col=mix(col,vec3(1.),smoothstep(.04,.0,abs(r-.93))*.25);",
    "    col+=vec3(1.)*.16*smoothstep(.5,.0,length((q-vec2(-.28,.52))*vec2(1.,1.6)));",
    "    G=vec3(.3,.5,1.);",
    "  }",
    "  float aa=1.5/(.5*uRes.y*uR);",
    "  float disc=1.-smoothstep(1.-aa,1.+aa,r);",
    "  float glow=exp(-max(r-1.,0.)*8.)*(1.-disc)*.2;",
    "  vec3 o=clamp(col,0.,1.)*disc+G*glow;",
    "  gl_FragColor=vec4(o,max(disc,glow));",
    "}"].join("\n");
  var VS = "attribute vec2 a; void main(){ gl_Position=vec4(a,0.,1.); }";
  function mount(canvas, opts) {
    opts = opts || {};
    var mode = V[opts.variant || "sky"] || 0;
    var gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true, preserveDrawingBuffer: !!opts.still });
    if (!gl) return null;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ["uRes", "uT", "uR", "uMode"].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
    var t = opts.t0 || 3.1, speed = 1, target = 1, last = 0, raf = 0, running = false;
    function paint(w, h) {
      gl.uniform2f(U.uRes, w, h); gl.uniform1f(U.uT, t); gl.uniform1f(U.uR, opts.radius || .62);
      gl.uniform1f(U.uMode, mode);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function size() { var d = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d); if (w && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); } }
    function draw() { size(); paint(canvas.width, canvas.height); }
    function frame(now) { if (!running) return; var dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; speed += (target - speed) * Math.min(1, dt * 3); t += dt * speed * .5; draw(); raf = requestAnimationFrame(frame); }
    return {
      draw: draw,
      start: function () { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      busy: function (on) { target = on ? 3 : 1; },
      set: function (v) { t = v; draw(); },
      drawFixed: function (px) { canvas.width = canvas.height = px; gl.viewport(0, 0, px, px); paint(px, px); },
      dispose: function () { running = false; var e = gl.getExtension("WEBGL_lose_context"); if (e) e.loseContext(); }
    };
  }
  return { mount: mount, variants: Object.keys(V) };
})();
