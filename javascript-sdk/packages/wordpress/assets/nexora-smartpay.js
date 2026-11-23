(function(N,st){typeof exports=="object"&&typeof module<"u"?st(exports):typeof define=="function"&&define.amd?define(["exports"],st):(N=typeof globalThis<"u"?globalThis:N||self,st(N.NexoraSmartPay={}))})(this,(function(N){"use strict";const st=globalThis,Vt=st.ShadowRoot&&(st.ShadyCSS===void 0||st.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xt=Symbol(),Re=new WeakMap;let $e=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Vt&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Re.set(e,t))}return t}toString(){return this.cssText}};const Rs=r=>new $e(typeof r=="string"?r:r+"",void 0,Xt),J=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,n,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+r[i+1],r[0]);return new $e(e,r,Xt)},$s=(r,t)=>{if(Vt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),n=st.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,r.appendChild(s)}},Ne=Vt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Rs(e)})(r):r;const{is:Ns,defineProperty:Os,getOwnPropertyDescriptor:Ds,getOwnPropertyNames:Ls,getOwnPropertySymbols:Is,getPrototypeOf:Ms}=Object,Ot=globalThis,Oe=Ot.trustedTypes,Qs=Oe?Oe.emptyScript:"",Us=Ot.reactiveElementPolyfillSupport,wt=(r,t)=>r,Dt={toAttribute(r,t){switch(t){case Boolean:r=r?Qs:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Zt=(r,t)=>!Ns(r,t),De={attribute:!0,type:String,converter:Dt,reflect:!1,useDefault:!1,hasChanged:Zt};Symbol.metadata??=Symbol("metadata"),Ot.litPropertyMetadata??=new WeakMap;let gt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&Os(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){const{get:n,set:i}=Ds(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){const a=n?.call(this);i?.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(wt("elementProperties")))return;const t=Ms(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(wt("properties"))){const e=this.properties,s=[...Ls(e),...Is(e)];for(const n of s)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const n of s)e.unshift(Ne(n))}else t!==void 0&&e.push(Ne(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $s(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const i=(s.converter?.toAttribute!==void 0?s.converter:Dt).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const i=s.getPropertyOptions(n),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Dt;this._$Em=n;const a=o.fromAttribute(e,i.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,s,n=!1,i){if(t!==void 0){const o=this.constructor;if(n===!1&&(i=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??Zt)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:n,wrapped:i},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),i!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,i]of s){const{wrapped:o}=i,a=this[n];o!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};gt.elementStyles=[],gt.shadowRootOptions={mode:"open"},gt[wt("elementProperties")]=new Map,gt[wt("finalized")]=new Map,Us?.({ReactiveElement:gt}),(Ot.reactiveElementVersions??=[]).push("2.1.2");const te=globalThis,Le=r=>r,Lt=te.trustedTypes,Ie=Lt?Lt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Me="$lit$",rt=`lit$${Math.random().toFixed(9).slice(2)}$`,Qe="?"+rt,Fs=`<${Qe}>`,dt=document,Et=()=>dt.createComment(""),xt=r=>r===null||typeof r!="object"&&typeof r!="function",ee=Array.isArray,qs=r=>ee(r)||typeof r?.[Symbol.iterator]=="function",se=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ue=/-->/g,Fe=/>/g,ht=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,He=/"/g,ze=/^(?:script|style|textarea|title)$/i,Hs=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),E=Hs(1),ut=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),je=new WeakMap,pt=dt.createTreeWalker(dt,129);function Ye(r,t){if(!ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ie!==void 0?Ie.createHTML(t):t}const zs=(r,t)=>{const e=r.length-1,s=[];let n,i=t===2?"<svg>":t===3?"<math>":"",o=kt;for(let a=0;a<e;a++){const c=r[a];let g,A,h=-1,m=0;for(;m<c.length&&(o.lastIndex=m,A=o.exec(c),A!==null);)m=o.lastIndex,o===kt?A[1]==="!--"?o=Ue:A[1]!==void 0?o=Fe:A[2]!==void 0?(ze.test(A[2])&&(n=RegExp("</"+A[2],"g")),o=ht):A[3]!==void 0&&(o=ht):o===ht?A[0]===">"?(o=n??kt,h=-1):A[1]===void 0?h=-2:(h=o.lastIndex-A[2].length,g=A[1],o=A[3]===void 0?ht:A[3]==='"'?He:qe):o===He||o===qe?o=ht:o===Ue||o===Fe?o=kt:(o=ht,n=void 0);const w=o===ht&&r[a+1].startsWith("/>")?" ":"";i+=o===kt?c+Fs:h>=0?(s.push(g),c.slice(0,h)+Me+c.slice(h)+rt+w):c+rt+(h===-2?a:w)}return[Ye(r,i+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class _t{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let i=0,o=0;const a=t.length-1,c=this.parts,[g,A]=zs(t,e);if(this.el=_t.createElement(g,s),pt.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=pt.nextNode())!==null&&c.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const h of n.getAttributeNames())if(h.endsWith(Me)){const m=A[o++],w=n.getAttribute(h).split(rt),D=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:D[2],strings:w,ctor:D[1]==="."?Ys:D[1]==="?"?Ks:D[1]==="@"?Ws:It}),n.removeAttribute(h)}else h.startsWith(rt)&&(c.push({type:6,index:i}),n.removeAttribute(h));if(ze.test(n.tagName)){const h=n.textContent.split(rt),m=h.length-1;if(m>0){n.textContent=Lt?Lt.emptyScript:"";for(let w=0;w<m;w++)n.append(h[w],Et()),pt.nextNode(),c.push({type:2,index:++i});n.append(h[m],Et())}}}else if(n.nodeType===8)if(n.data===Qe)c.push({type:2,index:i});else{let h=-1;for(;(h=n.data.indexOf(rt,h+1))!==-1;)c.push({type:7,index:i}),h+=rt.length-1}i++}}static createElement(t,e){const s=dt.createElement("template");return s.innerHTML=t,s}}function At(r,t,e=r,s){if(t===ut)return t;let n=s!==void 0?e._$Co?.[s]:e._$Cl;const i=xt(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(r),n._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=n:e._$Cl=n),n!==void 0&&(t=At(r,n._$AS(r,t.values),n,s)),t}class js{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,n=(t?.creationScope??dt).importNode(e,!0);pt.currentNode=n;let i=pt.nextNode(),o=0,a=0,c=s[0];for(;c!==void 0;){if(o===c.index){let g;c.type===2?g=new Ct(i,i.nextSibling,this,t):c.type===1?g=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(g=new Gs(i,this,t)),this._$AV.push(g),c=s[++a]}o!==c?.index&&(i=pt.nextNode(),o++)}return pt.currentNode=dt,n}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Ct{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=At(this,t,e),xt(t)?t===U||t==null||t===""?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==ut&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==U&&xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(dt.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=_t.createElement(Ye(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(e);else{const i=new js(n,this),o=i.u(this.options);i.p(e),this.T(o),this._$AH=i}}_$AC(t){let e=je.get(t.strings);return e===void 0&&je.set(t.strings,e=new _t(t)),e}k(t){ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,n=0;for(const i of t)n===e.length?e.push(s=new Ct(this.O(Et()),this.O(Et()),this,this.options)):s=e[n],s._$AI(i),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=Le(t).nextSibling;Le(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class It{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,i){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=U}_$AI(t,e=this,s,n){const i=this.strings;let o=!1;if(i===void 0)t=At(this,t,e,0),o=!xt(t)||t!==this._$AH&&t!==ut,o&&(this._$AH=t);else{const a=t;let c,g;for(t=i[0],c=0;c<i.length-1;c++)g=At(this,a[s+c],e,c),g===ut&&(g=this._$AH[c]),o||=!xt(g)||g!==this._$AH[c],g===U?t=U:t!==U&&(t+=(g??"")+i[c+1]),this._$AH[c]=g}o&&!n&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ys extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}class Ks extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==U)}}class Ws extends It{constructor(t,e,s,n,i){super(t,e,s,n,i),this.type=5}_$AI(t,e=this){if((t=At(this,t,e,0)??U)===ut)return;const s=this._$AH,n=t===U&&s!==U||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==U&&(s===U||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Gs{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){At(this,t)}}const Js=te.litHtmlPolyfillSupport;Js?.(_t,Ct),(te.litHtmlVersions??=[]).push("3.3.2");const Vs=(r,t,e)=>{const s=e?.renderBefore??t;let n=s._$litPart$;if(n===void 0){const i=e?.renderBefore??null;s._$litPart$=n=new Ct(t.insertBefore(Et(),i),i,void 0,e??{})}return n._$AI(r),n};const re=globalThis;let tt=class extends gt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Vs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ut}};tt._$litElement$=!0,tt.finalized=!0,re.litElementHydrateSupport?.({LitElement:tt});const Xs=re.litElementPolyfillSupport;Xs?.({LitElement:tt}),(re.litElementVersions??=[]).push("4.2.2");const Zs={attribute:!0,type:String,converter:Dt,reflect:!1,hasChanged:Zt},tr=(r=Zs,t,e)=>{const{kind:s,metadata:n}=e;let i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),i.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(a){const c=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,c,r,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,r,a),a}}}if(s==="setter"){const{name:o}=e;return function(a){const c=this[o];t.call(this,a),this.requestUpdate(o,c,r,!0,a)}}throw Error("Unsupported decorator location: "+s)};function x(r){return(t,e)=>typeof e=="object"?tr(r,t,e):((s,n,i)=>{const o=n.hasOwnProperty(i);return n.constructor.createProperty(i,s),o?Object.getOwnPropertyDescriptor(n,i):void 0})(r,t,e)}function I(r){return x({...r,state:!0,attribute:!1})}const er=(r,t,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(r,t,e),e);function Ke(r,t){return(e,s,n)=>{const i=o=>o.renderRoot?.querySelector(r)??null;return er(e,s,{get(){return i(this)}})}}const yt=function(r,t){let n=r;const i=St[t];let o=null,a=0,c=null;const g=[],A={},h=function(d,f){a=n*4+17,o=(function(l){const p=new Array(l);for(let u=0;u<l;u+=1){p[u]=new Array(l);for(let y=0;y<l;y+=1)p[u][y]=null}return p})(a),m(0,0),m(a-7,0),m(0,a-7),R(),D(),K(d,f),n>=7&&$(d),c==null&&(c=Pn(n,i,g)),Z(c,f)},m=function(d,f){for(let l=-1;l<=7;l+=1)if(!(d+l<=-1||a<=d+l))for(let p=-1;p<=7;p+=1)f+p<=-1||a<=f+p||(0<=l&&l<=6&&(p==0||p==6)||0<=p&&p<=6&&(l==0||l==6)||2<=l&&l<=4&&2<=p&&p<=4?o[d+l][f+p]=!0:o[d+l][f+p]=!1)},w=function(){let d=0,f=0;for(let l=0;l<8;l+=1){h(!0,l);const p=it.getLostPoint(A);(l==0||d>p)&&(d=p,f=l)}return f},D=function(){for(let d=8;d<a-8;d+=1)o[d][6]==null&&(o[d][6]=d%2==0);for(let d=8;d<a-8;d+=1)o[6][d]==null&&(o[6][d]=d%2==0)},R=function(){const d=it.getPatternPosition(n);for(let f=0;f<d.length;f+=1)for(let l=0;l<d.length;l+=1){const p=d[f],u=d[l];if(o[p][u]==null)for(let y=-2;y<=2;y+=1)for(let b=-2;b<=2;b+=1)y==-2||y==2||b==-2||b==2||y==0&&b==0?o[p+y][u+b]=!0:o[p+y][u+b]=!1}},$=function(d){const f=it.getBCHTypeNumber(n);for(let l=0;l<18;l+=1){const p=!d&&(f>>l&1)==1;o[Math.floor(l/3)][l%3+a-8-3]=p}for(let l=0;l<18;l+=1){const p=!d&&(f>>l&1)==1;o[l%3+a-8-3][Math.floor(l/3)]=p}},K=function(d,f){const l=i<<3|f,p=it.getBCHTypeInfo(l);for(let u=0;u<15;u+=1){const y=!d&&(p>>u&1)==1;u<6?o[u][8]=y:u<8?o[u+1][8]=y:o[a-15+u][8]=y}for(let u=0;u<15;u+=1){const y=!d&&(p>>u&1)==1;u<8?o[8][a-u-1]=y:u<9?o[8][15-u-1+1]=y:o[8][15-u-1]=y}o[a-8][8]=!d},Z=function(d,f){let l=-1,p=a-1,u=7,y=0;const b=it.getMaskFunction(f);for(let T=a-1;T>0;T-=2)for(T==6&&(T-=1);;){for(let O=0;O<2;O+=1)if(o[p][T-O]==null){let Q=!1;y<d.length&&(Q=(d[y]>>>u&1)==1),b(p,T-O)&&(Q=!Q),o[p][T-O]=Q,u-=1,u==-1&&(y+=1,u=7)}if(p+=l,p<0||a<=p){p-=l,l=-l;break}}},Tn=function(d,f){let l=0,p=0,u=0;const y=new Array(f.length),b=new Array(f.length);for(let v=0;v<f.length;v+=1){const L=f[v].dataCount,z=f[v].totalCount-L;p=Math.max(p,L),u=Math.max(u,z),y[v]=new Array(L);for(let et=0;et<y[v].length;et+=1)y[v][et]=255&d.getBuffer()[et+l];l+=L;const Pe=it.getErrorCorrectPolynomial(z),Ts=Tt(y[v],Pe.getLength()-1).mod(Pe);b[v]=new Array(Pe.getLength()-1);for(let et=0;et<b[v].length;et+=1){const Ps=et+Ts.getLength()-b[v].length;b[v][et]=Ps>=0?Ts.getAt(Ps):0}}let T=0;for(let v=0;v<f.length;v+=1)T+=f[v].totalCount;const O=new Array(T);let Q=0;for(let v=0;v<p;v+=1)for(let L=0;L<f.length;L+=1)v<y[L].length&&(O[Q]=y[L][v],Q+=1);for(let v=0;v<u;v+=1)for(let L=0;L<f.length;L+=1)v<b[L].length&&(O[Q]=b[L][v],Q+=1);return O},Pn=function(d,f,l){const p=We.getRSBlocks(d,f),u=Ge();for(let b=0;b<l.length;b+=1){const T=l[b];u.put(T.getMode(),4),u.put(T.getLength(),it.getLengthInBits(T.getMode(),d)),T.write(u)}let y=0;for(let b=0;b<p.length;b+=1)y+=p[b].dataCount;if(u.getLengthInBits()>y*8)throw"code length overflow. ("+u.getLengthInBits()+">"+y*8+")";for(u.getLengthInBits()+4<=y*8&&u.put(0,4);u.getLengthInBits()%8!=0;)u.putBit(!1);for(;!(u.getLengthInBits()>=y*8||(u.put(236,8),u.getLengthInBits()>=y*8));)u.put(17,8);return Tn(u,p)};A.addData=function(d,f){f=f||"Byte";let l=null;switch(f){case"Numeric":l=sr(d);break;case"Alphanumeric":l=rr(d);break;case"Byte":l=nr(d);break;case"Kanji":l=ir(d);break;default:throw"mode:"+f}g.push(l),c=null},A.isDark=function(d,f){if(d<0||a<=d||f<0||a<=f)throw d+","+f;return o[d][f]},A.getModuleCount=function(){return a},A.make=function(){if(n<1){let d=1;for(;d<40;d++){const f=We.getRSBlocks(d,i),l=Ge();for(let u=0;u<g.length;u++){const y=g[u];l.put(y.getMode(),4),l.put(y.getLength(),it.getLengthInBits(y.getMode(),d)),y.write(l)}let p=0;for(let u=0;u<f.length;u++)p+=f[u].dataCount;if(l.getLengthInBits()<=p*8)break}n=d}h(!1,w())},A.createTableTag=function(d,f){d=d||2,f=typeof f>"u"?d*4:f;let l="";l+='<table style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: "+f+"px;",l+='">',l+="<tbody>";for(let p=0;p<A.getModuleCount();p+=1){l+="<tr>";for(let u=0;u<A.getModuleCount();u+=1)l+='<td style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: 0px;",l+=" width: "+d+"px;",l+=" height: "+d+"px;",l+=" background-color: ",l+=A.isDark(p,u)?"#000000":"#ffffff",l+=";",l+='"/>';l+="</tr>"}return l+="</tbody>",l+="</table>",l},A.createSvgTag=function(d,f,l,p){let u={};typeof arguments[0]=="object"&&(u=arguments[0],d=u.cellSize,f=u.margin,l=u.alt,p=u.title),d=d||2,f=typeof f>"u"?d*4:f,l=typeof l=="string"?{text:l}:l||{},l.text=l.text||null,l.id=l.text?l.id||"qrcode-description":null,p=typeof p=="string"?{text:p}:p||{},p.text=p.text||null,p.id=p.text?p.id||"qrcode-title":null;const y=A.getModuleCount()*d+f*2;let b,T,O,Q,v="",L;for(L="l"+d+",0 0,"+d+" -"+d+",0 0,-"+d+"z ",v+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',v+=u.scalable?"":' width="'+y+'px" height="'+y+'px"',v+=' viewBox="0 0 '+y+" "+y+'" ',v+=' preserveAspectRatio="xMinYMin meet"',v+=p.text||l.text?' role="img" aria-labelledby="'+vt([p.id,l.id].join(" ").trim())+'"':"",v+=">",v+=p.text?'<title id="'+vt(p.id)+'">'+vt(p.text)+"</title>":"",v+=l.text?'<description id="'+vt(l.id)+'">'+vt(l.text)+"</description>":"",v+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',v+='<path d="',O=0;O<A.getModuleCount();O+=1)for(Q=O*d+f,b=0;b<A.getModuleCount();b+=1)A.isDark(O,b)&&(T=b*d+f,v+="M"+T+","+Q+L);return v+='" stroke="transparent" fill="black"/>',v+="</svg>",v},A.createDataURL=function(d,f){d=d||2,f=typeof f>"u"?d*4:f;const l=A.getModuleCount()*d+f*2,p=f,u=l-f;return lr(l,l,function(y,b){if(p<=y&&y<u&&p<=b&&b<u){const T=Math.floor((y-p)/d),O=Math.floor((b-p)/d);return A.isDark(O,T)?0:1}else return 1})},A.createImgTag=function(d,f,l){d=d||2,f=typeof f>"u"?d*4:f;const p=A.getModuleCount()*d+f*2;let u="";return u+="<img",u+=' src="',u+=A.createDataURL(d,f),u+='"',u+=' width="',u+=p,u+='"',u+=' height="',u+=p,u+='"',l&&(u+=' alt="',u+=vt(l),u+='"'),u+="/>",u};const vt=function(d){let f="";for(let l=0;l<d.length;l+=1){const p=d.charAt(l);switch(p){case"<":f+="&lt;";break;case">":f+="&gt;";break;case"&":f+="&amp;";break;case'"':f+="&quot;";break;default:f+=p;break}}return f},Bn=function(d){d=typeof d>"u"?2:d;const l=A.getModuleCount()*1+d*2,p=d,u=l-d;let y,b,T,O,Q;const v={"██":"█","█ ":"▀"," █":"▄","  ":" "},L={"██":"▀","█ ":"▀"," █":" ","  ":" "};let z="";for(y=0;y<l;y+=2){for(T=Math.floor((y-p)/1),O=Math.floor((y+1-p)/1),b=0;b<l;b+=1)Q="█",p<=b&&b<u&&p<=y&&y<u&&A.isDark(T,Math.floor((b-p)/1))&&(Q=" "),p<=b&&b<u&&p<=y+1&&y+1<u&&A.isDark(O,Math.floor((b-p)/1))?Q+=" ":Q+="█",z+=d<1&&y+1>=u?L[Q]:v[Q];z+=`
`}return l%2&&d>0?z.substring(0,z.length-l-1)+Array(l+1).join("▀"):z.substring(0,z.length-1)};return A.createASCII=function(d,f){if(d=d||1,d<2)return Bn(f);d-=1,f=typeof f>"u"?d*2:f;const l=A.getModuleCount()*d+f*2,p=f,u=l-f;let y,b,T,O;const Q=Array(d+1).join("██"),v=Array(d+1).join("  ");let L="",z="";for(y=0;y<l;y+=1){for(T=Math.floor((y-p)/d),z="",b=0;b<l;b+=1)O=1,p<=b&&b<u&&p<=y&&y<u&&A.isDark(T,Math.floor((b-p)/d))&&(O=0),z+=O?Q:v;for(T=0;T<d;T+=1)L+=z+`
`}return L.substring(0,L.length-1)},A.renderTo2dContext=function(d,f){f=f||2;const l=A.getModuleCount();for(let p=0;p<l;p++)for(let u=0;u<l;u++)d.fillStyle=A.isDark(p,u)?"black":"white",d.fillRect(u*f,p*f,f,f)},A};yt.stringToBytes=function(r){const t=[];for(let e=0;e<r.length;e+=1){const s=r.charCodeAt(e);t.push(s&255)}return t},yt.createStringToBytes=function(r,t){const e=(function(){const n=ar(r),i=function(){const c=n.read();if(c==-1)throw"eof";return c};let o=0;const a={};for(;;){const c=n.read();if(c==-1)break;const g=i(),A=i(),h=i(),m=String.fromCharCode(c<<8|g),w=A<<8|h;a[m]=w,o+=1}if(o!=t)throw o+" != "+t;return a})(),s=63;return function(n){const i=[];for(let o=0;o<n.length;o+=1){const a=n.charCodeAt(o);if(a<128)i.push(a);else{const c=e[n.charAt(o)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(s)}}return i}};const H={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},St={L:1,M:0,Q:3,H:2},nt={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},it=(function(){const r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,s=21522,n={},i=function(o){let a=0;for(;o!=0;)a+=1,o>>>=1;return a};return n.getBCHTypeInfo=function(o){let a=o<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(o<<10|a)^s},n.getBCHTypeNumber=function(o){let a=o<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return o<<12|a},n.getPatternPosition=function(o){return r[o-1]},n.getMaskFunction=function(o){switch(o){case nt.PATTERN000:return function(a,c){return(a+c)%2==0};case nt.PATTERN001:return function(a,c){return a%2==0};case nt.PATTERN010:return function(a,c){return c%3==0};case nt.PATTERN011:return function(a,c){return(a+c)%3==0};case nt.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case nt.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case nt.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case nt.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+o}},n.getErrorCorrectPolynomial=function(o){let a=Tt([1],0);for(let c=0;c<o;c+=1)a=a.multiply(Tt([1,ot.gexp(c)],0));return a},n.getLengthInBits=function(o,a){if(1<=a&&a<10)switch(o){case H.MODE_NUMBER:return 10;case H.MODE_ALPHA_NUM:return 9;case H.MODE_8BIT_BYTE:return 8;case H.MODE_KANJI:return 8;default:throw"mode:"+o}else if(a<27)switch(o){case H.MODE_NUMBER:return 12;case H.MODE_ALPHA_NUM:return 11;case H.MODE_8BIT_BYTE:return 16;case H.MODE_KANJI:return 10;default:throw"mode:"+o}else if(a<41)switch(o){case H.MODE_NUMBER:return 14;case H.MODE_ALPHA_NUM:return 13;case H.MODE_8BIT_BYTE:return 16;case H.MODE_KANJI:return 12;default:throw"mode:"+o}else throw"type:"+a},n.getLostPoint=function(o){const a=o.getModuleCount();let c=0;for(let h=0;h<a;h+=1)for(let m=0;m<a;m+=1){let w=0;const D=o.isDark(h,m);for(let R=-1;R<=1;R+=1)if(!(h+R<0||a<=h+R))for(let $=-1;$<=1;$+=1)m+$<0||a<=m+$||R==0&&$==0||D==o.isDark(h+R,m+$)&&(w+=1);w>5&&(c+=3+w-5)}for(let h=0;h<a-1;h+=1)for(let m=0;m<a-1;m+=1){let w=0;o.isDark(h,m)&&(w+=1),o.isDark(h+1,m)&&(w+=1),o.isDark(h,m+1)&&(w+=1),o.isDark(h+1,m+1)&&(w+=1),(w==0||w==4)&&(c+=3)}for(let h=0;h<a;h+=1)for(let m=0;m<a-6;m+=1)o.isDark(h,m)&&!o.isDark(h,m+1)&&o.isDark(h,m+2)&&o.isDark(h,m+3)&&o.isDark(h,m+4)&&!o.isDark(h,m+5)&&o.isDark(h,m+6)&&(c+=40);for(let h=0;h<a;h+=1)for(let m=0;m<a-6;m+=1)o.isDark(m,h)&&!o.isDark(m+1,h)&&o.isDark(m+2,h)&&o.isDark(m+3,h)&&o.isDark(m+4,h)&&!o.isDark(m+5,h)&&o.isDark(m+6,h)&&(c+=40);let g=0;for(let h=0;h<a;h+=1)for(let m=0;m<a;m+=1)o.isDark(m,h)&&(g+=1);const A=Math.abs(100*g/a/a-50)/5;return c+=A*10,c},n})(),ot=(function(){const r=new Array(256),t=new Array(256);for(let s=0;s<8;s+=1)r[s]=1<<s;for(let s=8;s<256;s+=1)r[s]=r[s-4]^r[s-5]^r[s-6]^r[s-8];for(let s=0;s<255;s+=1)t[r[s]]=s;const e={};return e.glog=function(s){if(s<1)throw"glog("+s+")";return t[s]},e.gexp=function(s){for(;s<0;)s+=255;for(;s>=256;)s-=255;return r[s]},e})(),Tt=function(r,t){if(typeof r.length>"u")throw r.length+"/"+t;const e=(function(){let n=0;for(;n<r.length&&r[n]==0;)n+=1;const i=new Array(r.length-n+t);for(let o=0;o<r.length-n;o+=1)i[o]=r[o+n];return i})(),s={};return s.getAt=function(n){return e[n]},s.getLength=function(){return e.length},s.multiply=function(n){const i=new Array(s.getLength()+n.getLength()-1);for(let o=0;o<s.getLength();o+=1)for(let a=0;a<n.getLength();a+=1)i[o+a]^=ot.gexp(ot.glog(s.getAt(o))+ot.glog(n.getAt(a)));return Tt(i,0)},s.mod=function(n){if(s.getLength()-n.getLength()<0)return s;const i=ot.glog(s.getAt(0))-ot.glog(n.getAt(0)),o=new Array(s.getLength());for(let a=0;a<s.getLength();a+=1)o[a]=s.getAt(a);for(let a=0;a<n.getLength();a+=1)o[a]^=ot.gexp(ot.glog(n.getAt(a))+i);return Tt(o,0).mod(n)},s},We=(function(){const r=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(n,i){const o={};return o.totalCount=n,o.dataCount=i,o},e={},s=function(n,i){switch(i){case St.L:return r[(n-1)*4+0];case St.M:return r[(n-1)*4+1];case St.Q:return r[(n-1)*4+2];case St.H:return r[(n-1)*4+3];default:return}};return e.getRSBlocks=function(n,i){const o=s(n,i);if(typeof o>"u")throw"bad rs block @ typeNumber:"+n+"/errorCorrectionLevel:"+i;const a=o.length/3,c=[];for(let g=0;g<a;g+=1){const A=o[g*3+0],h=o[g*3+1],m=o[g*3+2];for(let w=0;w<A;w+=1)c.push(t(h,m))}return c},e})(),Ge=function(){const r=[];let t=0;const e={};return e.getBuffer=function(){return r},e.getAt=function(s){const n=Math.floor(s/8);return(r[n]>>>7-s%8&1)==1},e.put=function(s,n){for(let i=0;i<n;i+=1)e.putBit((s>>>n-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(s){const n=Math.floor(t/8);r.length<=n&&r.push(0),s&&(r[n]|=128>>>t%8),t+=1},e},sr=function(r){const t=H.MODE_NUMBER,e=r,s={};s.getMode=function(){return t},s.getLength=function(o){return e.length},s.write=function(o){const a=e;let c=0;for(;c+2<a.length;)o.put(n(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?o.put(n(a.substring(c,c+1)),4):a.length-c==2&&o.put(n(a.substring(c,c+2)),7))};const n=function(o){let a=0;for(let c=0;c<o.length;c+=1)a=a*10+i(o.charAt(c));return a},i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return s},rr=function(r){const t=H.MODE_ALPHA_NUM,e=r,s={};s.getMode=function(){return t},s.getLength=function(i){return e.length},s.write=function(i){const o=e;let a=0;for(;a+1<o.length;)i.put(n(o.charAt(a))*45+n(o.charAt(a+1)),11),a+=2;a<o.length&&i.put(n(o.charAt(a)),6)};const n=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return s},nr=function(r){const t=H.MODE_8BIT_BYTE,e=yt.stringToBytes(r),s={};return s.getMode=function(){return t},s.getLength=function(n){return e.length},s.write=function(n){for(let i=0;i<e.length;i+=1)n.put(e[i],8)},s},ir=function(r){const t=H.MODE_KANJI,e=yt.stringToBytes;(function(i,o){const a=e(i);if(a.length!=2||(a[0]<<8|a[1])!=o)throw"sjis not supported."})("友",38726);const s=e(r),n={};return n.getMode=function(){return t},n.getLength=function(i){return~~(s.length/2)},n.write=function(i){const o=s;let a=0;for(;a+1<o.length;){let c=(255&o[a])<<8|255&o[a+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(a+1)+"/"+c;c=(c>>>8&255)*192+(c&255),i.put(c,13),a+=2}if(a<o.length)throw"illegal char at "+(a+1)},n},Je=function(){const r=[],t={};return t.writeByte=function(e){r.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,s,n){s=s||0,n=n||e.length;for(let i=0;i<n;i+=1)t.writeByte(e[i+s])},t.writeString=function(e){for(let s=0;s<e.length;s+=1)t.writeByte(e.charCodeAt(s))},t.toByteArray=function(){return r},t.toString=function(){let e="";e+="[";for(let s=0;s<r.length;s+=1)s>0&&(e+=","),e+=r[s];return e+="]",e},t},or=function(){let r=0,t=0,e=0,s="";const n={},i=function(a){s+=String.fromCharCode(o(a&63))},o=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return n.writeByte=function(a){for(r=r<<8|a&255,t+=8,e+=1;t>=6;)i(r>>>t-6),t-=6},n.flush=function(){if(t>0&&(i(r<<6-t),r=0,t=0),e%3!=0){const a=3-e%3;for(let c=0;c<a;c+=1)s+="="}},n.toString=function(){return s},n},ar=function(r){const t=r;let e=0,s=0,n=0;const i={};i.read=function(){for(;n<8;){if(e>=t.length){if(n==0)return-1;throw"unexpected end of file./"+n}const c=t.charAt(e);if(e+=1,c=="=")return n=0,-1;if(c.match(/^\s$/))continue;s=s<<6|o(c.charCodeAt(0)),n+=6}const a=s>>>n-8&255;return n-=8,a};const o=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},cr=function(r,t){const e=r,s=t,n=new Array(r*t),i={};i.setPixel=function(g,A,h){n[A*e+g]=h},i.write=function(g){g.writeString("GIF87a"),g.writeShort(e),g.writeShort(s),g.writeByte(128),g.writeByte(0),g.writeByte(0),g.writeByte(0),g.writeByte(0),g.writeByte(0),g.writeByte(255),g.writeByte(255),g.writeByte(255),g.writeString(","),g.writeShort(0),g.writeShort(0),g.writeShort(e),g.writeShort(s),g.writeByte(0);const A=2,h=a(A);g.writeByte(A);let m=0;for(;h.length-m>255;)g.writeByte(255),g.writeBytes(h,m,255),m+=255;g.writeByte(h.length-m),g.writeBytes(h,m,h.length-m),g.writeByte(0),g.writeString(";")};const o=function(g){const A=g;let h=0,m=0;const w={};return w.write=function(D,R){if(D>>>R)throw"length over";for(;h+R>=8;)A.writeByte(255&(D<<h|m)),R-=8-h,D>>>=8-h,m=0,h=0;m=D<<h|m,h=h+R},w.flush=function(){h>0&&A.writeByte(m)},w},a=function(g){const A=1<<g,h=(1<<g)+1;let m=g+1;const w=c();for(let Z=0;Z<A;Z+=1)w.add(String.fromCharCode(Z));w.add(String.fromCharCode(A)),w.add(String.fromCharCode(h));const D=Je(),R=o(D);R.write(A,m);let $=0,K=String.fromCharCode(n[$]);for($+=1;$<n.length;){const Z=String.fromCharCode(n[$]);$+=1,w.contains(K+Z)?K=K+Z:(R.write(w.indexOf(K),m),w.size()<4095&&(w.size()==1<<m&&(m+=1),w.add(K+Z)),K=Z)}return R.write(w.indexOf(K),m),R.write(h,m),R.flush(),D.toByteArray()},c=function(){const g={};let A=0;const h={};return h.add=function(m){if(h.contains(m))throw"dup key:"+m;g[m]=A,A+=1},h.size=function(){return A},h.indexOf=function(m){return g[m]},h.contains=function(m){return typeof g[m]<"u"},h};return i},lr=function(r,t,e){const s=cr(r,t);for(let a=0;a<t;a+=1)for(let c=0;c<r;c+=1)s.setPixel(c,a,e(c,a));const n=Je();s.write(n);const i=or(),o=n.toByteArray();for(let a=0;a<o.length;a+=1)i.writeByte(o[a]);return i.flush(),"data:image/gif;base64,"+i};yt.stringToBytes;const V=Object.create(null);V.open="0",V.close="1",V.ping="2",V.pong="3",V.message="4",V.upgrade="5",V.noop="6";const Mt=Object.create(null);Object.keys(V).forEach(r=>{Mt[V[r]]=r});const ne={type:"error",data:"parser error"},Ve=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Xe=typeof ArrayBuffer=="function",Ze=r=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(r):r&&r.buffer instanceof ArrayBuffer,ie=({type:r,data:t},e,s)=>Ve&&t instanceof Blob?e?s(t):ts(t,s):Xe&&(t instanceof ArrayBuffer||Ze(t))?e?s(t):ts(new Blob([t]),s):s(V[r]+(t||"")),ts=(r,t)=>{const e=new FileReader;return e.onload=function(){const s=e.result.split(",")[1];t("b"+(s||""))},e.readAsDataURL(r)};function es(r){return r instanceof Uint8Array?r:r instanceof ArrayBuffer?new Uint8Array(r):new Uint8Array(r.buffer,r.byteOffset,r.byteLength)}let oe;function dr(r,t){if(Ve&&r.data instanceof Blob)return r.data.arrayBuffer().then(es).then(t);if(Xe&&(r.data instanceof ArrayBuffer||Ze(r.data)))return t(es(r.data));ie(r,!1,e=>{oe||(oe=new TextEncoder),t(oe.encode(e))})}const ss="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Pt=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let r=0;r<ss.length;r++)Pt[ss.charCodeAt(r)]=r;const hr=r=>{let t=r.length*.75,e=r.length,s,n=0,i,o,a,c;r[r.length-1]==="="&&(t--,r[r.length-2]==="="&&t--);const g=new ArrayBuffer(t),A=new Uint8Array(g);for(s=0;s<e;s+=4)i=Pt[r.charCodeAt(s)],o=Pt[r.charCodeAt(s+1)],a=Pt[r.charCodeAt(s+2)],c=Pt[r.charCodeAt(s+3)],A[n++]=i<<2|o>>4,A[n++]=(o&15)<<4|a>>2,A[n++]=(a&3)<<6|c&63;return g},ur=typeof ArrayBuffer=="function",ae=(r,t)=>{if(typeof r!="string")return{type:"message",data:rs(r,t)};const e=r.charAt(0);return e==="b"?{type:"message",data:pr(r.substring(1),t)}:Mt[e]?r.length>1?{type:Mt[e],data:r.substring(1)}:{type:Mt[e]}:ne},pr=(r,t)=>{if(ur){const e=hr(r);return rs(e,t)}else return{base64:!0,data:r}},rs=(r,t)=>t==="blob"?r instanceof Blob?r:new Blob([r]):r instanceof ArrayBuffer?r:r.buffer,ns="",fr=(r,t)=>{const e=r.length,s=new Array(e);let n=0;r.forEach((i,o)=>{ie(i,!1,a=>{s[o]=a,++n===e&&t(s.join(ns))})})},mr=(r,t)=>{const e=r.split(ns),s=[];for(let n=0;n<e.length;n++){const i=ae(e[n],t);if(s.push(i),i.type==="error")break}return s};function gr(){return new TransformStream({transform(r,t){dr(r,e=>{const s=e.length;let n;if(s<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,s);else if(s<65536){n=new Uint8Array(3);const i=new DataView(n.buffer);i.setUint8(0,126),i.setUint16(1,s)}else{n=new Uint8Array(9);const i=new DataView(n.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(s))}r.data&&typeof r.data!="string"&&(n[0]|=128),t.enqueue(n),t.enqueue(e)})}})}let ce;function Qt(r){return r.reduce((t,e)=>t+e.length,0)}function Ut(r,t){if(r[0].length===t)return r.shift();const e=new Uint8Array(t);let s=0;for(let n=0;n<t;n++)e[n]=r[0][s++],s===r[0].length&&(r.shift(),s=0);return r.length&&s<r[0].length&&(r[0]=r[0].slice(s)),e}function Ar(r,t){ce||(ce=new TextDecoder);const e=[];let s=0,n=-1,i=!1;return new TransformStream({transform(o,a){for(e.push(o);;){if(s===0){if(Qt(e)<1)break;const c=Ut(e,1);i=(c[0]&128)===128,n=c[0]&127,n<126?s=3:n===126?s=1:s=2}else if(s===1){if(Qt(e)<2)break;const c=Ut(e,2);n=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),s=3}else if(s===2){if(Qt(e)<8)break;const c=Ut(e,8),g=new DataView(c.buffer,c.byteOffset,c.length),A=g.getUint32(0);if(A>Math.pow(2,21)-1){a.enqueue(ne);break}n=A*Math.pow(2,32)+g.getUint32(4),s=3}else{if(Qt(e)<n)break;const c=Ut(e,n);a.enqueue(ae(i?c:ce.decode(c),t)),s=0}if(n===0||n>r){a.enqueue(ne);break}}}})}const is=4;function F(r){if(r)return yr(r)}function yr(r){for(var t in F.prototype)r[t]=F.prototype[t];return r}F.prototype.on=F.prototype.addEventListener=function(r,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+r]=this._callbacks["$"+r]||[]).push(t),this},F.prototype.once=function(r,t){function e(){this.off(r,e),t.apply(this,arguments)}return e.fn=t,this.on(r,e),this},F.prototype.off=F.prototype.removeListener=F.prototype.removeAllListeners=F.prototype.removeEventListener=function(r,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+r];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+r],this;for(var s,n=0;n<e.length;n++)if(s=e[n],s===t||s.fn===t){e.splice(n,1);break}return e.length===0&&delete this._callbacks["$"+r],this},F.prototype.emit=function(r){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),e=this._callbacks["$"+r],s=1;s<arguments.length;s++)t[s-1]=arguments[s];if(e){e=e.slice(0);for(var s=0,n=e.length;s<n;++s)e[s].apply(this,t)}return this},F.prototype.emitReserved=F.prototype.emit,F.prototype.listeners=function(r){return this._callbacks=this._callbacks||{},this._callbacks["$"+r]||[]},F.prototype.hasListeners=function(r){return!!this.listeners(r).length};const Ft=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,e)=>e(t,0),j=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),br="arraybuffer";function Rn(){}function os(r,...t){return t.reduce((e,s)=>(r.hasOwnProperty(s)&&(e[s]=r[s]),e),{})}const vr=j.setTimeout,wr=j.clearTimeout;function qt(r,t){t.useNativeTimers?(r.setTimeoutFn=vr.bind(j),r.clearTimeoutFn=wr.bind(j)):(r.setTimeoutFn=j.setTimeout.bind(j),r.clearTimeoutFn=j.clearTimeout.bind(j))}const Er=1.33;function xr(r){return typeof r=="string"?kr(r):Math.ceil((r.byteLength||r.size)*Er)}function kr(r){let t=0,e=0;for(let s=0,n=r.length;s<n;s++)t=r.charCodeAt(s),t<128?e+=1:t<2048?e+=2:t<55296||t>=57344?e+=3:(s++,e+=4);return e}function as(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function _r(r){let t="";for(let e in r)r.hasOwnProperty(e)&&(t.length&&(t+="&"),t+=encodeURIComponent(e)+"="+encodeURIComponent(r[e]));return t}function Cr(r){let t={},e=r.split("&");for(let s=0,n=e.length;s<n;s++){let i=e[s].split("=");t[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return t}class Sr extends Error{constructor(t,e,s){super(t),this.description=e,this.context=s,this.type="TransportError"}}class le extends F{constructor(t){super(),this.writable=!1,qt(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,e,s){return super.emitReserved("error",new Sr(t,e,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const e=ae(t,this.socket.binaryType);this.onPacket(e)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,e={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const e=_r(t);return e.length?"?"+e:""}}class Tr extends le{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const e=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let s=0;this._polling&&(s++,this.once("pollComplete",function(){--s||e()})),this.writable||(s++,this.once("drain",function(){--s||e()}))}else e()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const e=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};mr(t,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,fr(t,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=as()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(t,e)}}let cs=!1;try{cs=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Pr=cs;function Br(){}class Rr extends Tr{constructor(t){if(super(t),typeof location<"u"){const e=location.protocol==="https:";let s=location.port;s||(s=e?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||s!==t.port}}doWrite(t,e){const s=this.request({method:"POST",data:t});s.on("success",e),s.on("error",(n,i)=>{this.onError("xhr post error",n,i)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(e,s)=>{this.onError("xhr poll error",e,s)}),this.pollXhr=t}}class X extends F{constructor(t,e,s){super(),this.createRequest=t,qt(this,s),this._opts=s,this._method=s.method||"GET",this._uri=e,this._data=s.data!==void 0?s.data:null,this._create()}_create(){var t;const e=os(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;const s=this._xhr=this.createRequest(e);try{s.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&s.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{s.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(s),"withCredentials"in s&&(s.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(s.timeout=this._opts.requestTimeout),s.onreadystatechange=()=>{var n;s.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(s.getResponseHeader("set-cookie"))),s.readyState===4&&(s.status===200||s.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof s.status=="number"?s.status:0)},0))},s.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=X.requestsCount++,X.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Br,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete X.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}if(X.requestsCount=0,X.requests={},typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",ls);else if(typeof addEventListener=="function"){const r="onpagehide"in j?"pagehide":"unload";addEventListener(r,ls,!1)}}function ls(){for(let r in X.requests)X.requests.hasOwnProperty(r)&&X.requests[r].abort()}const $r=(function(){const r=ds({xdomain:!1});return r&&r.responseType!==null})();class Nr extends Rr{constructor(t){super(t);const e=t&&t.forceBase64;this.supportsBinary=$r&&!e}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new X(ds,this.uri(),t)}}function ds(r){const t=r.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||Pr))return new XMLHttpRequest}catch{}if(!t)try{return new j[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const hs=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Or extends le{get name(){return"websocket"}doOpen(){const t=this.uri(),e=this.opts.protocols,s=hs?{}:os(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,e,s)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let e=0;e<t.length;e++){const s=t[e],n=e===t.length-1;ie(s,this.supportsBinary,i=>{try{this.doWrite(s,i)}catch{}n&&Ft(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=as()),this.supportsBinary||(e.b64=1),this.createUri(t,e)}}const de=j.WebSocket||j.MozWebSocket;class Dr extends Or{createSocket(t,e,s){return hs?new de(t,e,s):e?new de(t,e):new de(t)}doWrite(t,e){this.ws.send(e)}}class Lr extends le{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const e=Ar(Number.MAX_SAFE_INTEGER,this.socket.binaryType),s=t.readable.pipeThrough(e).getReader(),n=gr();n.readable.pipeTo(t.writable),this._writer=n.writable.getWriter();const i=()=>{s.read().then(({done:a,value:c})=>{a||(this.onPacket(c),i())}).catch(a=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let e=0;e<t.length;e++){const s=t[e],n=e===t.length-1;this._writer.write(s).then(()=>{n&&Ft(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const Ir={websocket:Dr,webtransport:Lr,polling:Nr},Mr=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Qr=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function he(r){if(r.length>8e3)throw"URI too long";const t=r,e=r.indexOf("["),s=r.indexOf("]");e!=-1&&s!=-1&&(r=r.substring(0,e)+r.substring(e,s).replace(/:/g,";")+r.substring(s,r.length));let n=Mr.exec(r||""),i={},o=14;for(;o--;)i[Qr[o]]=n[o]||"";return e!=-1&&s!=-1&&(i.source=t,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=Ur(i,i.path),i.queryKey=Fr(i,i.query),i}function Ur(r,t){const e=/\/{2,9}/g,s=t.replace(e,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&s.splice(0,1),t.slice(-1)=="/"&&s.splice(s.length-1,1),s}function Fr(r,t){const e={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,n,i){n&&(e[n]=i)}),e}const ue=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ht=[];ue&&addEventListener("offline",()=>{Ht.forEach(r=>r())},!1);class at extends F{constructor(t,e){if(super(),this.binaryType=br,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(e=t,t=null),t){const s=he(t);e.hostname=s.host,e.secure=s.protocol==="https"||s.protocol==="wss",e.port=s.port,s.query&&(e.query=s.query)}else e.host&&(e.hostname=he(e.host).host);qt(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(s=>{const n=s.prototype.name;this.transports.push(n),this._transportsByName[n]=s}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Cr(this.opts.query)),ue&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ht.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const e=Object.assign({},this.opts.query);e.EIO=is,e.transport=t,this.id&&(e.sid=this.id);const s=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](s)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&at.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const e=this.createTransport(t);e.open(),this.setTransport(e)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){this.readyState="open",at.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const e=new Error("server error");e.code=t.data,this._onError(e);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let s=0;s<this.writeBuffer.length;s++){const n=this.writeBuffer[s].data;if(n&&(e+=xr(n)),s>0&&e>this._maxPayload)return this.writeBuffer.slice(0,s);e+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,Ft(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,e,s){return this._sendPacket("message",t,e,s),this}send(t,e,s){return this._sendPacket("message",t,e,s),this}_sendPacket(t,e,s,n){if(typeof e=="function"&&(n=e,e=void 0),typeof s=="function"&&(n=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const i={type:t,data:e,options:s};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),n&&this.once("flush",n),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),t()},s=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():t()}):this.upgrading?s():t()),this}_onError(t){if(at.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ue&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const s=Ht.indexOf(this._offlineEventListener);s!==-1&&Ht.splice(s,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,e),this.writeBuffer=[],this._prevBufferLen=0}}}at.protocol=is;class qr extends at{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let e=this.createTransport(t),s=!1;at.priorWebsocketSuccess=!1;const n=()=>{s||(e.send([{type:"ping",data:"probe"}]),e.once("packet",h=>{if(!s)if(h.type==="pong"&&h.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;at.priorWebsocketSuccess=e.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(A(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{const m=new Error("probe error");m.transport=e.name,this.emitReserved("upgradeError",m)}}))};function i(){s||(s=!0,A(),e.close(),e=null)}const o=h=>{const m=new Error("probe error: "+h);m.transport=e.name,i(),this.emitReserved("upgradeError",m)};function a(){o("transport closed")}function c(){o("socket closed")}function g(h){e&&h.name!==e.name&&i()}const A=()=>{e.removeListener("open",n),e.removeListener("error",o),e.removeListener("close",a),this.off("close",c),this.off("upgrading",g)};e.once("open",n),e.once("error",o),e.once("close",a),this.once("close",c),this.once("upgrading",g),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{s||e.open()},200):e.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const e=[];for(let s=0;s<t.length;s++)~this.transports.indexOf(t[s])&&e.push(t[s]);return e}}let Hr=class extends qr{constructor(t,e={}){const s=typeof t=="object"?t:e;(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>Ir[n]).filter(n=>!!n)),super(t,s)}};function zr(r,t="",e){let s=r;e=e||typeof location<"u"&&location,r==null&&(r=e.protocol+"//"+e.host),typeof r=="string"&&(r.charAt(0)==="/"&&(r.charAt(1)==="/"?r=e.protocol+r:r=e.host+r),/^(https?|wss?):\/\//.test(r)||(typeof e<"u"?r=e.protocol+"//"+r:r="https://"+r),s=he(r)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const i=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+i+":"+s.port+t,s.href=s.protocol+"://"+i+(e&&e.port===s.port?"":":"+s.port),s}const jr=typeof ArrayBuffer=="function",Yr=r=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(r):r.buffer instanceof ArrayBuffer,us=Object.prototype.toString,Kr=typeof Blob=="function"||typeof Blob<"u"&&us.call(Blob)==="[object BlobConstructor]",Wr=typeof File=="function"||typeof File<"u"&&us.call(File)==="[object FileConstructor]";function pe(r){return jr&&(r instanceof ArrayBuffer||Yr(r))||Kr&&r instanceof Blob||Wr&&r instanceof File}function zt(r,t){if(!r||typeof r!="object")return!1;if(Array.isArray(r)){for(let e=0,s=r.length;e<s;e++)if(zt(r[e]))return!0;return!1}if(pe(r))return!0;if(r.toJSON&&typeof r.toJSON=="function"&&arguments.length===1)return zt(r.toJSON(),!0);for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e)&&zt(r[e]))return!0;return!1}function Gr(r){const t=[],e=r.data,s=r;return s.data=jt(e,t),s.attachments=t.length,{packet:s,buffers:t}}function jt(r,t,e){if(!r)return r;if(pe(r)){const s={_placeholder:!0,num:t.length};return t.push(r),s}else if(Array.isArray(r)){const s=new Array(r.length);for(let n=0;n<r.length;n++)s[n]=jt(r[n],t);return s}else if(typeof r=="object"&&!(r instanceof Date)){if(r.toJSON&&typeof r.toJSON=="function"&&!e)return jt(r.toJSON(),t,!0);const s={};for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&(s[n]=jt(r[n],t));return s}return r}function Jr(r,t){return r.data=fe(r.data,t),delete r.attachments,r}function fe(r,t){if(!r)return r;if(r&&r._placeholder===!0){if(typeof r.num=="number"&&r.num>=0&&r.num<t.length)return t[r.num];throw new Error("illegal attachments")}else if(Array.isArray(r))for(let e=0;e<r.length;e++)r[e]=fe(r[e],t);else if(typeof r=="object")for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&(r[e]=fe(r[e],t));return r}const Vr=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var k;(function(r){r[r.CONNECT=0]="CONNECT",r[r.DISCONNECT=1]="DISCONNECT",r[r.EVENT=2]="EVENT",r[r.ACK=3]="ACK",r[r.CONNECT_ERROR=4]="CONNECT_ERROR",r[r.BINARY_EVENT=5]="BINARY_EVENT",r[r.BINARY_ACK=6]="BINARY_ACK"})(k||(k={}));class Xr{constructor(t){this.replacer=t}encode(t){return(t.type===k.EVENT||t.type===k.ACK)&&zt(t)?this.encodeAsBinary({type:t.type===k.EVENT?k.BINARY_EVENT:k.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let e=""+t.type;return(t.type===k.BINARY_EVENT||t.type===k.BINARY_ACK)&&(e+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(e+=t.nsp+","),t.id!=null&&(e+=t.id),t.data!=null&&(e+=JSON.stringify(t.data,this.replacer)),e}encodeAsBinary(t){const e=Gr(t),s=this.encodeAsString(e.packet),n=e.buffers;return n.unshift(s),n}}class me extends F{constructor(t){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof t=="function"?{reviver:t}:t)}add(t){let e;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");e=this.decodeString(t);const s=e.type===k.BINARY_EVENT;s||e.type===k.BINARY_ACK?(e.type=s?k.EVENT:k.ACK,this.reconstructor=new Zr(e)):super.emitReserved("decoded",e)}else if(pe(t)||t.base64)if(this.reconstructor)e=this.reconstructor.takeBinaryData(t),e&&(this.reconstructor=null,super.emitReserved("decoded",e));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let e=0;const s={type:Number(t.charAt(0))};if(k[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===k.BINARY_EVENT||s.type===k.BINARY_ACK){const i=e+1;for(;t.charAt(++e)!=="-"&&e!=t.length;);const o=t.substring(i,e);if(o!=Number(o)||t.charAt(e)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!tn(a)||a<1)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");s.attachments=a}if(t.charAt(e+1)==="/"){const i=e+1;for(;++e&&!(t.charAt(e)===","||e===t.length););s.nsp=t.substring(i,e)}else s.nsp="/";const n=t.charAt(e+1);if(n!==""&&Number(n)==n){const i=e+1;for(;++e;){const o=t.charAt(e);if(o==null||Number(o)!=o){--e;break}if(e===t.length)break}s.id=Number(t.substring(i,e+1))}if(t.charAt(++e)){const i=this.tryParse(t.substr(e));if(me.isPayloadValid(s.type,i))s.data=i;else throw new Error("invalid payload")}return s}tryParse(t){try{return JSON.parse(t,this.opts.reviver)}catch{return!1}}static isPayloadValid(t,e){switch(t){case k.CONNECT:return ps(e);case k.DISCONNECT:return e===void 0;case k.CONNECT_ERROR:return typeof e=="string"||ps(e);case k.EVENT:case k.BINARY_EVENT:return Array.isArray(e)&&(typeof e[0]=="number"||typeof e[0]=="string"&&Vr.indexOf(e[0])===-1);case k.ACK:case k.BINARY_ACK:return Array.isArray(e)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Zr{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const e=Jr(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const tn=Number.isInteger||function(r){return typeof r=="number"&&isFinite(r)&&Math.floor(r)===r};function ps(r){return Object.prototype.toString.call(r)==="[object Object]"}const en=Object.freeze(Object.defineProperty({__proto__:null,Decoder:me,Encoder:Xr,get PacketType(){return k}},Symbol.toStringTag,{value:"Module"}));function W(r,t,e){return r.on(t,e),function(){r.off(t,e)}}const sn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class fs extends F{constructor(t,e,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=e,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[W(t,"open",this.onopen.bind(this)),W(t,"packet",this.onpacket.bind(this)),W(t,"error",this.onerror.bind(this)),W(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...e){var s,n,i;if(sn.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(e.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(e),this;const o={type:k.EVENT,data:e};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof e[e.length-1]=="function"){const A=this.ids++,h=e.pop();this._registerAckCallback(A,h),o.id=A}const a=(n=(s=this.io.engine)===null||s===void 0?void 0:s.transport)===null||n===void 0?void 0:n.writable,c=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!a||(c?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(t,e){var s;const n=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(n===void 0){this.acks[t]=e;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===t&&this.sendBuffer.splice(a,1);e.call(this,new Error("operation has timed out"))},n),o=(...a)=>{this.io.clearTimeoutFn(i),e.apply(this,a)};o.withError=!0,this.acks[t]=o}emitWithAck(t,...e){return new Promise((s,n)=>{const i=(o,a)=>o?n(o):s(a);i.withError=!0,e.push(i),this.emit(t,...e)})}_addToQueue(t){let e;typeof t[t.length-1]=="function"&&(e=t.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((n,...i)=>(this._queue[0],n!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),e&&e(n)):(this._queue.shift(),e&&e(null,...i)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const e=this._queue[0];e.pending&&!t||(e.pending=!0,e.tryCount++,this.flags=e.flags,this.emit.apply(this,e.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:k.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,e){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,e),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(s=>String(s.id)===t)){const s=this.acks[t];delete this.acks[t],s.withError&&s.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case k.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case k.EVENT:case k.BINARY_EVENT:this.onevent(t);break;case k.ACK:case k.BINARY_ACK:this.onack(t);break;case k.DISCONNECT:this.ondisconnect();break;case k.CONNECT_ERROR:this.destroy();const s=new Error(t.data.message);s.data=t.data.data,this.emitReserved("connect_error",s);break}}onevent(t){const e=t.data||[];t.id!=null&&e.push(this.ack(t.id)),this.connected?this.emitEvent(e):this.receiveBuffer.push(Object.freeze(e))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const e=this._anyListeners.slice();for(const s of e)s.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const e=this;let s=!1;return function(...n){s||(s=!0,e.packet({type:k.ACK,id:t,data:n}))}}onack(t){const e=this.acks[t.id];typeof e=="function"&&(delete this.acks[t.id],e.withError&&t.data.unshift(null),e.apply(this,t.data))}onconnect(t,e){this.id=t,this.recovered=e&&this._pid===e,this._pid=e,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:k.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const e=this._anyListeners;for(let s=0;s<e.length;s++)if(t===e[s])return e.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const e=this._anyOutgoingListeners;for(let s=0;s<e.length;s++)if(t===e[s])return e.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const e=this._anyOutgoingListeners.slice();for(const s of e)s.apply(this,t.data)}}}function bt(r){r=r||{},this.ms=r.min||100,this.max=r.max||1e4,this.factor=r.factor||2,this.jitter=r.jitter>0&&r.jitter<=1?r.jitter:0,this.attempts=0}bt.prototype.duration=function(){var r=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),e=Math.floor(t*this.jitter*r);r=(Math.floor(t*10)&1)==0?r-e:r+e}return Math.min(r,this.max)|0},bt.prototype.reset=function(){this.attempts=0},bt.prototype.setMin=function(r){this.ms=r},bt.prototype.setMax=function(r){this.max=r},bt.prototype.setJitter=function(r){this.jitter=r};class ge extends F{constructor(t,e){var s;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.opts=e,qt(this,e),this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor((s=e.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new bt({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(e.timeout==null?2e4:e.timeout),this._readyState="closed",this.uri=t;const n=e.parser||en;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=e.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var e;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(e=this.backoff)===null||e===void 0||e.setMin(t),this)}randomizationFactor(t){var e;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(e=this.backoff)===null||e===void 0||e.setJitter(t),this)}reconnectionDelayMax(t){var e;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(e=this.backoff)===null||e===void 0||e.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new Hr(this.uri,this.opts);const e=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const n=W(e,"open",function(){s.onopen(),t&&t()}),i=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),t?t(a):this.maybeReconnectOnOpen()},o=W(e,"error",i);if(this._timeout!==!1){const a=this._timeout,c=this.setTimeoutFn(()=>{n(),i(new Error("timeout")),e.close()},a);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(n),this.subs.push(o),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(W(t,"ping",this.onping.bind(this)),W(t,"data",this.ondata.bind(this)),W(t,"error",this.onerror.bind(this)),W(t,"close",this.onclose.bind(this)),W(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(e){this.onclose("parse error",e)}}ondecoded(t){Ft(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,e){let s=this.nsps[t];return s?this._autoConnect&&!s.active&&s.connect():(s=new fs(this,t,e),this.nsps[t]=s),s}_destroy(t){const e=Object.keys(this.nsps);for(const s of e)if(this.nsps[s].active)return;this._close()}_packet(t){const e=this.encoder.encode(t);for(let s=0;s<e.length;s++)this.engine.write(e[s],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,e){var s;this.cleanup(),(s=this.engine)===null||s===void 0||s.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,e),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const e=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(n=>{n?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",n)):t.onreconnect()}))},e);this.opts.autoUnref&&s.unref(),this.subs.push(()=>{this.clearTimeoutFn(s)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const Bt={};function Yt(r,t){typeof r=="object"&&(t=r,r=void 0),t=t||{};const e=zr(r,t.path||"/socket.io"),s=e.source,n=e.id,i=e.path,o=Bt[n]&&i in Bt[n].nsps,a=t.forceNew||t["force new connection"]||t.multiplex===!1||o;let c;return a?c=new ge(s,t):(Bt[n]||(Bt[n]=new ge(s,t)),c=Bt[n]),e.query&&!t.query&&(t.query=e.queryKey),c.socket(e.path,t)}Object.assign(Yt,{Manager:ge,Socket:fs,io:Yt,connect:Yt});var ms="https://api.smartpaylatam.com",gs="https://ws.smartpaylatam.com",rn="https://pb-api.apolopay.app",nn="https://pb-ws.apolopay.app",As=new Set(["localhost","127.0.0.1"]),Ae="smartpaylatam.com",on=new Set(["pb-api.apolopay.app","pb-ws.apolopay.app"]);function an(r){return r===Ae||r.endsWith(`.${Ae}`)||on.has(r)||As.has(r)}function ys(r,t){let e;try{e=new URL(r)}catch{throw new Error(`[Nexora SmartPay] Invalid ${t} "${r}": not a valid absolute URL.`)}const s=e.protocol==="https:",n=e.protocol==="http:"&&As.has(e.hostname);if(!s&&!n)throw new Error(`[Nexora SmartPay] Invalid ${t} "${r}": only https:// URLs are allowed (http:// only for localhost/127.0.0.1).`);if(!an(e.hostname.toLowerCase()))throw new Error(`[Nexora SmartPay] Invalid ${t} "${r}": host "${e.hostname}" is not a Nexora SmartPay host (*.${Ae}).`);return r.trim().replace(/\/+$/,"")}var bs=class{constructor(r){this.publicKey=r.publicKey,this.apiUrl=ys(r.apiUrl??ms,"apiUrl"),this.socketUrl=ys(r.socketUrl??gs,"socketUrl")}getPublicKey(){return this.publicKey}getApiUrl(){return this.apiUrl}getSocketUrl(){return this.socketUrl}isSandbox(){return this.publicKey.startsWith("pk_test")}},cn=bs,vs={trigger:{loading:"Cargando..."},modal:{titles:{selectAsset:'Selecciona el <span class="highlight">stablecoin</span>',selectNetwork:'Selecciona la <span class="highlight">red</span>',scanQr:'Depósito <span class="highlight">{symbol}</span>',success:'¡Gracias por <span class="highlight">tu compra!</span>',error:"Error en el Pago",idle:"Estado inesperado",processing:'¡Procesando <span class="highlight">tu pago!</span>'},subtitles:{selectAsset:"Selecciona la stablecoin con la que deseas pagar",selectNetwork:"Selecciona la red de tu preferencia",idle:"Ocurrio un error inesperado"},actions:{back:"Volver",close:"Cerrar",support:"Soporte",scanApp:'Escanea con tu celular y continua desde la app de <span style="color: var(--apolo-accent)">Apolo Pay</span>',copy:"Copiar",copied:"¡Copiado!",payFromDevice:"Pagar desde este dispositivo",understood:"Entendido",retry:"Reintentar"},labels:{network:"Red",address:"Dirección de depósito",amount:"Monto",product:"Producto o Servicio",minutes:"min",seconds:"seg",amountSent:"Monto Enviado",paid:"Pagado",remainingToPay:"Restante por pagar"},info:{noReloadPageTitle:'¡Por favor no <span style="color: var(--apolo-accent)">recargues la página!</span>',noReloadPageSubTitle:"La pantalla se actualizara cuando confirmes tu pago",selectNetworkLater:"Luego podrás seleccionar la red de tu preferencia",disclaimerTitle:"Términos y Condiciones",disclaimerSubtitle:"Al utilizar Nexora para procesar tu pago en criptomonedas, aceptas las siguientes condiciones de operación:",disclaimerBody:`
        <strong>1. Rol de Nexora:</strong> Somos exclusivamente una pasarela tecnológica de pagos.
        No vendemos los productos ni servicios que estás adquiriendo. Cualquier reclamo, garantía o solicitud de reembolso relacionada con tu compra debe gestionarse <strong>directamente con el comercio.</strong><br><br>
        <strong>2. Moneda y Red Estricta:</strong> Este pago solo acepta <strong>USDT</strong>. Es tu responsabilidad exclusiva seleccionar la red correcta (ej. Ethereum, Binance Smart Chain, Arbitrum, Near Protocol) y enviar los fondos a la dirección generada. <strong>Si envías fondos a través de una red incorrecta o envías una criptomoneda distinta, tus fondos se perderán de forma permanente e irrecuperable.</strong><br><br>
        <strong>3. Montos Exactos (Cuidado con los Exchanges):</strong> Debes enviar el <strong>monto exacto</strong> que se muestra en pantalla. Si envías los fondos desde un Exchange centralizado (como Binance, KuCoin, etc.), asegúrate de agregar la comisión de retiro (withdrawal fee) al total. <strong>Los pagos parciales no completarán tu orden</strong> y deberás contactar al comercio para resolverlo.<br><br>
        <strong>4. Tiempo Límite:</strong> Tienes <strong>un plazo de tiempo</strong> para realizar la transferencia. Si envías el pago después de que el tiempo haya expirado, la transacción no se procesará automáticamente y deberás contactar al soporte del comercio.<br><br>
        <strong>5. Comisiones de Red (Gas Fees):</strong> Tú eres responsable de pagar las comisiones de red (gas) necesarias para enviar la transacción desde tu billetera personal hacia la dirección de pago.
        `,disclaimerConfirmation:'He leído y acepto los <a href="$termsURL" target="_blank"><strong>Términos y Condiciones</strong></a> de Nexora.<br><br>Entiendo que enviar fondos por la red incorrecta y o enviar un monto incompleto resultará en la falla de la orden o la pérdida irreversible de mis fondos.'},warnings:{networkMatch:"Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.",noNFT:"No envíes NFTs a esta wallet.",onlyToken:"Solo se aceptan <strong>depósitos en {symbol}</strong>. El envío de otro tipo de token podría resultar en su pérdida.",timer:"Realiza el pago dentro del tiempo indicado. <strong>{time}</strong> De lo contrario, el código QR se vencerá."},success:{message:"Tu pago fue exitoso y en breve recibirás un correo",message2:"con los detalles.",details:"Detalles de la compra",support:"Cualquier duda o inquietud puedes comunicarte con soporte"},sandbox:{badge:"🧪 Modo prueba",title:"Simular resultado de pago",actions:{success:"Simular pago exitoso",partial:"Simular pago parcial",error:"Simular error de pago",expired:"Simular expiración del QR"},partialMessage:"Pago parcial detectado (modo prueba). Aún queda un monto por pagar.",qrInfo:"Estás usando <strong>datos de prueba</strong>. Para simular el resultado del pago, presiona el botón <strong>Simular pago</strong> de abajo.",qrPlaceholder:"QR de prueba (modo sandbox) - Solo para mostrar, no contiene datos de pago reales.",simulateButton:"Simular pago"}},successes:{success:"Éxito"},errors:{generic:"Ocurrió un error inesperado.",publicKeyMissing:"Falta la Public Key",config:"Error de Configuración",timeout:"El tiempo para realizar el pago ha expirado. Por favor genera una nueva orden.",paymentFailed:"El pago ha fallado. Por favor genera una nueva orden.",connectError:"Error de conexión.",socketConnectionError:"Error de conexión en el socket.",dataLoadError:"No se pudo cargar los datos de pago.",qrFetchError:"Fallo al obtener los detalles del código QR.",paymentProcessNotAvailable:"El proceso de pago no está disponible.",getAssetsError:"Error al obtener los activos.",unknownError:"Ocurrió un error inesperado.",sandboxSimulatedError:"Error simulado (modo prueba). Este resultado no proviene de un pago real."}},ln={trigger:{loading:"Loading..."},modal:{titles:{selectAsset:'Select <span class="highlight">stablecoin</span>',selectNetwork:'Select <span class="highlight">network</span>',scanQr:'Deposit <span class="highlight">{symbol}</span>',success:'Thanks for <span class="highlight">your purchase!</span>',error:"Payment Error",idle:"Unexpected state",processing:'Processing <span class="highlight">your payment!</span>'},subtitles:{selectAsset:"Select the stablecoin you want to pay with",selectNetwork:"Select your preferred network",idle:"An Unexpected error occurred"},actions:{back:"Back",close:"Close",support:"Support",scanApp:'Scan with your phone and continue from <br><span style="color: var(--apolo-accent)">Apolo Pay</span> app',copy:"Copy",copied:"Copied!",payFromDevice:"Pay from this device",understood:"Accept",retry:"Try again"},labels:{network:"Network",address:"Deposit Address",amount:"Amount",product:"Product or Service",minutes:"min",seconds:"sec",amountSent:"Amount sent",paid:"Paid",remainingToPay:"Remaining balance to pay"},info:{noReloadPageTitle:'Please do not <span style="color: var(--apolo-accent)">reload the page!</span>',noReloadPageSubTitle:"The screen will update when you confirm your payment",selectNetworkLater:"You will be able to select your preferred network later",disclaimerTitle:"Disclaimer",disclaimerSubtitle:"By using Nexora to process your payment in cryptocurrencies, you accept the following operating conditions:",disclaimerBody:`
        <strong>1. Role of Nexora:</strong> We are exclusively a technological payment gateway.
        We do not sell the products or services you are acquiring. Any claim, warranty, or refund request related to your purchase must be handled <strong>directly with the merchant.</strong><br><br>
        <strong>2. Strict Currency and Network:</strong> This payment only accepts <strong>USDT</strong>. It is your sole responsibility to select the correct network (e.g., Ethereum, Binance Smart Chain, Arbitrum, Near Protocol) and send the funds to the generated address. <strong>If you send funds through the wrong network and or send a different cryptocurrency, your funds will be permanently and irretrievably lost.</strong><br><br>
        <strong>3. Exact Amounts (Beware of Exchanges):</strong> You must send the <strong>exact amount</strong> shown on the screen. If you are sending funds from a centralized Exchange (like Binance, KuCoin, etc.), make sure to add the withdrawal fee to the total. <strong>Partial payments will not complete your order</strong> and you will need to contact the merchant to resolve it.<br><br>
        <strong>4. Time Limit:</strong> You have <strong>a period of time</strong> to make the transfer. If you send the payment after the time has expired, the transaction will not be processed automatically and you will need to contact the merchant's support.<br><br>
        <strong>5. Network Fees (Gas Fees):</strong> You are responsible for paying the network fees (gas) required to send the transaction from your personal wallet to the payment address.
        `,disclaimerConfirmation:'I have read and accept the <a href="$termsURL" target="_blank"><strong>Terms and Conditions</strong></a> of Nexora.<br><br>I understand that sending funds through the wrong network and or sending an incomplete amount will result in the failure of the order or the irreversible loss of my funds.'},warnings:{networkMatch:"Ensure your <strong>wallet network matches</strong> the destination network.",noNFT:"Do not send NFTs to this wallet.",onlyToken:"Only <strong>{symbol} deposits</strong> are accepted. Sending other tokens may result in loss.",timer:"Complete payment within <strong>{time}</strong>. Otherwise, the QR code will expire."},success:{message:"Your payment was successful. You will receive an email",message2:"shortly.",details:"Purchase Details",support:"Any doubt or inquiry you can contact support"},sandbox:{badge:"🧪 Test mode",title:"Simulate payment result",actions:{success:"Simulate successful payment",partial:"Simulate partial payment",error:"Simulate payment error",expired:"Simulate QR expiration"},partialMessage:"Partial payment detected (test mode). An amount is still pending.",qrInfo:"You are using <strong>test data</strong>. To simulate the payment result, press the <strong>Simulate payment</strong> button below.",qrPlaceholder:"Test QR (sandbox mode) - Display only, does not contain real payment data.",simulateButton:"Simulate payment"}},successes:{success:"Success"},errors:{generic:"An unexpected error occurred.",publicKeyMissing:"Public Key is missing",config:"Config Error",timeout:"The payment time has expired. Please generate a new order.",paymentFailed:"The payment has failed. Please generate a new order.",connectError:"Connection error in real time.",socketConnectionError:"Connection error in socket.",dataLoadError:"Could not load payment options.",qrFetchError:"Failed to get payment details.",paymentProcessNotAvailable:"The payment process is not available.",getAssetsError:"Failed to get assets.",unknownError:"An unexpected error occurred.",sandboxSimulatedError:"Simulated error (test mode). This result does not come from a real payment."}},_=class{static setLocale(r){this._currentLocale=r,this._dictionary=r==="en"?ln:vs}static get current(){return this._currentLocale}static get t(){return this._dictionary}static interpolate(r,t){return r.replace(/{(\w+)}/g,(e,s)=>typeof t[s]<"u"?String(t[s]):e)}};_._currentLocale="es",_._dictionary=vs;var G=(r=>(r.success="success",r.payment_success="payment_success",r.payment_failed="payment_failed",r.payment_partial="payment_partial",r.payment_timeout="payment_timeout",r.connect_error="connect_error",r.socket_connection_error="socket_connection_error",r.data_load_error="data_load_error",r.qr_fetch_error="qr_fetch_error",r.paymentProcessNotAvailable="payment_process_not_available",r.get_assets_error="get_assets_error",r.unknown_error="unknown_error",r))(G||{}),ye=class{constructor({code:r,message:t}){this.code=r,this.message=t}},Rt=class Bs extends ye{constructor({code:t,message:e,result:s}){super({code:t,message:e}),this.result=s}static fromJson(t,{code:e,message:s,result:n}={}){const i=t.status||e||"success",o=t.message||s||_.t.successes.success,a=n?.(t.result)||t.result||t;return new Bs({code:i,message:o,result:a})}},Kt=class Be extends ye{constructor({code:t,message:e,error:s}){super({code:t,message:e}),this.error=s}static fromError(t,{code:e,message:s}={}){if(t instanceof Be)return t;const n=e||t.statusCode||"unknown_error",i=s||t.message||_.t.errors.unknownError,o=t.error||t;return new Be({code:n,message:i,error:o})}},be="apolopay";function ft(r){return r.network.toLowerCase()===be}function ve(r){const t=[];for(const e of r){const s=e.networks.filter(n=>!ft(n));s.length&&t.push(s.length===e.networks.length?e:{...e,networks:s})}return t}var dn="https://p2p.apolopay.app";function Wt(r){const t=yt(0,"H"),e=new TextEncoder().encode(r);let s="";for(const i of e)s+=String.fromCharCode(i);t.addData(s,"Byte"),t.make();const n=t.createSvgTag({cellSize:4,margin:8,scalable:!0});return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`}var hn=1e4;async function ws(r,t){const e=new AbortController,s=setTimeout(()=>e.abort(),hn);try{return await(await fetch(r,{...t,signal:e.signal})).json()}finally{clearTimeout(s)}}var Gt=class{static async getAssets(r){try{const t=await ws(`${r}/payment-button/assets`,{method:"GET",headers:this.headers()});return Rt.fromJson(t)}catch(t){throw Kt.fromError(t,{code:"get_assets_error",message:_.t.errors.getAssetsError})}}static async fetchQrCodeDetails(r,{processId:t,assetId:e,networkId:s,publicKey:n}){try{const i=await ws(`${r}/payment-button/process/confirm`,{method:"POST",headers:this.headers(n),body:JSON.stringify({processId:t,assetId:e,networkId:s})});if(!i.result)throw new Kt({code:"payment_process_not_available",message:_.t.errors.paymentProcessNotAvailable});const o=i.result.wallet,c=i.result.network===be?`${dn}/payment-process/${t}`:o;return Rt.fromJson(i,{result:g=>{const h=Date.now()+600*1e3;let m=g.expiresAtMs??g.expiresAt;const D=(R=>{if(!R)return h;let $=0;if(!isNaN(Number(R)))$=Number(R);else if(typeof R=="string"){const K=new Date(R).getTime();isNaN(K)||($=K)}if($===0)return h;if($<1e10)$*=1e3;else if($>1e13)for(;$>2e13;)$=Math.floor($/1e3);return $})(m);return{...g,address:c,qrCodeUrl:Wt(c),paymentUrl:c.startsWith("http")?c:void 0,expiresAtMs:D}}})}catch(i){throw Kt.fromError(i,{code:"qr_fetch_error",message:_.t.errors.qrFetchError})}}};Gt.headers=r=>{const t={"Content-Type":"application/json"};return r&&(t["x-public-key"]=r),t};var un=class{constructor(r){this.sessionOptions=null,this.socket=null,this.client=r}connect(r){if(typeof window>"u")return;if(this.sessionOptions=r,this.socket&&this.socket.connected)return this.disconnect();this.socket=Yt(this.client.getSocketUrl(),{extraHeaders:{"x-public-key":this.client.getPublicKey()},transports:["polling"]});const{processId:t}=r;this.socket.on("connect",()=>this.socket?.emit("process:connect",{processId:t})),console.log(`Conectado a Socket.io para processId: ${t}`),this.socket.on("process:message",e=>this.handleWebSocketMessage(e)),this.socket.on("connect_error",e=>{console.error("Error en conexión Socket.io:",e),this.sessionOptions?.onError?.({code:"connect_error",message:_.t.errors.connectError,error:e}),this.disconnect()}),this.socket.on("disconnect",e=>{console.info(`Socket.io Desconectado: ${e}`)})}handleWebSocketMessage(r){if(!r.success)return this.sessionOptions?.onError?.({code:"payment_failed",message:r.message,error:r.result});if(r.event==="partial_payment")return this.sessionOptions?.onPartialPayment?.({code:"payment_partial",message:r.message,result:r.result});if(r.event==="funds_received")return this.sessionOptions?.onSuccess?.({code:"payment_success",message:r.message,result:r.result})}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null)}},Es=[{id:"sandbox-usdt",name:"Tether USD",symbol:"USDT",image:"",networks:[{id:"sandbox-near",name:"NEAR",network:"near",image:"",isNative:!1},{id:"sandbox-ethereum",name:"Ethereum",network:"ethereum",image:"",isNative:!1}]}];function pn({processId:r,asset:t,network:e}){const s=Date.now(),n=ft(e)?`sandbox-process-${r}`:`sandbox-${e.network}-0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d`;return{id:r,network:e.network,asset:t.symbol,amount:103.75,amountPaid:0,address:n,qrCodeUrl:Wt(n),expiresAtMs:s+600*1e3,paymentUrl:void 0}}var xs=class{constructor(r){this.assets=[],this.client=r,this.socket=new un(this.client)}getPublicKey(){return this.client.getPublicKey()}async getAssets(){if(this.client.isSandbox()){try{const t=await Gt.getAssets(this.client.getApiUrl());this.assets=ve(t.result)}catch{this.assets=Es}return this.assets}const r=await Gt.getAssets(this.client.getApiUrl());return this.assets=ve(r.result),this.assets}async fetchQrCodeDetails(r,t){if(this.client.isSandbox()){const s=this.assets.length?this.assets:Es,n=s.find(o=>o.id===r.assetId)??s[0],i=n.networks.find(o=>o.id===r.networkId)??n.networks[0];return pn({processId:t.processId,asset:n,network:i})}const e=await Gt.fetchQrCodeDetails(this.client.getApiUrl(),{...r,processId:t.processId,publicKey:this.client.getPublicKey()});return this.socket.connect(t),e.result}disconnectWebSocket(){this.socket.disconnect()}},S=(r=>(r[r.SELECT_ASSET=0]="SELECT_ASSET",r[r.SELECT_NETWORK=1]="SELECT_NETWORK",r[r.SHOW_QR=2]="SHOW_QR",r[r.RESULT=3]="RESULT",r))(S||{});const we=J`
  :host {
    /* --- API PÚBLICA DE COLORES (THEMING) --- */
    /* Valores por defecto: identidad monocromática de Nexora. */
    --smartpay-primary: var(--payment-button-primary, var(--apolo-primary, #08090b)); /* Negro Nexora */
    --smartpay-primary-darkest: var(--payment-button-primary-darkest, var(--apolo-primary-darkest, #202328)); /* Carbón */
    --smartpay-on-primary: var(--payment-button-on-primary, var(--apolo-on-primary, #ffffff));

    --smartpay-bg: var(--payment-button-bg, var(--apolo-bg, #ffffff));
    --smartpay-text: var(--payment-button-text, var(--apolo-text, #08090b));
    --smartpay-text-muted: var(--payment-button-text-muted, var(--apolo-text-muted, #6b7078)); /* Gris medio */
    --smartpay-accent: var(--payment-button-accent, var(--apolo-accent, #08090b));
    --smartpay-border: var(--payment-button-border, var(--apolo-border, #d9dde1)); /* Plata */

    /* --- API PÚBLICA DE FORMA Y TIPOGRAFÍA --- */
    --smartpay-radius: var(--payment-button-radius, var(--apolo-radius, 12px));
    /* Botones: esquinas suaves, no píldoras. */
    --smartpay-radius-lg: var(--payment-button-radius-lg, var(--apolo-radius-lg, 10px));
    /* Montserrat solo si la página del comercio ya la tiene: el SDK no carga fuentes de terceros. */
    --smartpay-font: var(--payment-button-font, var(--apolo-font, 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif));
    --smartpay-shadow: var(--payment-button-shadow, var(--apolo-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)));
    --smartpay-z-index: var(--payment-button-z-index, var(--apolo-z-index, 9999));
  }

  /* Reset global para componentes internos */
  * {
    box-sizing: border-box;
    font-family: var(--smartpay-font);
  }

  a {
    color: var(--smartpay-accent);
  }

  /* Botón principal: negro con texto blanco */
  .btn-primary {
    background-color: var(--smartpay-primary);
    color: var(--smartpay-on-primary);
    padding: 0.75rem 1.5rem;
    border-radius: var(--smartpay-radius-lg);
    border: none;
    font-weight: 600;
    font-size: .9rem;
    cursor: pointer;
    transition: background-color 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background-color: var(--smartpay-primary-darkest); transform: translateY(-1px); }

  /* Banner oscuro (aviso de no recargar / app) */
  .btn-dark {
    background-color: var(--smartpay-primary-darkest);
    color: var(--smartpay-on-primary);
    width: 100%;
    padding: 1rem;
    border-radius: var(--smartpay-radius);
    border: none;
    font-weight: 600;
    cursor: pointer;
    margin-block: 0.25rem 1.25rem;
  }

  .warning-text {
    font-size: 0.75rem;
    text-align: left;
    margin-top: 1.5rem;
    line-height: 1.5;
  }
  .warning-text strong { color: var(--smartpay-accent); }

  .warning-text ul {
    padding-left: 1.5rem;
  }
`,fn="M99.48 3.54 99.62 3.54 99.69 3.69 99.75 5.54 100.00 61.05 99.89 64.25 99.44 67.00 98.69 69.30 97.77 71.29 96.41 73.43 95.07 75.00 91.01 78.81 81.19 87.63 76.45 91.78 74.52 93.21 72.06 94.68 70.50 95.30 67.53 96.13 65.75 96.39 63.71 96.46 61.49 96.28 59.32 95.82 56.71 94.92 54.64 93.79 52.23 92.12 30.46 73.68 30.26 73.41 30.21 72.99 30.20 49.19 30.24 48.52 30.37 48.24 31.29 48.81 48.02 61.80 66.21 76.24 70.56 79.61 72.43 80.80 73.53 81.30 75.22 81.79 76.38 81.96 78.42 81.94 79.40 81.77 81.41 81.16 84.01 79.82 86.34 78.07 87.94 76.61 88.04 76.27 75.37 66.65 73.99 65.56 73.84 65.26 73.81 30.45 73.87 28.42 74.18 26.27 75.00 23.47 76.04 21.45 77.48 19.39 79.44 17.41 82.96 14.82ZM31.14 8.45 34.14 8.48 37.01 9.00 39.36 9.85 41.55 11.01 42.78 11.82 44.01 12.77 50.57 18.60 68.37 34.76 68.48 35.12 68.49 37.45 68.50 57.41 68.40 62.30 68.25 62.37 67.98 62.23 61.25 57.03 35.54 36.40 25.07 27.78 23.17 26.34 21.77 25.55 20.25 25.05 18.22 24.77 16.38 24.89 14.54 25.36 12.82 26.26 10.76 27.70 7.80 30.55 7.78 30.82 8.06 31.11 14.32 36.06 24.60 44.29 24.97 44.77 25.00 68.62 24.70 70.79 24.44 71.82 23.77 73.49 22.92 74.97 21.88 76.40 20.66 77.66 19.55 78.59 0.56 92.37 0.33 92.49 0.23 92.40 0.14 89.75 0.00 50.27 0.00 39.92 0.14 38.03 0.60 35.88 1.32 33.84 2.56 31.59 3.40 30.39 5.60 27.93 9.60 23.77 19.05 14.13 21.34 12.20 24.41 10.31 26.12 9.54 27.88 8.99Z";function Ee(r=""){return E`<svg class=${r} viewBox="0 0 100 100" role="img" aria-label="Nexora" focusable="false"><path fill="currentColor" fill-rule="evenodd" d=${fn}></path></svg>`}var mn=Object.defineProperty,$t=(r,t,e,s)=>{for(var n=void 0,i=r.length-1,o;i>=0;i--)(o=r[i])&&(n=o(t,e,n)||n);return n&&mn(t,e,n),n};const ke=class ke extends tt{constructor(){super(...arguments),this.lang="es",this.loading=!1,this.disabled=!1,this.label=void 0,this.hasError=!1}render(){const t=_.t,e=this.hasError?t.errors.config||"Config Error":this.loading?t.trigger.loading:this.label||"Nexora";return E`
      <div class="button-wrapper">
        ${this.hasError?"":Ee("nexora-mark")}
        <button 
          ?disabled=${this.disabled||this.loading||this.hasError} 
          class="${this.hasError?"error":""}"
          type="button"
        >
          ${e}
        </button>
      </div>
    `}};ke.styles=[we,J`
      :host { display: inline-block; }

      .button-wrapper {
        --img-size: 24px;
        --gap: 8px;
        position: relative;
        color: var(--smartpay-on-primary);
      }

      /* Botón principal Nexora: negro, texto blanco, esquinas suaves (no píldora). */
      button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 12px 32px;

        font-family: var(--smartpay-font);
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: var(--smartpay-on-primary);

        background-color: var(--smartpay-primary);
        border: 1px solid var(--smartpay-primary);
        border-radius: var(--smartpay-radius-lg);
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s, border-color 0.2s;

        text-indent: var(--img-size);
      }

      button:hover {
        transform: translateY(-1px);
        background-color: var(--smartpay-primary-darkest);
        border-color: var(--smartpay-primary-darkest);
      }

      .button-wrapper:hover .nexora-mark {
        transform: translateY(calc(-50% - 1px));
      }

      button:active {
        transform: translateY(0);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .button-wrapper:has(button:disabled) .nexora-mark {
        opacity: 0.6;
      }

      button.error {
        background-color: #ffffff;
        border-color: #b42332;
        color: #b42332;
        text-indent: 0;
      }

      .nexora-mark {
        position: absolute;
        top: 50%;
        left: calc((var(--img-size) / 2) + var(--gap));
        transform: translateY(-50%);
        width: var(--img-size);
        height: var(--img-size);
        margin-right: var(--gap);
        transition: transform 0.2s;
        z-index: 1;
        pointer-events: none;
      }
    `];let ct=ke;$t([x({type:String})],ct.prototype,"lang"),$t([x({type:Boolean})],ct.prototype,"loading"),$t([x({type:Boolean})],ct.prototype,"disabled"),$t([x({type:String})],ct.prototype,"label"),$t([x({type:Boolean})],ct.prototype,"hasError"),customElements.get("smartpay-trigger-button")||customElements.define("smartpay-trigger-button",ct);const ks=J`
/* 1. Definimos las Animaciones */
  @keyframes modal-enter {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes modal-exit {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to { opacity: 0; transform: scale(0.95) translateY(10px); }
  }

  @keyframes backdrop-enter {
    from { background-color: rgba(0, 0, 0, 0); backdrop-filter: blur(0px); }
    to { background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); }
  }

  @keyframes backdrop-exit {
    from { background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); }
    to { background-color: rgba(0, 0, 0, 0); backdrop-filter: blur(0px); }
  }

  /* 2. Estilos Base */
  dialog {
    position: relative; /* Ancla elementos flotantes (ej. badge de sandbox) al borde del card */
    border: none;
    padding: 0;
    margin: auto;

    /* Geometría */
    min-width: 320px;
    max-width: 420px;
    width: 90vw;
    border-radius: var(--smartpay-radius);
    
    background-color: var(--smartpay-bg);
    color: var(--smartpay-text);
    box-shadow: var(--smartpay-shadow);
    font-family: var(--smartpay-font);

    opacity: 0;
    pointer-events: none;
  }

  /* 3. Estado: ABIERTO (Animación de Entrada) */
  dialog[open] {
    opacity: 1;
    animation: modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: auto;
  }

  /* 4. Estado: CERRANDO (Animación de Salida) */
  dialog.closing {
    /* Sobrescribimos la animación de entrada */
    animation: modal-exit 0.15s ease-in forwards;
  }

  /* 5. Backdrop (Fondo Oscuro) */
  dialog::backdrop {
    background-color: rgba(0,0,0,0); /* Invisible por defecto */
  }

  dialog[open]::backdrop {
    animation: backdrop-enter 0.2s ease-out forwards;
  }

  dialog.closing::backdrop {
    animation: backdrop-exit 0.15s ease-in forwards;
  }

  dialog:not([open])::backdrop {
    display: none;
    pointer-events: none;
  }
`,gn=J`
  /* Inputs de solo lectura */
  .text-field {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    text-align: left;
    position: relative;
  }
  .text-field-label {
    --padding-left: 0.25rem;
    --padding-top: 0.15rem;
    font-size: 0.75rem;
    color: var(--smartpay-text-muted);
    border-radius: calc(var(--smartpay-radius) - 1px);
    background: var(--smartpay-bg);
    padding: var(--padding-top) var(--padding-left);
    position: absolute;
    top: calc(-0.5rem - var(--padding-top));
    left: calc(1rem - var(--padding-left));
    display: block;
    z-index: 2;
  }
  .text-field-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--smartpay-border);
    border-radius: var(--smartpay-radius);
    background: var(--smartpay-bg);
    color: var(--smartpay-text);
    font-size: 0.9rem;
    z-index: 1;
  }
  .btn-secondary {
    background-color: var(--smartpay-primary-darkest);
    color: var(--smartpay-on-primary);
    border: none;
    border-radius: var(--smartpay-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
`;const An={CHILD:2},yn=r=>(...t)=>({_$litDirective$:r,values:t});class bn{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class xe extends bn{constructor(t){if(super(t),this.it=U,t.type!==An.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===U||t==null)return this._t=void 0,this.it=t;if(t===ut)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}xe.directiveName="unsafeHTML",xe.resultType=1;const q=yn(xe),vn=J`
  .qr-frame {
    background: white;
    padding: 16px;
    border-radius: var(--smartpay-radius);
    border: 1px solid var(--smartpay-border);
    box-shadow: 0 4px 15px rgba(8, 9, 11, 0.06);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
    max-width: 90%;
    box-sizing: border-box;
  }
  
  .qr-badge {
    color: var(--smartpay-text);
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 12px;
    text-align: center;
    word-break: break-all;
    max-width: 100%;
  }

  .qr-wrapper {
    position: relative;
    display: block;
    width: 150px;
    height: 150px;
  }

  .qr-code-img {
    width: 100%;
    height: 100%;
  }

  .qr-overlay-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    width: 36px;
    height: 36px;
    
    object-fit: contain;
    color: #08090b; /* Marca Nexora (SVG con currentColor) */
    background-color: white;
    border-radius: 50%;
    padding: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`,wn="data:image/png;base64,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";function Jt(r){const t=r.target;t.src=wn}const En=J`
  .spinner-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--smartpay-radius, 12px);
    cursor: wait;
    backdrop-filter: blur(2px);
  }

  .spinner {
    border: 4px solid var(--smartpay-border, #d9dde1);
    border-top: 4px solid var(--smartpay-primary, #08090b);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;var xn=Object.defineProperty,_s=(r,t,e,s)=>{for(var n=void 0,i=r.length-1,o;i>=0;i--)(o=r[i])&&(n=o(t,e,n)||n);return n&&xn(t,e,n),n};const _e=class _e extends tt{constructor(){super(...arguments),this.expiresAt=0,this.timerString="-- : --",this._interval=null}connectedCallback(){super.connectedCallback(),this.startTimer()}disconnectedCallback(){this.stopTimer(),super.disconnectedCallback()}updated(t){t.has("expiresAt")&&this.startTimer()}startTimer(){if(this.stopTimer(),!this.expiresAt||isNaN(this.expiresAt))return;const t=()=>{const e=Date.now(),s=this.expiresAt-e;if(s<=0){this.stopTimer();const A=_.t.modal.labels.minutes,h=_.t.modal.labels.seconds;this.timerString=`00 ${A} : 00 ${h}`,this.dispatchEvent(new CustomEvent("expired"));return}const n=Math.floor(s%(1e3*60*60)/(1e3*60)),i=Math.floor(s%(1e3*60)/1e3),o=n.toString().padStart(2,"0"),a=i.toString().padStart(2,"0"),c=_.t.modal.labels.minutes,g=_.t.modal.labels.seconds;this.timerString=`${o} ${c} : ${a} ${g}`};t(),this._interval=window.setInterval(t,1e3)}stopTimer(){this._interval&&(clearInterval(this._interval),this._interval=null)}render(){return E`${this.timerString}`}};_e.styles=J`
    :host {
      display: block;
      color: var(--smartpay-accent, #08090b);
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  `;let Nt=_e;_s([x({type:Number})],Nt.prototype,"expiresAt"),_s([I()],Nt.prototype,"timerString"),customElements.get("smartpay-payment-timer")||customElements.define("smartpay-payment-timer",Nt);function lt(r,t={}){const{decimals:e=8,symbol:s,lang:n="es"}=t,i={es:"es-ES",en:"en-US",pt:"pt-BR"}[n];(r==null||r==="")&&(r=0);const o=Number(r);if(isNaN(o))return"0";const a=o<0?"-":"",c=Math.abs(o).toLocaleString("en-US",{useGrouping:!1,maximumFractionDigits:20});let g=c;const A=c.split(".");if(A.length>1){const w=A[0],D=A[1];e===0?g=w:g=`${w}.${D.slice(0,e)}`}const h=+`${a}${g}`,m={minimumFractionDigits:0,maximumFractionDigits:e};try{return h.toLocaleString(i,{...m,style:s?"currency":"decimal",currency:s})}catch{const D=h.toLocaleString(i,{...m,style:"decimal"});return s?`${D} ${s}`:D}}var kn=Object.defineProperty,M=(r,t,e,s)=>{for(var n=void 0,i=r.length-1,o;i>=0;i--)(o=r[i])&&(n=o(t,e,n)||n);return n&&kn(t,e,n),n};const Ce=class Ce extends tt{constructor(){super(...arguments),this.isOpen=!1,this.barrierDismissible=!1,this.lang="es",this.productTitle="",this.currentStep=S.SELECT_ASSET,this.status="idle",this.error=null,this.isLoadingData=!0,this.assets=[],this.selectedAsset=null,this.selectedNetwork=null,this.qrCodeUrl=null,this.paymentAddress=null,this.amount=0,this.amountPaid=void 0,this.email="",this.qrCodeExpiresAt=null,this.paymentUrl=null,this.isSandbox=!1,this.isAddressCopied=!1,this.sandboxPanelOpen=!1,this.handleBackdropClick=t=>{if(t.target!==this.dialogElement||this.dialogElement.classList.contains("closing")||!this.barrierDismissible)return;const e=this.dialogElement.getBoundingClientRect();(t.clientY<e.top||t.clientY>e.bottom||t.clientX<e.left||t.clientX>e.right)&&this.requestClose()}}disconnectedCallback(){super.disconnectedCallback();const t=this.dialogElement;t&&t.open&&t.close()}async updated(t){if(super.updated(t),await this.updateComplete,t.has("isOpen")){const e=this.dialogElement;if(!e)return;if(this.isOpen)e.classList.remove("closing"),e.open||e.showModal(),e.addEventListener("click",this.handleBackdropClick);else{if(e.removeEventListener("click",this.handleBackdropClick),!e.open)return;e.classList.add("closing");const s=n=>{n.target===e&&this.closeDialogFinal(e,s)};e.addEventListener("animationend",s),setTimeout(()=>{e.open&&this.closeDialogFinal(e,s)},200)}}}closeDialogFinal(t,e){t.removeEventListener("animationend",e),t.classList.remove("closing"),t.open&&t.close()}requestClose(){this.dispatchEvent(new CustomEvent("closeRequest"))}handleDialogNativeClose(t){t.preventDefault(),this.isOpen&&this.requestClose()}handleTimerExpired(){this.status="error",this.error={code:G.payment_timeout,message:_.t.errors.timeout},this.changeStep(S.RESULT),this.dispatchEvent(new CustomEvent("expired",{detail:{error:this.error}}))}selectAsset(t){this.dispatchEvent(new CustomEvent("assetSelect",{detail:{assetId:t}}))}requestRetryLoad(){this.dispatchEvent(new CustomEvent("retryLoad"))}selectNetwork(t){this.dispatchEvent(new CustomEvent("networkSelect",{detail:{network:t}}))}changeStep(t,e){e?.stopPropagation(),this.dispatchEvent(new CustomEvent("changeStep",{detail:t}))}copyAddress(t){this.paymentAddress&&(t.stopPropagation(),navigator.clipboard.writeText(this.paymentAddress),this.isAddressCopied=!0,setTimeout(()=>this.isAddressCopied=!1,2e3))}toggleSandboxPanel(t){t.stopPropagation(),this.sandboxPanelOpen=!this.sandboxPanelOpen}simulate(t,e){e.stopPropagation(),this.sandboxPanelOpen=!1,this.dispatchEvent(new CustomEvent("sandboxSimulate",{detail:t}))}handlePayFromDevice(){this.paymentUrl&&window.open(this.paymentUrl,"_blank")}get currentAsset(){return this.assets.find(t=>t.id===this.selectedAsset)}get currentNetwork(){return this.currentAsset?.networks.find(t=>t.id===this.selectedNetwork)}getFormattedTimeWindow(){if(!this.qrCodeExpiresAt||isNaN(this.qrCodeExpiresAt))return"30 min";const t=this.qrCodeExpiresAt,e=Date.now(),s=t-e;return s<=0?"0 min":`${Math.ceil(s/(1e3*60))} min`}renderSandboxInfoBanner(t){return E`
      <div class="sandbox-info-banner">
        <p>${q(t.modal.sandbox.qrInfo)}</p>
      </div>
    `}renderSandboxAction(t){return E`
      <div class="sandbox-cta-wrapper">
        ${this.sandboxPanelOpen?E`
          <div class="sandbox-panel sandbox-panel--up">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--smartpay-text); padding: 0.4rem 0.75rem;">
              ${t.modal.sandbox.title}
            </span>
            <button @click=${e=>this.simulate("success",e)}>${t.modal.sandbox.actions.success}</button>
            <button @click=${e=>this.simulate("partial",e)}>${t.modal.sandbox.actions.partial}</button>
            <button @click=${e=>this.simulate("error",e)}>${t.modal.sandbox.actions.error}</button>
            <button @click=${e=>this.simulate("expired",e)}>${t.modal.sandbox.actions.expired}</button>
          </div>
        `:""}
        <button class="btn-primary" style="width: 100%; margin-top: 0.5rem;" @click=${this.toggleSandboxPanel}>
          ${t.modal.sandbox.simulateButton}
        </button>
      </div>
    `}renderQrFooterActions(t,e){return this.isSandbox?E`
        ${this.renderSandboxInfoBanner(t)}
        ${this.renderSandboxAction(t)}
      `:E`
      ${e&&ft(e)?E`<button class="btn-dark">${q(t.modal.actions.scanApp)}</button>`:""}
      ${this.paymentUrl?E`
        <button class="btn-primary" style="width: 100%; margin-top: 0.5rem;" @click=${this.handlePayFromDevice}>
          ${t.modal.actions.payFromDevice}
        </button>
      `:""}
    `}renderQRStep(t){const e=this.getFormattedTimeWindow(),s=_.interpolate(t.modal.warnings.onlyToken,{symbol:this.currentAsset?.symbol||""}),n=_.interpolate(t.modal.warnings.timer,{time:e}),i=this.currentNetwork,o=this.currentAsset?.symbol||"",a=this.amount-(this.amountPaid||0),c=this.isSandbox?Wt(t.modal.sandbox.qrPlaceholder):this.qrCodeUrl;return i&&ft(i)?E`
        <smartpay-payment-timer class="timer" .expiresAt=${this.qrCodeExpiresAt} @expired=${this.handleTimerExpired}></smartpay-payment-timer>

        ${this.amountPaid&&this.amountPaid>0?E`
          <div class="balance-card">
            <div class="balance-row">
              <span class="balance-label">${_.t.modal.labels.paid}:</span>
              <span class="balance-value">${lt(this.amountPaid,{symbol:o,lang:this.lang})}</span>
            </div>
            <div class="balance-row">
              <span class="balance-label">${_.t.modal.labels.remainingToPay}:</span>
              <span class="balance-value highlight">${lt(this.amount,{symbol:o,lang:this.lang})}</span>
            </div>
          </div>
        `:""}

        <div class="qr-frame">
          <div class="qr-wrapper">
            <img src="${c}" class="qr-code-img" alt="QR" />
            ${Ee("qr-overlay-icon")}
          </div>
          <span class="qr-badge">${lt(a,{symbol:o,lang:this.lang})}</span>
        </div>

        <div class="btn-dark">
          <h4 style="margin-top: 0; margin-bottom: .1rem;">${q(t.modal.info.noReloadPageTitle)}</h4>
          <span style="font-size: .8rem;">${t.modal.info.noReloadPageSubTitle}</span>
        </div>

        <div class="warning-text">
          <p>${q(n)}</p>
        </div>

        ${this.renderQrFooterActions(t,i)}
      `:E`
      <smartpay-payment-timer class="timer" .expiresAt=${this.qrCodeExpiresAt} @expired=${this.handleTimerExpired}></smartpay-payment-timer>

      ${this.amountPaid&&this.amountPaid>0?E`
        <div class="balance-card">
          <div class="balance-row">
            <span class="balance-label">${_.t.modal.labels.paid}:</span>
            <span class="balance-value">${lt(this.amountPaid,{symbol:o,lang:this.lang})}</span>
          </div>
          <div class="balance-row">
            <span class="balance-label">${_.t.modal.labels.remainingToPay}:</span>
            <span class="balance-value highlight">${lt(this.amount,{symbol:o,lang:this.lang})}</span>
          </div>
        </div>
      `:""}

      <div class="qr-frame">
        <div class="qr-wrapper">
          <img src="${c}" class="qr-code-img" alt="QR Wallet" @error=${Jt} />

          ${i?E`<img src="${i.image}" class="qr-overlay-icon" alt="Network Icon" @error=${Jt} />`:""}
        </div>
        <span class="qr-badge">${lt(a,{symbol:o,lang:this.lang})}</span>
      </div>

      <div class="btn-dark">
        <h4 style="margin-top: 0; margin-bottom: .1rem;">${q(t.modal.info.noReloadPageTitle)}</h4>
        <span style="font-size: .8rem;">${t.modal.info.noReloadPageSubTitle}</span>
      </div>

      <div class="text-field">
        <label class="text-field-label">${t.modal.labels.network}</label>
        <input class="text-field-input" readonly value="${this.currentNetwork?.name}" />
      </div>

      <div class="text-field">
        <label class="text-field-label">${t.modal.labels.address}</label>
        <input class="text-field-input" readonly value="${this.paymentAddress}" @click=${this.copyAddress} />
        ${this.paymentAddress?E`
          <button class="btn-secondary" @click=${this.copyAddress}>${this.isAddressCopied?t.modal.actions.copied:t.modal.actions.copy}</button>
        `:""}
      </div>

      <div class="warning-text">
        ${this.isSandbox?"":E`
          <ul>
            <li>${q(t.modal.warnings.networkMatch)}</li>
            <li>${q(t.modal.warnings.noNFT)}</li>
            <li>${q(s)}</li>
          </ul>
        `}
        <p>${q(n)}</p>
      </div>

      ${this.renderQrFooterActions(t,i)}
    `}render(){const t=_.t;let e;const s=E`
      <div class="modal-header">
        ${this.currentStep>S.SELECT_ASSET&&this.currentStep<S.RESULT?E`<button class="back-button" @click=${()=>this.changeStep(this.currentStep-1)} >&larr;</button>`:""}
        <button class="close-button" @click=${this.requestClose}>&times;</button>
      </div>
    `;this.currentStep===S.SELECT_ASSET&&!this.isLoadingData&&this.assets.length===0?e=E`
        <h2>${q(t.modal.titles.selectAsset)}</h2>
        <p class="subtitle">${this.error?.message||t.errors.dataLoadError}</p>
        <button class="btn-primary" style="width: 100%; margin-top: 1rem;" @click=${this.requestRetryLoad}>
          ${t.modal.actions.retry}
        </button>
      `:this.currentStep===S.SELECT_ASSET?e=E`
        <h2>${q(t.modal.titles.selectAsset)}</h2>
        <p class="subtitle">${t.modal.subtitles.selectAsset}</p>
        
        <div class="selection-list">
          ${this.assets.map(i=>E`
            <div class="selection-card" @click=${()=>this.selectAsset(i.id)}>
              <img src="${i.image}" class="coin-icon" @error=${Jt} />
              <div class="card-text">
                <span class="card-title">${i.symbol}</span>
                <span class="card-sub">${i.name}</span>
              </div>
            </div>
          `)}
        </div>
        <p class="warning-text" style="font-size: 0.9rem; text-align: center; margin-top: 1.5rem">
          ${t.modal.info.selectNetworkLater}
        </p>
      `:this.currentStep===S.SELECT_NETWORK?e=E`
        <h2>${q(t.modal.titles.selectNetwork)}</h2>
        <p class="subtitle">${t.modal.subtitles.selectNetwork}</p>

        <div class="selection-list">
          ${this.currentAsset?.networks.map(i=>E`
            <div class="selection-card" @click=${()=>this.selectNetwork(i)}>
              ${ft(i)?Ee("coin-icon"):E`<img src="${i.image}" class="coin-icon" @error=${Jt} />`}
              <div class="card-text">
                <span class="card-title">${i.name}</span>
              </div>
            </div>
          `)}
        </div>
       `:this.currentStep===S.SHOW_QR?e=E`
        <h2>${q(_.interpolate(t.modal.titles.scanQr,{symbol:this.currentAsset?.symbol||""}))}</h2>
        ${this.productTitle?E`<p class="subtitle">${this.productTitle}</p>`:""}
        ${this.renderQRStep(t)}
      `:this.currentStep===S.RESULT&&(this.status==="success"?e=E`
          <div class="result-container">
            <div class="success-icon">
              <svg viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>

            <h2 class="result-title">${q(t.modal.titles.success)}</h2>
            
            <p class="result-desc">
              ${t.modal.success.message} ${this.email?E`<span class="highlight">${this.email}</span>`:""} ${t.modal.success.message2}
            </p>

            <div class="purchase-details">
              <h3 class="details-title">${t.modal.success.details}</h3>

              ${this.productTitle?E`
                <div class="text-field">
                  <label class="text-field-label">${t.modal.labels.product}</label>
                  <input class="text-field-input" readonly value=${this.productTitle} />
                </div>
              `:""}

              <div class="text-field">
                <label class="text-field-label">${t.modal.labels.amount}</label>
                <input class="text-field-input" readonly value="${lt(this.amount,{symbol:this.currentAsset?.symbol||"",lang:this.lang})}" />
              </div>
            </div>
          </div>
        `:this.status==="error"?e=E`
          <div class="result-container">
            <div class="error-icon">❌</div>
            <h2 class="result-title">${t.modal.titles.error}</h2>
            <p class="result-desc">${this.error?.message||t.errors.generic}</p>
            <button class="btn-primary" style="width: 100%;" @click=${this.requestClose}>${t.modal.actions.close}</button>
          </div>
        `:this.status==="processing"?e=E`
          <div class="processing-container">
            <div class="dots-loader">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>

            <h2 class="processing-title">${q(t.modal.titles.processing)}</h2>

            <div class="btn-dark" style="margin-bottom: 0">
              <h4 style="margin-top: 0; margin-bottom: .1rem;">${q(t.modal.info.noReloadPageTitle)}</h4>
              <span style="font-size: .8rem;">${t.modal.info.noReloadPageSubTitle}</span>
            </div>

            <div class="text-field" style="width: 100%;">
              <label class="text-field-label">${t.modal.labels.amountSent} (${this.currentAsset?.symbol})</label>
              <input class="text-field-input" readonly value="${lt(this.amount,{symbol:this.currentAsset?.symbol||"",lang:this.lang})}" />
            </div>
          </div>
        </div>
        `:e=E`
          <div class="result-container">
            <div class="error-icon">⏳</div>
            <h2 class="result-title">${t.modal.titles.idle}</h2>
            <p class="result-desc">${t.modal.subtitles.idle}</p>
            <button class="btn-primary" style="width: 100%;" @click=${this.requestClose}>${t.modal.actions.close}</button>
          </div>
        `);const n=this.isLoadingData||this.currentStep===S.SHOW_QR&&!this.qrCodeUrl;return E`
      <dialog @close=${this.handleDialogNativeClose}>
        ${this.isSandbox?E`
          <div class="sandbox-float-badge">
            <span class="sandbox-badge">${t.modal.sandbox.badge}</span>
          </div>
        `:""}
        ${n?E`
              <div class="spinner-overlay">
                <div class="spinner"></div>
              </div>`:""}
        ${s}
        <div class="modal-body">
          ${e}
        </div>
      </dialog>
    `}};Ce.styles=[we,ks,gn,vn,En,J`
      /* --- HEADER --- */
      .modal-header {
        position: relative; /* Para posicionar el botón de cerrar */
        padding: 1.5rem 1.5rem 0.5rem;
        display: flex;
        justify-content: center; /* Título centrado si lo hubiera */
        align-items: center;
      }

      .close-button, .back-button {
        position: absolute;
        top: 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--smartpay-text-muted);
        transition: color 0.2s;
        padding: 5px;
      }
      .close-button { right: 1.5rem; font-size: 1.5rem; }
      .back-button { left: 1.5rem; font-size: 1.2rem; }
      .close-button:hover, .back-button:hover { color: var(--smartpay-text); }

      /* --- BODY --- */
      .modal-body {
        padding: 1rem 2rem 2.5rem; /* Padding generoso abajo */
        text-align: center;
      }

      /* Títulos */
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
      }
      .highlight { color: var(--smartpay-accent); }
      
      p.subtitle {
        font-size: 0.9rem;
        color: var(--smartpay-text-muted);
        margin: 0 0 1rem;
        line-height: 1.4;
      }

      /* --- LISTAS DE SELECCIÓN (Botones grandes blancos) --- */
      .selection-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .selection-card {
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid var(--smartpay-border);
        border-radius: 16px;
        padding: 1rem;
        cursor: pointer;
        box-shadow: 0 2px 4px -1px rgba(8, 9, 11, 0.04);
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      }

      .selection-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        border-color: var(--smartpay-text);
      }

      .coin-icon {
        width: 40px;
        height: 40px;
        margin-right: 1rem;
        object-fit: cover;
        flex-shrink: 0;
        color: var(--smartpay-text); /* Marca Nexora (SVG con currentColor) */
      }

      .card-text {
        text-align: left;
        display: flex;
        flex-direction: column;
      }
      .card-title { font-weight: 600; font-size: 1rem; color: var(--smartpay-text); }
      .card-sub { font-size: 0.8rem; color: var(--smartpay-text-muted); text-transform: uppercase;}

      /* --- QR SCREENS --- */
      .timer {
        color: var(--smartpay-accent);
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: block;
      }

      /* --- PANTALLA DE RESULTADO --- */
      .result-container {
        text-align: center;
        animation: fadeIn 0.5s ease-out;
      }

      /* Animación simple de entrada */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      .success-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
      }

      /* Animación del Check SVG */
      .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke: #1e7a4c; /* Verde éxito Nexora */
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark-check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        stroke: #1e7a4c;
        stroke-width: 4;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
      }
      @keyframes stroke { 100% { stroke-dashoffset: 0; } }

      .result-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .result-desc {
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .purchase-details {
        text-align: left;
        margin-bottom: 1.5rem;
      }

      .details-title {
        font-size: 1rem;
        font-weight: 700;
        text-decoration: underline;
        text-decoration-color: var(--smartpay-text);
        text-underline-offset: 4px;
        text-align: center;
        margin-bottom: 1.5rem;
      }
      
      /* Estilo Error */
      .error-icon { font-size: 4rem; margin-bottom: 1rem; }

      /* Estilo Processing */
      .processing-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding-top: 1rem;
      }

      /* Animación de puntos */
      .dots-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        height: 40px;
      }

      .dot {
        width: 12px;
        height: 12px;
        background-color: var(--smartpay-accent);
        border-radius: 50%;
        display: inline-block;
        animation: dot-pulse 1.5s infinite ease-in-out;
      }

      .dot:nth-child(2) { animation-delay: 0.2s; width: 16px; height: 16px; }
      .dot:nth-child(3) { animation-delay: 0.4s; width: 20px; height: 20px; }
      .dot:nth-child(4) { animation-delay: 0.6s; width: 16px; height: 16px; }
      .dot:nth-child(5) { animation-delay: 0.8s; }

      @keyframes dot-pulse {
        0%, 100% { transform: scale(0.7); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
      }

      .processing-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--smartpay-primary-darkest);
        margin: 0;
      }

      /* Balance Card */
      .balance-card {
        background-color: #f4f5f6; /* Nube */
        border: 1px dashed var(--smartpay-border);
        border-radius: 12px;
        padding: 0.8rem;
        margin-bottom: 1.5rem;
        animation: slideDown 0.4s ease-out;
      }

      .balance-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
      }

      .balance-row:last-child { margin-bottom: 0; }

      .balance-label { color: var(--smartpay-text-muted); }
      .balance-value { font-weight: 700; color: var(--smartpay-text); }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* --- SANDBOX (TEST MODE) --- */
      /* Floating badge anchored to the dialog itself (see modal-base.ts), pinned */
      /* just inside its top edge so it never takes up layout space nor spills */
      /* outside the card into the backdrop. */
      .sandbox-float-badge {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
      }

      .sandbox-badge {
        font-size: 0.75rem;
        font-weight: 700;
        color: #5e430f; /* Atención */
        background: #fdf3e1;
        border: 1px solid #5e430f;
        border-radius: 999px;
        padding: 0.3rem 0.8rem;
        cursor: default;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .sandbox-cta-wrapper {
        position: relative;
        width: 100%;
      }

      .sandbox-panel {
        position: absolute;
        top: calc(100% + 0.4rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        min-width: 220px;
      }

      .sandbox-panel--up {
        top: auto;
        bottom: calc(100% + 0.4rem);
      }

      .sandbox-panel button {
        text-align: left;
        background: none;
        border: none;
        padding: 0.6rem 0.75rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--smartpay-text);
        cursor: pointer;
        border-radius: 8px;
      }

      .sandbox-panel button:hover {
        background: #f4f5f6;
      }

      .sandbox-info-banner {
        background-color: #fdf3e1; /* Atención */
        border: 1px solid #5e430f;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .sandbox-info-banner p {
        margin: 0;
        font-size: 0.85rem;
        font-weight: 600;
        color: #5e430f;
        text-align: center;
      }
    `];let B=Ce;M([x({type:Boolean})],B.prototype,"isOpen"),M([x({type:Boolean})],B.prototype,"barrierDismissible"),M([x({type:String})],B.prototype,"lang"),M([x({type:String})],B.prototype,"productTitle"),M([x({type:Number})],B.prototype,"currentStep"),M([x({type:String})],B.prototype,"status"),M([x({type:Object})],B.prototype,"error"),M([x({type:Boolean})],B.prototype,"isLoadingData"),M([x({type:Array})],B.prototype,"assets"),M([x({type:String})],B.prototype,"selectedAsset"),M([x({type:String})],B.prototype,"selectedNetwork"),M([x({type:String})],B.prototype,"qrCodeUrl"),M([x({type:String})],B.prototype,"paymentAddress"),M([x({type:Number})],B.prototype,"amount"),M([x({type:Number})],B.prototype,"amountPaid"),M([x({type:String})],B.prototype,"email"),M([x({type:Number})],B.prototype,"qrCodeExpiresAt"),M([x({type:String})],B.prototype,"paymentUrl"),M([x({type:Boolean})],B.prototype,"isSandbox"),M([I()],B.prototype,"isAddressCopied"),M([I()],B.prototype,"sandboxPanelOpen"),M([Ke("dialog")],B.prototype,"dialogElement"),customElements.get("smartpay-payment-modal")||customElements.define("smartpay-payment-modal",B);var _n=Object.defineProperty,mt=(r,t,e,s)=>{for(var n=void 0,i=r.length-1,o;i>=0;i--)(o=r[i])&&(n=o(t,e,n)||n);return n&&_n(t,e,n),n};const Se=class Se extends tt{constructor(){super(...arguments),this.isOpen=!1,this.barrierDismissible=!1,this.lang="es",this.modalTitle="",this.modalSubtitle="",this.contentTemplate=null,this.closeReason=!1,this.handleBackdropClick=t=>{if(t.target!==this.dialogElement||this.dialogElement.classList.contains("closing")||!this.barrierDismissible)return;const e=this.dialogElement.getBoundingClientRect();(t.clientY<e.top||t.clientY>e.bottom||t.clientX<e.left||t.clientX>e.right)&&this.requestClose(!1)}}static show(t){return new Promise(e=>{const s=document.createElement("smartpay-info-modal");s.modalTitle=t.title||"",s.modalSubtitle=t.subtitle||"",s.contentTemplate=t.content,s.barrierDismissible=t.barrierDismissible??!0,t.lang&&(s.lang=t.lang);const n=i=>{const a=i.detail;s.removeEventListener("modal-closed",n),document.body.contains(s)&&document.body.removeChild(s),e(a)};s.addEventListener("modal-closed",n),document.body.appendChild(s),requestAnimationFrame(()=>{s.isOpen=!0})})}disconnectedCallback(){super.disconnectedCallback();const t=this.dialogElement;t&&t.open&&t.close()}async updated(t){if(super.updated(t),await this.updateComplete,t.has("isOpen")){const e=this.dialogElement;if(!e)return;if(this.isOpen)e.classList.remove("closing"),e.open||e.showModal(),e.addEventListener("click",this.handleBackdropClick);else{if(e.removeEventListener("click",this.handleBackdropClick),!e.open)return;e.classList.add("closing");const s=n=>{n.target===e&&this.closeDialogFinal(e,s)};e.addEventListener("animationend",s),setTimeout(()=>{e.open&&this.closeDialogFinal(e,s)},200)}}}closeDialogFinal(t,e){t.removeEventListener("animationend",e),t.classList.remove("closing"),t.open&&t.close(),this.dispatchEvent(new CustomEvent("modal-closed",{detail:this.closeReason,bubbles:!0,composed:!0}))}requestClose(t=!1){this.closeReason=t,this.isOpen=!1}handleDialogNativeClose(t){t.preventDefault(),this.requestClose(!1)}render(){return E`
      <dialog @close=${this.handleDialogNativeClose}>
        <div class="modal-header">
          <button class="close-button" @click=${()=>this.requestClose(!1)}>&times;</button>
        </div>
        <div class="modal-body">
          ${this.modalTitle?E`<h2>${this.modalTitle}</h2>`:""}
          ${this.modalSubtitle?E`<p class="subtitle">${this.modalSubtitle}</p>`:""}

          <div class="modal-content-slot">
            ${typeof this.contentTemplate=="string"?q(this.contentTemplate):this.contentTemplate}
          </div>

          <button style="width: 100%;" class="btn-primary" @click=${()=>this.requestClose(!0)}>${_.t.modal.actions.understood}</button>
        </div>
      </dialog>
    `}};Se.styles=[we,ks,J`
      .modal-header {
        position: relative;
        padding: 1.5rem 1.5rem 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .close-button {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--smartpay-text-muted);
        transition: color 0.2s;
        padding: 5px;
        font-size: 1.5rem;
      }
      .close-button:hover { color: var(--smartpay-text); }
      .modal-body {
        padding: 1rem 2rem 2.5rem;
        text-align: center;
      }
      .modal-content-slot {
        max-height: 400px;
        margin-bottom: 1rem;
        overflow-y: auto;
        font-size: 0.8rem;
        text-align: left;
      }
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
      }
      p.subtitle {
        font-size: 0.9rem;
        color: var(--smartpay-text-muted);
        margin: 0 0 1rem;
        line-height: 1.4;
      }
    `];let Y=Se;mt([x({type:Boolean})],Y.prototype,"isOpen"),mt([x({type:Boolean})],Y.prototype,"barrierDismissible"),mt([x({type:String})],Y.prototype,"lang"),mt([x({type:String})],Y.prototype,"modalTitle"),mt([x({type:String})],Y.prototype,"modalSubtitle"),mt([x({type:Object})],Y.prototype,"contentTemplate"),mt([Ke("dialog")],Y.prototype,"dialogElement"),customElements.get("smartpay-info-modal")||customElements.define("smartpay-info-modal",Y);const Cn="https://smartpaylatam.com/terminos";var Sn=Object.defineProperty,P=(r,t,e,s)=>{for(var n=void 0,i=r.length-1,o;i>=0;i--)(o=r[i])&&(n=o(t,e,n)||n);return n&&Sn(t,e,n),n};const Te=class Te extends tt{constructor(){super(...arguments),this.client=void 0,this.processId=void 0,this.productTitle=void 0,this.lang="es",this.label=void 0,this.loading=!1,this.disabled=!1,this.barrierDismissible=!1,this.isOpen=!1,this.status="idle",this.currentStep=S.SELECT_ASSET,this.selectedAsset=null,this.selectedNetwork=null,this.qrCodeUrl=null,this.qrCodeExpiresAt=null,this.paymentAddress=null,this.paymentUrl=null,this.assets=[],this.successResult=null,this.error=null,this.isLoadingData=!0,this.amount=0,this.amountPaid=void 0,this.hasConfigError=!1,this.email=null,this.alreadyShownInfoModal=!1,this._service=null}willUpdate(t){t.has("lang")&&_.setLocale(this.lang),(t.has("client")||t.has("processId"))&&(this.validateConfig(),this.client&&this._service===null&&this.initService(),t.has("processId")&&this.resetState(),this.client&&this.processId&&this.loadInitialData()),super.willUpdate(t)}connectedCallback(){super.connectedCallback(),this.validateConfig(),this.client&&(this.initService(),this.processId&&this.loadInitialData())}initService(){!this.client||this.hasConfigError||(this._service=new xs(this.client))}get isValidProcessId(){return this.processId?/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(this.processId):!1}validateConfig(){const t=this.client?.getPublicKey(),e=!!(t&&t.startsWith("pk_")&&(t.startsWith("pk_test")||t.length===35));this.client&&!e&&console.error(`PaymentButton Error: Invalid publicKey "${t}". Must start with "pk_" and be 35 characters long.`),this.hasConfigError=!this.client||!e}disconnectedCallback(){super.disconnectedCallback(),this._service?.disconnectWebSocket()}async loadInitialData(){if(this._service&&(this.isLoadingData=!0,this.error=null,!!this.processId))try{this.assets=await this._service.getAssets()}catch(t){console.error("Error loading initial payment options:",t),this.error={code:G.data_load_error,message:_.t.errors.dataLoadError}}finally{this.isLoadingData=!1}}resetState(){this.currentStep=S.SELECT_ASSET,this.status="idle",this.error=null,this.successResult=null,this.selectedAsset=null,this.selectedNetwork=null,this.qrCodeUrl=null,this.paymentAddress=null,this.paymentUrl=null,this.qrCodeExpiresAt=null,this.amount=0,this.amountPaid=void 0}async handleOpen(){if(this.resetState(),this.hasConfigError||!this.client||!this.processId){console.error("PaymentButton Error: client and process-id are required and must be valid");return}if(this.loading)return;if(document.body.style.overflow="hidden",this.alreadyShownInfoModal)return this.isOpen=!0;if(await Y.show({title:_.t.modal.info.disclaimerTitle,subtitle:_.t.modal.info.disclaimerSubtitle,content:_.t.modal.info.disclaimerBody})!==!0)return document.body.style.overflow="auto",this.dispatchEvent(new CustomEvent("dismissed"));this.isOpen=!0,this.alreadyShownInfoModal=!0}handleCloseRequest(){this.isOpen=!1,document.body.style.overflow="auto",this.currentStep===S.SHOW_QR&&this.status!=="success"&&this.status!=="error"&&this._service?.disconnectWebSocket(),this.closeTimeoutId&&clearTimeout(this.closeTimeoutId),this.closeTimeoutId=setTimeout(()=>{this.successResult?this.successResult.code===G.payment_partial?this.dispatchEvent(new CustomEvent("partialPayment",{detail:this.successResult})):this.dispatchEvent(new CustomEvent("success",{detail:this.successResult})):this.error?this.error.code===G.payment_timeout?this.dispatchEvent(new CustomEvent("expired",{detail:this.error})):this.dispatchEvent(new CustomEvent("error",{detail:this.error})):this.dispatchEvent(new CustomEvent("dismissed")),this.resetState()},300)}handleAssetSelect(t){this.selectedAsset=t.detail.assetId,this.currentStep=S.SELECT_NETWORK,this.error=null}handleExpired(t){this.error=t.detail.error}async handleInitiatePayment(t){if(!this.client||!this.processId||(this.selectedNetwork=t.detail.network.id,!this.selectedAsset||!this.selectedNetwork)||!ft(t.detail.network)&&await Y.show({title:_.t.modal.info.disclaimerTitle,content:_.t.modal.info.disclaimerConfirmation.replace("$termsURL",Cn)})!==!0)return;const e={assetId:this.selectedAsset,networkId:this.selectedNetwork};this.status="loading",this.currentStep=S.SHOW_QR,this.qrCodeUrl=null,this.paymentAddress=null,this.error=null,this.successResult=null;try{const s=await this._service.fetchQrCodeDetails(e,{processId:this.processId,onSuccess:n=>{this.isOpen&&(this.status="processing",this.currentStep=S.RESULT,this.successResult=n,setTimeout(()=>{this.status="success"},2e3))},onPartialPayment:n=>{this.isOpen&&(this.status="idle",this.currentStep=S.SHOW_QR,this.amount=Number(n.result?.amount||"0"),this.amountPaid=Number(n.result?.amountPaid||"0"),this.successResult=n)},onError:n=>{this.isOpen&&(this.status="error",this.currentStep=S.RESULT,this.error=n)}});this.qrCodeUrl=s.qrCodeUrl,this.paymentAddress=s.address,this.paymentUrl=s.paymentUrl||null,this.qrCodeExpiresAt=s.expiresAtMs,this.amount=typeof s.amount=="string"?parseFloat(s.amount):s.amount,this.amountPaid=s.amountPaid!==void 0&&s.amountPaid!==null?typeof s.amountPaid=="string"?parseFloat(s.amountPaid):s.amountPaid:void 0,this.status="idle"}catch(s){const n=s;if(this.error=n,this.status="error",n.code===G.paymentProcessNotAvailable){this.currentStep=S.RESULT;return}console.error("Error fetching QR code details:",n),this.currentStep=S.SELECT_NETWORK}}handleSandboxSimulate(t){switch(t.detail){case"success":{const s=this.assets.find(i=>i.id===this.selectedAsset),n=s?.networks?.find(i=>i.id===this.selectedNetwork);this.status="processing",this.currentStep=S.RESULT,this.successResult=new Rt({code:G.payment_success,message:_.t.successes.success,result:{id:"",network:n?.network??"",asset:s?.symbol??"",amount:this.amount,status:"success"}}),setTimeout(()=>{this.status="success"},2e3);break}case"partial":{const s=this.assets.find(a=>a.id===this.selectedAsset),n=s?.networks?.find(a=>a.id===this.selectedNetwork),i=this.amount,o=i*.4;this.status="idle",this.currentStep=S.SHOW_QR,this.amount=i,this.amountPaid=o,this.successResult=new Rt({code:G.payment_partial,message:_.t.modal.sandbox.partialMessage,result:{id:"",network:n?.network??"",asset:s?.symbol??"",amount:i,amountPaid:o,status:"pending"}});break}case"error":this.status="error",this.currentStep=S.RESULT,this.error={code:G.payment_failed,message:_.t.errors.sandboxSimulatedError};break;case"expired":this.status="error",this.currentStep=S.RESULT,this.error={code:G.payment_timeout,message:_.t.errors.timeout};break}}handleChangeStep(t){this.currentStep===S.SHOW_QR&&t.detail!==S.RESULT&&this._service?.disconnectWebSocket(),this.currentStep=t.detail,this.status="idle",this.error=null,this.currentStep!==S.SHOW_QR&&(this.qrCodeUrl=null,this.paymentAddress=null,this.paymentUrl=null)}render(){return E`
      <div id="trigger-wrapper" @click=${this.handleOpen}>
        <slot>
          <smartpay-trigger-button 
            .lang=${this.lang}
            .label=${this.label}
            .loading=${this.loading||this.isLoadingData&&!this.hasConfigError||!this.isValidProcessId}
            .hasError=${this.hasConfigError}
            ?disabled=${this.disabled||this.hasConfigError||!this.isValidProcessId}
          ></smartpay-trigger-button>
        </slot>
      </div>

      <smartpay-payment-modal
        ?isOpen=${this.isOpen}
        .barrierDismissible=${this.barrierDismissible}
        .lang=${this.lang}
        .currentStep=${this.currentStep}
        .status=${this.status}
        .productTitle=${this.productTitle}
        .error=${this.error}
        .isLoadingData=${this.isLoadingData}
        .assets=${this.assets}
        .selectedAsset=${this.selectedAsset}
        .selectedNetwork=${this.selectedNetwork}
        .qrCodeUrl=${this.qrCodeUrl}
        .paymentAddress=${this.paymentAddress}
        .amount=${this.amount}
        .amountPaid=${this.amountPaid}
        .email=${this.email}
        .qrCodeExpiresAt=${this.qrCodeExpiresAt}
        .paymentUrl=${this.paymentUrl}
        .isSandbox=${this.client?.isSandbox()??!1}
        @closeRequest=${this.handleCloseRequest}
        @assetSelect=${this.handleAssetSelect}
        @retryLoad=${this.loadInitialData}
        @networkSelect=${this.handleInitiatePayment}
        @changeStep=${this.handleChangeStep}
        @expired=${this.handleExpired}
        @sandboxSimulate=${this.handleSandboxSimulate}
      ></smartpay-payment-modal>
    `}};Te.styles=J`
    :host {
      display: var(--smartpay-display, var(--apolopay-display, inline-block));
    }

    #trigger-wrapper {
      position: relative;
      display: var(--smartpay-trigger-display, var(--apolopay-trigger-display, inline-block));
      width: var(--smartpay-trigger-width, var(--apolopay-trigger-width, auto));
      cursor: pointer;
    }
  `;let C=Te;P([x({type:Object})],C.prototype,"client"),P([x({type:String,attribute:"process-id"})],C.prototype,"processId"),P([x({type:String,attribute:"product-title"})],C.prototype,"productTitle"),P([x({type:String})],C.prototype,"lang"),P([x({type:String})],C.prototype,"label"),P([x({type:Boolean})],C.prototype,"loading"),P([x({type:Boolean})],C.prototype,"disabled"),P([x({type:Boolean,attribute:"barrier-dismissible",converter:{fromAttribute:r=>r===null?!1:r!=="false",toAttribute:r=>r?"":null}})],C.prototype,"barrierDismissible"),P([I()],C.prototype,"isOpen"),P([I()],C.prototype,"status"),P([I()],C.prototype,"currentStep"),P([I()],C.prototype,"selectedAsset"),P([I()],C.prototype,"selectedNetwork"),P([I()],C.prototype,"qrCodeUrl"),P([I()],C.prototype,"qrCodeExpiresAt"),P([I()],C.prototype,"paymentAddress"),P([I()],C.prototype,"paymentUrl"),P([I()],C.prototype,"assets"),P([I()],C.prototype,"successResult"),P([I()],C.prototype,"error"),P([I()],C.prototype,"isLoadingData"),P([I()],C.prototype,"amount"),P([I()],C.prototype,"amountPaid"),P([I()],C.prototype,"hasConfigError"),P([I()],C.prototype,"email"),P([I()],C.prototype,"alreadyShownInfoModal"),P([I()],C.prototype,"_service"),customElements.get("smartpay-button")||customElements.define("smartpay-button",C);let Cs=!1;class Ss extends C{connectedCallback(){Cs||(Cs=!0,console.warn("[Nexora SmartPay] <apolopay-button> is deprecated and will be removed in a future major version. Use <smartpay-button> instead.")),super.connectedCallback()}}customElements.get("apolopay-button")||customElements.define("apolopay-button",Ss),N.APOLOPAY_NETWORK_ID=be,N.ApoloPayButton=Ss,N.ApoloPayClient=cn,N.ClientCode=G,N.ClientError=Kt,N.ClientResponse=Rt,N.ClientResponseBase=ye,N.DEFAULT_API_URL=ms,N.DEFAULT_SOCKET_URL=gs,N.I18n=_,N.LEGACY_APOLO_API_URL=rn,N.LEGACY_APOLO_SOCKET_URL=nn,N.ModalStep=S,N.PaymentService=xs,N.SmartPayButton=C,N.SmartPayClient=bs,N.generateQrCodeDataUri=Wt,N.isApoloPayNetwork=ft,N.withoutApoloPayNetworks=ve,Object.defineProperty(N,Symbol.toStringTag,{value:"Module"})}));

;(function(g){if(g&&g.NexoraSmartPay&&!g.ApoloPaySDK){g.ApoloPaySDK=g.NexoraSmartPay;}})(typeof globalThis!=="undefined"?globalThis:typeof self!=="undefined"?self:undefined);
