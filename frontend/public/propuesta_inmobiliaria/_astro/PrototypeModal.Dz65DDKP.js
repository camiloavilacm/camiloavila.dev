import{r as o}from"./index.B52nOzfP.js";var u={exports:{}},h={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var b=o,k=Symbol.for("react.element"),v=Symbol.for("react.fragment"),N=Object.prototype.hasOwnProperty,g=b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,j={key:!0,ref:!0,__self:!0,__source:!0};function w(s,t,a){var n,r={},i=null,c=null;a!==void 0&&(i=""+a),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(c=t.ref);for(n in t)N.call(t,n)&&!j.hasOwnProperty(n)&&(r[n]=t[n]);if(s&&s.defaultProps)for(n in t=s.defaultProps,t)r[n]===void 0&&(r[n]=t[n]);return{$$typeof:k,type:s,key:i,ref:c,props:r,_owner:g.current}}h.Fragment=v;h.jsx=w;h.jsxs=w;u.exports=h;var e=u.exports;/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),f=(...s)=>s.filter((t,a,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===a).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var $={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=o.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:n,className:r="",children:i,iconNode:c,...d},x)=>o.createElement("svg",{ref:x,...$,width:t,height:t,stroke:s,strokeWidth:n?Number(a)*24/Number(t):a,className:f("lucide",r),...d},[...c.map(([m,y])=>o.createElement(m,y)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=(s,t)=>{const a=o.forwardRef(({className:n,...r},i)=>o.createElement(M,{ref:i,iconNode:t,className:f(`lucide-${_(s)}`,n),...r}));return a.displayName=`${s}`,a};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],C=l("ExternalLink",E);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],P=l("Globe",L);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],z=l("Layers",A);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],S=l("MapPin",I);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]],q=l("Maximize2",R);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]],F=l("MessageSquare",B);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]],H=l("Minimize2",O);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],T=l("User",U);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],D=l("X",W),G="/propuesta_inmobiliaria".replace(/\/$/,"");function p(s){const t=s.startsWith("/")?s:`/${s}`;return`${G}${t}`}const V=({isOpen:s,onClose:t,initialHash:a=""})=>{const[n,r]=o.useState(a),[i,c]=o.useState(!1);if(o.useEffect(()=>{r(a)},[a]),o.useEffect(()=>{const x=m=>{m.key==="Escape"&&s&&t()};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[s,t]),!s)return null;const d=`${p("/prototype/index.html")}${n||""}`;return e.jsx("div",{className:"fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 p-2 sm:p-4",children:e.jsxs("div",{className:`bg-[#234B40] text-white flex flex-col rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-white/10 ${i?"w-full h-full":"w-full max-w-7xl h-[92vh]"}`,children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#172B25] border-b border-white/10 gap-2 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"}),e.jsxs("div",{children:[e.jsx("span",{className:"font-bold text-sm tracking-wide text-white",children:"HABITIA"}),e.jsx("span",{className:"text-xs text-white/60 ml-2 hidden sm:inline",children:"Prototipo Funcional Completo (Avenew Madrid)"})]})]}),e.jsxs("div",{className:"hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg text-xs",children:[e.jsxs("button",{onClick:()=>r("#b2c"),className:`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${n==="#b2c"||!n?"bg-white/20 text-white font-medium":"text-white/70 hover:text-white"}`,children:[e.jsx(P,{className:"w-3.5 h-3.5"}),"Web Pública"]}),e.jsxs("button",{onClick:()=>r("#tenant-portal"),className:`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${n==="#tenant-portal"?"bg-white/20 text-white font-medium":"text-white/70 hover:text-white"}`,children:[e.jsx(T,{className:"w-3.5 h-3.5"}),"Mi espacio"]}),e.jsxs("button",{onClick:()=>r("#admin-inbox"),className:`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${n==="#admin-inbox"?"bg-white/20 text-white font-medium":"text-white/70 hover:text-white"}`,children:[e.jsx(F,{className:"w-3.5 h-3.5"}),"Inbox Omnicanal"]}),e.jsxs("button",{onClick:()=>r("#admin-inventory-map"),className:`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${n==="#admin-inventory-map"?"bg-white/20 text-white font-medium":"text-white/70 hover:text-white"}`,children:[e.jsx(S,{className:"w-3.5 h-3.5"}),"Mapa 100 Habs"]}),e.jsxs("button",{onClick:()=>r("#pitch-packages"),className:`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${n==="#pitch-packages"?"bg-white/20 text-white font-medium":"text-white/70 hover:text-white"}`,children:[e.jsx(z,{className:"w-3.5 h-3.5"}),"Paquetes"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("a",{href:`${p("/prototype/index.html")}${n}`,target:"_blank",rel:"noopener noreferrer",className:"px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-md flex items-center gap-1 transition",title:"Abrir en pestaña independiente",children:[e.jsx("span",{className:"hidden sm:inline",children:"Nueva pestaña"}),e.jsx(C,{className:"w-3.5 h-3.5"})]}),e.jsx("button",{onClick:()=>c(!i),className:"p-1 text-white/70 hover:text-white rounded hover:bg-white/10",title:i?"Salir de pantalla completa":"Pantalla completa",children:i?e.jsx(H,{className:"w-4 h-4"}):e.jsx(q,{className:"w-4 h-4"})}),e.jsx("button",{onClick:t,className:"p-1 text-white/70 hover:text-white rounded hover:bg-white/10 ml-1",title:"Cerrar modal",children:e.jsx(D,{className:"w-5 h-5"})})]})]}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#F7F6F2] relative",children:e.jsx("iframe",{src:d,title:"Prototipo Interactivo HABITIA",className:"w-full h-full border-0"},d)})]})})};export{C as E,S as M,V as P,T as U,D as X,p as a,l as c,e as j};
