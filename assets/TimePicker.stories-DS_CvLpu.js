var ht=Object.defineProperty;var N=r=>{throw TypeError(r)};var at=(r,t,e)=>t in r?ht(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var h=(r,t,e)=>at(r,typeof t!="symbol"?t+"":t,e),Y=(r,t,e)=>t.has(r)||N("Cannot "+e);var y=(r,t,e)=>(Y(r,t,"read from private field"),e?e.call(r):t.get(r)),f=(r,t,e)=>t.has(r)?N("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),w=(r,t,e,s)=>(Y(r,t,"write to private field"),s?s.call(r,e):t.set(r,e),e),p=(r,t,e)=>(Y(r,t,"access private method"),e);import{j as L}from"./jsx-runtime-D_zvdyIk.js";import{r as A}from"./index-DmM0KDA7.js";const X={en:{AM:"AM",PM:"PM"},ko:{AM:"오전",PM:"오후"},ja:{AM:"午前",PM:"午後"},zh:{AM:"上午",PM:"下午"}};var P,S,D,I,C,u,it,b,rt,nt;class ct{constructor({hourFormat:t,infinite:e,locale:s="en"}={}){f(this,u);f(this,P);f(this,S);f(this,D);f(this,I);f(this,C);w(this,I,t??"12"),w(this,C,e??!1),w(this,P,[{value:1,text:X[s].AM},{value:2,text:X[s].PM}]),w(this,S,p(this,u,rt).call(this)),w(this,D,p(this,u,nt).call(this))}get ampm(){return y(this,P)}get hours(){return y(this,S)}get minutes(){return y(this,D)}}P=new WeakMap,S=new WeakMap,D=new WeakMap,I=new WeakMap,C=new WeakMap,u=new WeakSet,it=function(t){return t===0?"12":t>12?String(t-12):String(t)},b=function(t,e,s=!1){return Array.from({length:e-t+1},(i,o)=>{const c=o+t,n=s?p(this,u,it).call(this,c):String(c).padStart(2,"0");return{value:c,text:n}})},rt=function(){const t=y(this,I)==="12";return y(this,C)?p(this,u,b).call(this,0,23,t):p(this,u,b).call(this,t?1:0,t?12:23,t)},nt=function(){return p(this,u,b).call(this,0,59)};const ut={easeOutCubic:function(r){return Math.pow(r-1,3)+1},easeOutQuart:function(r){return-(Math.pow(r-1,4)-1)}};function j(r,t){let e=r;for(;e<0;)e+=t;return e%t}function $(r,t){return[...new Array(t-r)].map((e,s)=>r+s)}const l={wrapper:"ios-style-picker",optionList:"ios-style-picker__option-list",optionItem:"ios-style-picker__option-item",highlight:"ios-style-picker__highlight",highlightList:"ios-style-picker__highlight-list",highlightItem:"ios-style-picker__highlight-item"};class lt{constructor({container:t,source:e,isInfinite:s,wheelCount:i,itemAngle:o,itemHeight:c,radius:n}){h(this,"_container");h(this,"_optionList");h(this,"_optionItems");h(this,"_highlightList");h(this,"_source");h(this,"_isInfinite");h(this,"wheelCount");h(this,"itemAngle");h(this,"itemHeight");h(this,"radius");this._container=t,this._source=e,this._isInfinite=s,this.wheelCount=i,this.itemAngle=o,this.itemHeight=c,this.radius=n;const g=this._getOptionItems(),d=this._getHighlightItems();this._container.innerHTML=`
      <div class="${l.wrapper}">
        <ul
          class="${l.optionList}"
          style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);"
        >
          ${g}
        </ul>
        <div
          class="${l.highlight}"
          style="height: ${this.itemHeight}px; line-height: ${this.itemHeight}px;"
        >
          <ul class="${l.highlightList}">
            ${d}
          </ul>
        </div>
      </div>`;const T=this._container.querySelector(`.${l.optionList}`);if(!T)throw new Error("optionList does not exists");this._optionList=T;const _=this._container.querySelectorAll(`.${l.optionItem}`);if(!_)throw new Error("optionList does not exists");this._optionItems=_;const H=this._container.querySelector(`.${l.highlightList}`);if(!H)throw new Error("highlightList does not exists.");s&&(H.style.top=`${-this.itemHeight}px`),this._highlightList=H}_getOptionItems(){return(this._isInfinite?$(-this.wheelCount/4,this._source.length+this.wheelCount/4):$(0,this._source.length)).map(s=>({rotateX:-this.itemAngle*s,index:s,text:this._source[(s+this._source.length)%this._source.length].text})).reduce((s,i)=>`${s}
        <li
          class="${l.optionItem}"
          style="
            top: ${this.itemHeight*-.5}px;
            height: ${this.itemHeight}px;
            line-height: ${this.itemHeight}px;
            transform: rotateX(${i.rotateX}deg) translate3d(0, 0, ${this.radius}px);
          "
          data-index="${i.index}"
        >
          ${i.text}
        </li>`,"")}_getHighlightItems(){return(this._isInfinite?$(-1,this._source.length+1):$(0,this._source.length)).map(s=>({text:this._source[(s+this._source.length)%this._source.length].text})).reduce((s,i)=>`${s}
        <li
          class="${l.highlightItem}"
          style="height: ${this.itemHeight}px;"
        >
          ${i.text}
        </li>`,"")}scroll(t){const e=-this.radius,s=this.itemAngle*t;this._optionList.style.transform=`translate3d(0, 0, ${e}px) rotateX(${s}deg)`;const i=-t*this.itemHeight;this._highlightList.style.transform=`translate3d(0, ${i}px, 0)`,[...this._optionItems].forEach(o=>{if(o.dataset.index===void 0)throw new Error("itemElem.dataset.index does not exists");o.style.visibility=Math.abs(+o.dataset.index-t)>this.wheelCount/4?"hidden":"visible"})}addEventListener(t,e){this._container.addEventListener(t,e)}removeEventListener(t,e){this._container.removeEventListener(t,e)}equalOrContains(t){var e;return((e=this._container)==null?void 0:e.contains(t))||this._container===t}clear(){this._container.innerHTML=""}get container(){return this._container}}class F{constructor(t,e){h(this,"variant");h(this,"source");h(this,"selected");h(this,"currentData");h(this,"onChange");h(this,"onSelect");h(this,"sensitivity");h(this,"wheelCount");h(this,"exceedA");h(this,"moveT");h(this,"moving");h(this,"targetElement");h(this,"html");h(this,"events");h(this,"itemHeight");h(this,"itemAngle");h(this,"radius");h(this,"scroll");h(this,"touchData",{startY:0,yArr:[],touchScroll:0});var i,o;this.variant=e.variant??"infinite",this.source=e.source,this.currentData=typeof e.currentData=="number"?e.currentData-1:0,this.selected=this.source[this.currentData],this.onChange=e.onChange,this.onSelect=e.onSelect;const s=e.count??20;if(this.wheelCount=s-s%4,this.sensitivity=e.sensitivity??8,this.exceedA=10,this.moveT=0,this.moving=!1,this.targetElement=t,!this.targetElement)throw new Error("targetElement does not exists.");this.itemHeight=this.targetElement.offsetHeight*3/s,this.itemAngle=360/s,this.radius=this.itemHeight/Math.tan(this.itemAngle*Math.PI/180),this.scroll=0,this._create(this.source),this.events={touchstart:this._createEventListener("touchstart"),touchmove:this._createEventListener("touchmove"),touchend:this._createEventListener("touchend")},(i=this.html)==null||i.addEventListener("touchstart",this.events.touchstart),document.addEventListener("mousedown",this.events.touchstart),(o=this.html)==null||o.addEventListener("touchend",this.events.touchend),document.addEventListener("mouseup",this.events.touchend),this.source.length&&this.select(this.selected.value)}_createEventListener(t){return e=>{var s;(s=this.html)!=null&&s.equalOrContains(e.target)&&this.source.length!==0&&(e.preventDefault(),this[`_${t}`](e))}}_touchstart(t){if(!this.html)throw new Error("this.html does not exists");this.html.addEventListener("touchmove",this.events.touchmove),document.addEventListener("mousemove",this.events.touchmove);const e=t.clientY??t.touches[0].clientY;this.touchData.startY=e,this.touchData.yArr=[[e,new Date().getTime()]],this.touchData.touchScroll=this.scroll,this._stop()}_touchmove(t){const e=t.clientY??t.touches[0].clientY;this.touchData.yArr.push([e,new Date().getTime()]),this.touchData.yArr.length>5&&this.touchData.yArr.unshift();const i=(this.touchData.startY-e)/this.itemHeight+this.scroll,o=this.variant==="infinite"?j(i,this.source.length):i<0?i*.3:i>this.source.length?this.source.length+(i-this.source.length)*.3:i;this.touchData.touchScroll=this._moveTo(o)}_getInitV(){if(this.touchData.yArr.length===1)return 0;const t=this.touchData.yArr[this.touchData.yArr.length-2][1],e=this.touchData.yArr[this.touchData.yArr.length-1][1],s=this.touchData.yArr[this.touchData.yArr.length-2][0],i=this.touchData.yArr[this.touchData.yArr.length-1][0],o=(s-i)/this.itemHeight*1e3/(e-t),c=o>0?1:-1;return Math.abs(o)>30?30*c:o}_touchend(t){if(!this.html)throw new Error("this.html does not exists.");this.html.removeEventListener("touchmove",this.events.touchmove),document.removeEventListener("mousemove",this.events.touchmove);const e=this._getInitV();this.scroll=this.touchData.touchScroll,this._animateMoveByInitV(e)}_create(t){if(!t.length)throw new Error("source does not exists.");if(this.variant==="infinite"){let e=[...t];for(;e.length<this.wheelCount/2;)e=e.concat(t);t=e}this.source=t,this.html=new lt({container:this.targetElement,source:this.source,isInfinite:this.variant==="infinite",wheelCount:this.wheelCount,itemAngle:this.itemAngle,itemHeight:this.itemHeight,radius:this.radius})}_moveTo(t){if(!this.html)throw new Error("html does not exists");if(this.variant==="infinite"&&(t=j(t,this.source.length)),this.html.scroll(t),this.onSelect){const e=Math.round(t)>this.source.length-1?this.source.length-1:Math.round(t);this.onSelect(this.source[Math.round(e)])}return t}async _animateMoveByInitV(t){if(this.variant==="infinite"){const e=t>0?-this.sensitivity:this.sensitivity,s=Math.abs(t/e),i=t*s+e*s*s/2,o=Math.round(this.scroll+i);await this._animateToScroll(this.scroll,o,s,"easeOutQuart")}else if(this.scroll<0||this.scroll>this.source.length-1){const e=this.scroll<0?0:this.source.length-1;await this._animateToScroll(this.scroll,e,Math.sqrt(Math.abs((this.scroll-e)/this.exceedA)))}else{const e=t>0?-this.sensitivity:this.sensitivity;let s=Math.abs(t/e),i=t*s+e*s*s/2,o=Math.round(this.scroll+i);o=o<0?0:o>this.source.length-1?this.source.length-1:o,i=o-this.scroll,s=Math.sqrt(Math.abs(i/e)),await this._animateToScroll(this.scroll,o,s,"easeOutQuart")}this._selectByScroll(this.scroll)}_animateToScroll(t,e,s,i="easeOutQuart"){if(t===e||s===0){this._moveTo(t);return}const o=new Date().getTime()/1e3,c=e-t;return new Promise(n=>{this.moving=!0;const g=()=>{const d=new Date().getTime()/1e3-o;d<s?(this.scroll=this._moveTo(t+ut[i](d/s)*c),this.moveT=requestAnimationFrame(g)):(n(),this._stop(),this.scroll=this._moveTo(t+c))};g()})}_stop(){this.moving=!1,cancelAnimationFrame(this.moveT)}_selectByScroll(t){t=j(t,this.source.length)|0,t>this.source.length-1&&(t=this.source.length-1,this._moveTo(t)),this._moveTo(t),this.scroll=t,this.selected=this.source[t],this.onChange&&this.onChange(this.selected)}selectByCurrentHour(t){this.moving||this._selectByScroll(t)}select(t){for(let e=0;e<this.source.length;e++)if(this.source[e].value===t){window.cancelAnimationFrame(this.moveT);const s=e;this._selectByScroll(s);return}throw new Error(`can't find value: ${t}`)}async updateAmPm(t){const e=this.source.findIndex(c=>c.value===t);if(e===-1)throw new Error(`Can't find value: ${t}`);const s=this.scroll,i=e,o=Math.sqrt(Math.abs((i-s)/this.sensitivity));await this._animateToScroll(s,i,o)}destroy(){var t,e,s,i;this._stop(),(t=this.html)==null||t.removeEventListener("touchstart",this.events.touchstart),(e=this.html)==null||e.removeEventListener("touchmove",this.events.touchmove),(s=this.html)==null||s.removeEventListener("touchend",this.events.touchend),document.removeEventListener("mousedown",this.events.touchstart),document.removeEventListener("mousemove",this.events.touchmove),document.removeEventListener("mouseup",this.events.touchend),(i=this.html)==null||i.clear()}}const mt=100,R=({onChange:r,initTime:t=new Date,infinite:e=!1,className:s,hourFormat:i="12",locale:o="en"})=>{const c="react-ios-style-time-picker"+(s?` ${s}`:""),n=A.useRef({currentHour:i==="12"&&!e?t.getHours()%12||12:t.getHours(),currentMinute:t.getMinutes(),currentAmPm:t.getHours()<12?1:2,source:new ct({hourFormat:i,infinite:e,locale:o}),onChange:r,onChangeTimeout:null}).current,g=A.useRef(null),d=A.useRef(null),T=A.useRef(null);return A.useEffect(()=>{n.onChange=r},[r]),A.useEffect(()=>{const _=()=>{n.onChangeTimeout&&clearTimeout(n.onChangeTimeout),n.onChangeTimeout=setTimeout(()=>{n.onChange(n.currentHour,n.currentMinute),n.onChangeTimeout=null},mt)},H=()=>{O.selectByCurrentHour(n.currentHour)},m=i==="12"&&new F(g.current,{variant:"normal",source:n.source.ampm,currentData:n.currentAmPm,onChange:a=>{const v=n.currentAmPm!==a.value;i==="12"&&(a.value===1?n.currentHour=n.currentHour%12:a.value===2&&(n.currentHour=n.currentHour%12+12),n.currentAmPm=a.value),v&&(e===!0&&H(),_())}}),O=new F(d.current,{variant:e?"infinite":"normal",source:n.source.hours,onChange:a=>{const v=n.currentHour!==a.value;n.currentAmPm===2&&a.value<12?n.currentHour=a.value+12:n.currentAmPm===1&&a.value===12?n.currentHour=0:n.currentHour=a.value,v&&_()},onSelect:a=>{e===!0&&i==="12"&&(a.value<12?m&&(m.updateAmPm(1),n.currentAmPm=1):a.value>=12&&m&&(m.updateAmPm(2),n.currentAmPm=2))}}),B=new F(T.current,{variant:e?"infinite":"normal",source:n.source.minutes,onChange:a=>{const v=n.currentMinute!==a.value;n.currentMinute=a.value,v&&_()}});return setTimeout(()=>{const a=i==="12"&&!e?t.getHours()%12||12:t.getHours(),v=t.getMinutes(),ot=t.getHours()<12?1:2;i==="12"&&m&&m.select(ot),O.select(a),B.select(v)},0),()=>{m&&m.destroy(),O.destroy(),B.destroy()}},[e,i]),L.jsxs("div",{className:c,children:[i==="12"&&L.jsx("div",{ref:g}),L.jsx("div",{ref:d}),L.jsx("div",{ref:T})]})};R.__docgenInfo={description:"",methods:[],displayName:"TimePicker",props:{onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(hour: number, minute: number) => void",signature:{arguments:[{type:{name:"number"},name:"hour"},{type:{name:"number"},name:"minute"}],return:{name:"void"}}},description:""},initTime:{required:!1,tsType:{name:"Date"},description:"",defaultValue:{value:"new Date()",computed:!1}},infinite:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},hourFormat:{required:!1,tsType:{name:"union",raw:"'12' | '24'",elements:[{name:"literal",value:"'12'"},{name:"literal",value:"'24'"}]},description:"",defaultValue:{value:"'12'",computed:!1}},locale:{required:!1,tsType:{name:"union",raw:"keyof typeof LOCALE_MAP",elements:[{name:"literal",value:"en"},{name:"literal",value:"ko"},{name:"literal",value:"ja"},{name:"literal",value:"zh"}]},description:"",defaultValue:{value:"'en'",computed:!1}}}};const ft={title:"TimePicker",component:R},q=r=>L.jsx(R,{...r}),k=q.bind({}),x=q.bind({});x.args={infinite:!0};const E=q.bind({});E.args={hourFormat:"24"};const M=q.bind({});M.args={infinite:!0,hourFormat:"24"};var z,Q,V;k.parameters={...k.parameters,docs:{...(z=k.parameters)==null?void 0:z.docs,source:{originalSource:"(args: TimePickerProps) => <TimePicker {...args} />",...(V=(Q=k.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var G,U,J;x.parameters={...x.parameters,docs:{...(G=x.parameters)==null?void 0:G.docs,source:{originalSource:"(args: TimePickerProps) => <TimePicker {...args} />",...(J=(U=x.parameters)==null?void 0:U.docs)==null?void 0:J.source}}};var K,W,Z;E.parameters={...E.parameters,docs:{...(K=E.parameters)==null?void 0:K.docs,source:{originalSource:"(args: TimePickerProps) => <TimePicker {...args} />",...(Z=(W=E.parameters)==null?void 0:W.docs)==null?void 0:Z.source}}};var tt,et,st;M.parameters={...M.parameters,docs:{...(tt=M.parameters)==null?void 0:tt.docs,source:{originalSource:"(args: TimePickerProps) => <TimePicker {...args} />",...(st=(et=M.parameters)==null?void 0:et.docs)==null?void 0:st.source}}};const pt=["Default","DefaultInfinite","TwentyFourHourFormat","TwentyFourHourFormatInfinite"];export{k as Default,x as DefaultInfinite,E as TwentyFourHourFormat,M as TwentyFourHourFormatInfinite,pt as __namedExportsOrder,ft as default};
