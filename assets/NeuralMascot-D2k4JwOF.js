import{a as e}from"./rolldown-runtime-Cyuzqnbw.js";import{i as t,r as n}from"./motion-vendor-wKhEcHeU.js";import{c as r,i,l as a,n as o,r as s,u as c}from"./three-vendor-Dodfxr1E.js";var l=e(t(),1),u=n(),d=`
  uniform float uTime;
  uniform float uMorph;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // Simplex noise GLSL (simplified 3D noise)
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  void main() {
    vec3 pos = position;
    float n = noise(pos * 2.0 + uTime * 0.15);
    float n2 = noise(pos * 3.0 + uTime * 0.1 + 10.0);

    // Displacement based on noise + mouse influence
    float mouseInfluence = sin(pos.x * 2.0 + uMouse.x * 3.0) * cos(pos.y * 2.0 + uMouse.y * 3.0) * 0.1;
    float displacement = (n - 0.5) * 0.4 + (n2 - 0.5) * 0.2 + mouseInfluence * uMorph;
    vDisplacement = displacement;

    vec3 newPos = pos + normal * displacement;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(newPos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`,f=`
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Fresnel effect
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - max(dot(viewDir, normalize(vNormal)), 0.0);
    fresnel = pow(fresnel, 3.0);

    // Color mixing based on displacement and fresnel
    float mix1 = sin(vDisplacement * 5.0 + uTime * 0.3) * 0.5 + 0.5;
    float mix2 = fresnel;

    vec3 color = mix(uColor1, uColor2, mix1);
    color = mix(color, uColor3, mix2 * 0.5);

    // Glow on edges
    float glow = fresnel * 0.6 + 0.2;
    color += vec3(0.2, 0.5, 0.8) * glow * 0.3;

    // Grid-like pulse
    float pulse = sin(vPosition.x * 8.0 + vPosition.y * 6.0 + uTime * 0.5) * 0.5 + 0.5;
    color += vec3(0.0, 0.1, 0.15) * pulse;

    gl_FragColor = vec4(color, 0.9);
  }
`,p=`
  uniform float uTime;
  varying vec3 vPos;
  void main() {
    vec3 pos = position;
    float n = sin(pos.x * 3.0 + pos.y * 2.0 + pos.z * 4.0 + uTime * 0.2) * 0.1;
    pos += normal * n;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,m=`
  uniform vec3 uColor;
  varying vec3 vPos;
  void main() {
    float alpha = sin(vPos.x * 10.0 + vPos.y * 8.0 + vPos.z * 6.0) * 0.3 + 0.4;
    gl_FragColor = vec4(uColor, alpha * 0.5);
  }
`;function h({mouse:e}){let t=(0,l.useRef)(null),n=(0,l.useRef)(null),o=(0,l.useRef)(null),h=(0,l.useMemo)(()=>({uTime:{value:0},uMorph:{value:0},uMouse:{value:new c},uColor1:{value:new r(`#00f3ff`)},uColor2:{value:new r(`#8b5cf6`)},uColor3:{value:new r(`#ff00ff`)}}),[]),g=(0,l.useMemo)(()=>({uTime:{value:0},uColor:{value:new r(`#00f3ff`)}}),[]),_=(0,l.useMemo)(()=>{let e=new a(1,4),t=e.attributes.position;for(let e=0;e<t.count;e++){let n=t.getX(e),r=t.getY(e),i=t.getZ(e),a=Math.sqrt(n*n+r*r+i*i);t.setXYZ(e,n/a,r/a,i/a)}return t.needsUpdate=!0,e.computeVertexNormals(),e},[]),v=(0,l.useMemo)(()=>new a(1.05,2),[]),{viewport:y}=i();return s(t=>{let n=t.clock.elapsedTime;h.uTime.value=n,g.uTime.value=n,h.uMouse.value.x=e.current.x,h.uMouse.value.y=e.current.y;let r=Math.sqrt((e.current.x-(e.current.px||0))**2+(e.current.y-(e.current.py||0))**2);h.uMorph.value+=(Math.min(r*2,1)-h.uMorph.value)*.05,e.current.px=e.current.x,e.current.py=e.current.y,o.current&&(o.current.rotation.x+=(e.current.y*.3-o.current.rotation.x)*.02,o.current.rotation.y+=(e.current.x*.5-o.current.rotation.y)*.02,o.current.rotation.z+=.001)}),(0,u.jsxs)(`group`,{ref:o,children:[(0,u.jsx)(`mesh`,{ref:t,geometry:_,children:(0,u.jsx)(`shaderMaterial`,{uniforms:h,vertexShader:d,fragmentShader:f,transparent:!0,side:2})}),(0,u.jsx)(`mesh`,{ref:n,geometry:v,children:(0,u.jsx)(`shaderMaterial`,{uniforms:g,vertexShader:p,fragmentShader:m,wireframe:!0,transparent:!0})}),(0,u.jsxs)(`mesh`,{children:[(0,u.jsx)(`icosahedronGeometry`,{args:[1.3,2]}),(0,u.jsx)(`meshBasicMaterial`,{color:`#00f3ff`,transparent:!0,opacity:.04,wireframe:!0})]})]})}function g({mouse:e}){return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`ambientLight`,{intensity:.2}),(0,u.jsx)(`pointLight`,{position:[5,3,5],intensity:.5,color:`#00f3ff`}),(0,u.jsx)(`pointLight`,{position:[-5,-3,-5],intensity:.3,color:`#ff00ff`}),(0,u.jsx)(h,{mouse:e})]})}function _({className:e=``,scale:t=1}){let n=(0,l.useRef)({x:0,y:0,px:0,py:0});return(0,l.useEffect)(()=>{let e=e=>{n.current.x=e.clientX/window.innerWidth*2-1,n.current.y=e.clientY/window.innerHeight*2-1};return window.addEventListener(`mousemove`,e),()=>window.removeEventListener(`mousemove`,e)},[]),(0,u.jsx)(`div`,{className:e,style:{width:`100%`,height:`100%`},children:(0,u.jsx)(o,{camera:{position:[0,0,3.5],fov:45},dpr:[1,1.5],gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},style:{background:`transparent`},children:(0,u.jsx)(g,{mouse:n})})})}export{_ as default};