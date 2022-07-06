var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function u(t){return"function"==typeof t}function r(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function a(t,n){t.appendChild(n)}function l(t,n,e){t.insertBefore(n,e||null)}function i(t){t.parentNode.removeChild(t)}function c(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function s(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function g(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function m(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function h(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}let p;function v(t){p=t}const _=[],$=[],b=[],y=[],x=Promise.resolve();let w=!1;function S(t){b.push(t)}const j=new Set;let N=0;function O(){const t=p;do{for(;N<_.length;){const t=_[N];N++,v(t),k(t.$$)}for(v(null),_.length=0,N=0;$.length;)$.pop()();for(let t=0;t<b.length;t+=1){const n=b[t];j.has(n)||(j.add(n),n())}b.length=0}while(_.length);for(;y.length;)y.pop()();w=!1,j.clear(),v(t)}function k(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(S)}}const E=new Set;function C(t,n){-1===t.$$.dirty[0]&&(_.push(t),w||(w=!0,x.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function A(r,a,l,c,s,d,f,g=[-1]){const m=p;v(r);const h=r.$$={fragment:null,ctx:null,props:d,update:t,not_equal:s,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(m?m.$$.context:[])),callbacks:e(),dirty:g,skip_bound:!1,root:a.target||m.$$.root};f&&f(h.root);let _=!1;if(h.ctx=l?l(r,a.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return h.ctx&&s(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),_&&C(r,t)),n})):[],h.update(),_=!0,o(h.before_update),h.fragment=!!c&&c(h.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);h.fragment&&h.fragment.l(t),t.forEach(i)}else h.fragment&&h.fragment.c();a.intro&&(($=r.$$.fragment)&&$.i&&(E.delete($),$.i(b))),function(t,e,r,a){const{fragment:l,on_mount:i,on_destroy:c,after_update:s}=t.$$;l&&l.m(e,r),a||S((()=>{const e=i.map(n).filter(u);c?c.push(...e):o(e),t.$$.on_mount=[]})),s.forEach(S)}(r,a.target,a.anchor,a.customElement),O()}var $,b;v(m)}function J(t,n,e){const o=t.slice();return o[18]=n[e],o[20]=e,o}function M(t,n,e){const o=t.slice();return o[21]=n[e],o[20]=e,o}function P(t,n,e){const o=t.slice();return o[23]=n[e],o[25]=e,o}function T(t){let n,e;return{c(){n=s("div"),e=d(t[1]),m(n,"class","big_bad svelte-4vnj0u")},m(t,o){l(t,n,o),a(n,e)},p(t,n){2&n&&h(e,t[1])},d(t){t&&i(n)}}}function V(t){let n,e,o,u=t[23]==t[20]?"#"+(t[25]+1):"";return{c(){n=s("td"),e=d(u),m(n,"title",o=`Vote cursor: ${t[4].round_selection[t[25]]}\nCounted as: ${t[4].round_count[t[25]]}`)},m(t,o){l(t,n,o),a(n,e)},p(t,r){16&r&&u!==(u=t[23]==t[20]?"#"+(t[25]+1):"")&&h(e,u),16&r&&o!==(o=`Vote cursor: ${t[4].round_selection[t[25]]}\nCounted as: ${t[4].round_count[t[25]]}`)&&m(n,"title",o)},d(t){t&&i(n)}}}function L(t){let n,e,o,u,r,g,m,p,v,_,$=t[21]+"",b=t[4].count[t[20]]+"",y=t[4].rate[t[20]]>=I?"✔":"",x=t[4].round_wins,w=[];for(let n=0;n<x.length;n+=1)w[n]=V(P(t,x,n));return{c(){n=s("tr"),e=s("th"),o=d($),u=f(),r=s("td"),g=d(b),m=f(),p=d(y),v=f();for(let t=0;t<w.length;t+=1)w[t].c();_=f()},m(t,i){l(t,n,i),a(n,e),a(e,o),a(n,u),a(n,r),a(r,g),a(r,m),a(r,p),a(n,v);for(let t=0;t<w.length;t+=1)w[t].m(n,null);a(n,_)},p(t,e){if(4&e&&$!==($=t[21]+"")&&h(o,$),16&e&&b!==(b=t[4].count[t[20]]+"")&&h(g,b),16&e&&y!==(y=t[4].rate[t[20]]>=I?"✔":"")&&h(p,y),16&e){let o;for(x=t[4].round_wins,o=0;o<x.length;o+=1){const u=P(t,x,o);w[o]?w[o].p(u,e):(w[o]=V(u),w[o].c(),w[o].m(n,_))}for(;o<w.length;o+=1)w[o].d(1);w.length=x.length}},d(t){t&&i(n),c(w,t)}}}function q(t){let n;return{c(){n=s("input"),m(n,"type","number"),n.value=-.5,m(n,"step",.5),m(n,"min",-10),m(n,"max",-.5)},m(t,e){l(t,n,e)},d(t){t&&i(n)}}}function B(t){let n,e,o,u,r,c,p,v,_,$,b,y=t[18]+"",x=t[20]<t[0].num_again&&q();return{c(){n=s("p"),e=s("strong"),o=d(y),u=d(":"),r=f(),c=s("input"),v=f(),x&&x.c(),_=f(),m(c,"type","text"),c.value=p=Y(t[0].voted[t[20]])},m(i,s){l(i,n,s),a(n,e),a(e,o),a(e,u),a(n,r),a(n,c),a(n,v),x&&x.m(n,null),a(n,_),$||(b=g(c,"change",t[10](t[20])),$=!0)},p(e,u){t=e,8&u&&y!==(y=t[18]+"")&&h(o,y),1&u&&p!==(p=Y(t[0].voted[t[20]]))&&c.value!==p&&(c.value=p),t[20]<t[0].num_again?x||(x=q(),x.c(),x.m(n,_)):x&&(x.d(1),x=null)},d(t){t&&i(n),x&&x.d(),$=!1,b()}}}function D(n){let e,u,r,h,p,v,_,$,b,y,x,w,S,j,N,O,k,E,C,A,P,V,q,D,I,K,W=n[1]&&T(n),X=n[2],Y=[];for(let t=0;t<X.length;t+=1)Y[t]=L(M(n,X,t));let Z=n[3],tt=[];for(let t=0;t<Z.length;t+=1)tt[t]=B(J(n,Z,t));return{c(){e=s("main"),W&&W.c(),u=f(),r=s("h2"),h=s("input"),v=d("\n    candidates, for\n    "),_=s("input"),b=d("\n    seats"),y=f(),x=s("table");for(let t=0;t<Y.length;t+=1)Y[t].c();w=f(),S=s("div"),j=s("h2"),N=s("input"),k=d("\n      voters, with\n      "),E=s("input"),A=d("\n      running again"),P=f();for(let t=0;t<tt.length;t+=1)tt[t].c();V=f(),q=s("textarea"),m(h,"type","number"),h.value=p=n[0].num_candidates,m(h,"step","1"),m(h,"min",R),m(h,"max",U),m(_,"type","number"),_.value=$=n[0].seats,m(_,"step","1"),m(_,"min",z),m(_,"max",F),m(r,"class","svelte-4vnj0u"),m(N,"type","number"),N.value=O=n[0].num_voters,m(N,"step","1"),m(N,"min",G),m(N,"max",H),m(E,"type","number"),E.value=C=n[0].num_again,m(E,"step","1"),m(E,"min","0"),m(E,"max",H),m(j,"class","svelte-4vnj0u"),m(q,"class","share svelte-4vnj0u"),q.value=D=JSON.stringify(n[0],null,2),m(e,"class","svelte-4vnj0u")},m(t,o){l(t,e,o),W&&W.m(e,null),a(e,u),a(e,r),a(r,h),a(r,v),a(r,_),a(r,b),a(e,y),a(e,x);for(let t=0;t<Y.length;t+=1)Y[t].m(x,null);a(e,w),a(e,S),a(S,j),a(j,N),a(j,k),a(j,E),a(j,A),a(S,P);for(let t=0;t<tt.length;t+=1)tt[t].m(S,null);a(e,V),a(e,q),I||(K=[g(h,"change",n[6]),g(_,"change",n[5]),g(N,"change",n[7]),g(E,"change",n[8]),g(q,"focus",Q),g(q,"change",n[9])],I=!0)},p(t,[n]){if(t[1]?W?W.p(t,n):(W=T(t),W.c(),W.m(e,u)):W&&(W.d(1),W=null),1&n&&p!==(p=t[0].num_candidates)&&h.value!==p&&(h.value=p),1&n&&$!==($=t[0].seats)&&_.value!==$&&(_.value=$),20&n){let e;for(X=t[2],e=0;e<X.length;e+=1){const o=M(t,X,e);Y[e]?Y[e].p(o,n):(Y[e]=L(o),Y[e].c(),Y[e].m(x,null))}for(;e<Y.length;e+=1)Y[e].d(1);Y.length=X.length}if(1&n&&O!==(O=t[0].num_voters)&&N.value!==O&&(N.value=O),1&n&&C!==(C=t[0].num_again)&&E.value!==C&&(E.value=C),1033&n){let e;for(Z=t[3],e=0;e<Z.length;e+=1){const o=J(t,Z,e);tt[e]?tt[e].p(o,n):(tt[e]=B(o),tt[e].c(),tt[e].m(S,null))}for(;e<tt.length;e+=1)tt[e].d(1);tt.length=Z.length}1&n&&D!==(D=JSON.stringify(t[0],null,2))&&(q.value=D)},i:t,o:t,d(t){t&&i(e),W&&W.d(),c(Y,t),c(tt,t),I=!1,o(K)}}}const R=2,U=26,z=1,F=5,G=3,H=7,I=.5;function K(t){let n=0,e=t[0];for(let o=1;o<t.length;o++)t[o]>e&&(n=o,e=t[o]);return n}function Q(t){t.preventDefault(),setTimeout((()=>{t.target.setSelectionRange(0,t.target.value.length)}),1)}function W(t,n,e){return Math.min(Math.max(t,n),e)}function X(t){return String.fromCodePoint(65+t)}function Y(t){return t?t.split("").join(", "):""}function Z(t,n,e){let{setup:o={seats:2,num_candidates:5,num_voters:5,num_again:2,voted:[]}}=n;function u(){window.localStorage.setup=JSON.stringify(o),d()}function r(t){try{e(0,o=Object.assign(Object.assign({},o),JSON.parse(t||window.localStorage.setup))),g(),m(),u()}catch(t){}}r();let{big_bad:a=null}=n,{candidates:l=[]}=n,{voters:i=[]}=n,{out:c={count:[],rate:[],round_selection:[],round_count:[],round_wins:[]}}=n;function s(t,n){let e=Array(o.num_candidates).fill(0);for(const o of n){let n=t.get(o);if(void 0===n)throw`Vote for unknown candidate '${o}'`;e[n]++}return e}function d(){try{e(1,a=null);let t=new Map;l.forEach(((n,e)=>t.set(n,e))),e(4,c.count=s(t,o.voted.join("")),c),e(4,c.rate=c.count.map((t=>t/o.num_voters)),c);let n=Array(o.num_voters).fill(0),u=new Set;function r(){for(let t=0;t<o.num_voters;t++){let e=0;for(;u.has(o.voted[t][e]);)e++;n[t]=e}}e(4,c.round_selection=[],c),e(4,c.round_count=[],c),e(4,c.round_wins=[],c);for(let i=0;i<o.seats;i++){r();let d=n.map(((t,n)=>o.voted[n][t])).join(""),f=s(t,d),g=K(f);u.add(l[g]),c.round_selection.push(d),c.round_count.push(f),c.round_wins.push(g),console.log(i,d,g)}}catch(m){e(1,a=m.toString())}}function f(t){return t<o.num_again?String.fromCodePoint(65+t):String.fromCodePoint(91-o.num_candidates+t)}function g(){e(2,l=[]);for(let t=0;t<o.num_candidates;t++)l.push(f(t))}function m(){e(3,i=[]);for(let t=0;t<o.num_voters;t++)i.push(X(t))}return g(),m(),d(),t.$$set=t=>{"setup"in t&&e(0,o=t.setup),"big_bad"in t&&e(1,a=t.big_bad),"candidates"in t&&e(2,l=t.candidates),"voters"in t&&e(3,i=t.voters),"out"in t&&e(4,c=t.out)},[o,a,l,i,c,function(t){e(0,o.seats=W(z,Number(t.target.value),F),o),t.target.value=o.seats,u()},function(t){e(0,o.num_candidates=W(R,Number(t.target.value),U),o),t.target.value=o.num_candidates,g(),u()},function(t){e(0,o.num_voters=W(G,Number(t.target.value),H),o),t.target.value=o.num_voters,m(),u()},function(t){let n=Math.min(o.num_candidates,o.num_voters);e(0,o.num_again=W(0,Number(t.target.value),n),o),t.target.value=o.num_again,g(),u()},function(t){r(t.target.value),t.target.value=JSON.stringify(o,null,2)},t=>n=>{let r=function(t){return t.toUpperCase().split(/[,; ]*/).join("")}(n.target.value);e(0,o.voted[t]=r,o),n.target.value=Y(r),u()}]}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),A(this,t,Z,D,r,{setup:0,big_bad:1,candidates:2,voters:3,out:4,onseats:5,oncandidates:6,onvoters:7,onagain:8})}get onseats(){return this.$$.ctx[5]}get oncandidates(){return this.$$.ctx[6]}get onvoters(){return this.$$.ctx[7]}get onagain(){return this.$$.ctx[8]}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map