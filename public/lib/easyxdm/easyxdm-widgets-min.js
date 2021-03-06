/**
 * easyXDM
 * http://easyxdm.net/
 * Copyright(c) 2009-2011, Øyvind Sean Kinsey, oyvind@kinsey.no.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
easyXDM.WidgetManager=function(e){var h=this,b=e.local,k=0;var n={WidgetInitialized:"widgetinitialized",WidgetFailed:"widgetfailed"};var j={},d={};var i={hosturl:location.href};easyXDM.apply(i,e.widgetSettings);var g=e.container||document.body;function f(p,o){if(e.listeners&&e.listeners.event){e.listeners.event(h,o)}}function c(p,o){if(!(o in d)){d[o]=[]}d[o].push(p)}function m(p,o,q){p.initialize(i,function(r){if(r.isInitialized){j[o]=p;var s=r.subscriptions.length;while(s--){c(o,r.subscriptions[s])}f(n.WidgetInitialized,{url:o})}else{p.destroy();f(n.WidgetFailed,{url:o})}})}function a(p,o,r){var s=d[o];if(s){var q=s.length,t;while(q--){t=s[q];if(t!==p){j[t].send(p,o,r)}}}}function l(o,q){var p=new easyXDM.Rpc({channel:"widget"+k++,local:b,remote:o,container:q.container||g,swf:e.swf,onReady:function(){m(p,o,q)}},{local:{subscribe:{isVoid:true,method:function(r){c(o,r)}},publish:{isVoid:true,method:function(r,s){a(o,r,s)}}},remote:{initialize:{},send:{isVoid:true}}})}this.addWidget=function(o,p){if(o in j){throw new Error("A widget with this url has already been initialized")}l(o,p)};this.removeWidget=function(p){if(p in j){for(var o in d){if(d.hasOwnProperty(o)){var r=d[o],q=r.length;while(q--){if(r[q]===p){r.splice(q,1);break}}}}j[p].destroy();delete j[p]}};this.publish=function(o,p){a("",o,p)};this.broadcast=function(p){for(var o in j){if(j.hasOwnPropert(o)){j[o].send({url:"",topic:"broadcast",data:p})}}}};easyXDM.Widget=function(c){var a=this;var b;var d=new easyXDM.Rpc({swf:c.swf},{remote:{subscribe:{isVoid:true},publish:{isVoid:true}},local:{initialize:{method:function(e){c.initialized(a,d);return{isInitialized:true,subscriptions:c.subscriptions}}},send:{isVoid:true,method:function(f,e,g){b(f,e,g)}}}});window.onunload=function(){d.destroy()};this.publish=function(e,f){d.publish(e,f)};this.subscribe=function(e){d.subscribe(e)};this.registerMessageHandler=function(e){b=e};c.initialize(this,d)};