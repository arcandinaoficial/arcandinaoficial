(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[742],{8735:function(e,o,t){Promise.resolve().then(t.bind(t,9520))},9520:function(e,o,t){"use strict";var n=t(7437),s=t(2265),i=t(1448),r=t.n(i),l=t(7355),c=t(9274),a=t(2873),u=t(4315),d=t(9333),p=t(3397),f=t(7151),b=t(3852),m=t(257),x=t(7164),y=t(3476),g=t(5983);let h=e=>{let{label:o,onClick:t,type:i="button",className:r="",variable:h="primary",disabled:j=!1,icon:w,iconColor:z="#faf9f6",iconSize:Z=18,actionType:k=""}=e,v=(0,s.useRef)(null),C={Ship:(0,n.jsx)(l.Z,{color:z,size:Z}),HeartHandshake:(0,n.jsx)(c.Z,{color:z,size:Z}),Menu:(0,n.jsx)(a.Z,{color:z,size:Z}),Clapperboard:(0,n.jsx)(u.Z,{color:z,size:Z}),Mic:(0,n.jsx)(d.Z,{color:z,size:Z}),BookOpenText:(0,n.jsx)(p.Z,{color:z,size:Z}),Lightbulb:(0,n.jsx)(f.Z,{color:z,size:Z}),House:(0,n.jsx)(b.Z,{color:z,size:Z}),CircleArrowLeft:(0,n.jsx)(m.Z,{color:z,size:Z}),Download:(0,n.jsx)(x.Z,{color:z,size:Z}),Rotary:(0,n.jsx)("img",{style:{width:"18px",height:"18px"},src:"/socials/rotary-icon.svg",alt:"Rotary nut icon"})},_=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,N=e=>{let o=document.getElementById(e);if(!o)return;let t=window.scrollY,n=o.getBoundingClientRect().top+t-100-t,s=null,i=e=>{s||(s=e);let o=Math.min((e-s)/2e3,1),r=_(o);window.scrollTo(0,t+n*r),o<1&&requestAnimationFrame(i)};requestAnimationFrame(i)};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(g.F,{ref:v,appendTo:()=>{document.body}}),(0,n.jsxs)("button",{type:i,className:"button button--".concat(h," ").concat(r),onClick:()=>{"redirect"===k&&"string"==typeof t?window.open(t,"_blank"):"navigate"===k&&"string"==typeof t?window.location.href=t:"scrollTo"===k&&"string"==typeof t?N(t):"toast"===k?v.current.show({severity:t.severity,summary:t.summary,detail:t.detail}):"function"===k&&"function"==typeof t&&t()},disabled:j,children:[o,w?C[w]||(0,n.jsx)(y.Z,{color:z,size:Z}):null]})]})};h.propTypes={label:r().string.isRequired,onClick:r().func,type:r().oneOf(["button","submit","reset"]),className:r().string,disabled:r().bool,icon:r().string,variable:r().string},o.default=h}},function(e){e.O(0,[653,971,23,744],function(){return e(e.s=8735)}),_N_E=e.O()}]);