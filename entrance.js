(()=>{var e={392:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.API_ORIGIN=void 0,t.API_ORIGIN="https://serene-reef-96808.herokuapp.com"}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,n),s.exports}(()=>{"use strict";const e=n(392);let t;function o(){(async()=>{let e=await i((e=>e));for(t=e;"let_the_game_begin"!=e.state;){await new Promise((e=>setTimeout(e,200*(2+Math.random())*.8093)));const n=await r(e.access_token,(e=>e));n.legal?(e=n.ret,t=e):(e=await i((e=>e)),t=e)}var n,o,s;n=e.access_token,o=e.is_first_move_my_move,s=e.is_IA_down_for_me,alert("Let the game begin"),sessionStorage.access_token=n,sessionStorage.is_first_move_my_move=JSON.stringify(o),sessionStorage.is_IA_down_for_me=JSON.stringify(s),location.href="main.html"})()}async function r(t,n){return await s(`${e.API_ORIGIN}/random/poll`,{access_token:t},n)}async function s(e,t,n){const o=await fetch(e,{method:"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json"},keepalive:!0}).then((function(e){return e.json()})).then(n).catch((function(e){console.error("Error:",e)}));if(console.log(o),!o)throw alert("network error!"),new Error("network error!");return o}async function i(t){return await s(`${e.API_ORIGIN}/random/entry`,{},t)}document.addEventListener("visibilitychange",(function(){if("hidden"===document.visibilityState){if(void 0!==t){const n=t.access_token;t=void 0,(async()=>{console.log(`trying to cancel ${n}:`);const t=await async function(t,n){return await s(`${e.API_ORIGIN}/random/cancel`,{access_token:t},(e=>e))}(n);console.log(`got result ${JSON.stringify(t)}`)})()}}else o()})),o()})()})();