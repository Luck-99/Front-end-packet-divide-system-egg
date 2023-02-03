"use strict";(self["webpackChunkvue_test"]=self["webpackChunkvue_test"]||[]).push([[873],{1873:function(e,t,s){s.r(t),s.d(t,{default:function(){return h}});var r=function(){var e=this,t=e._self._c;return t("div",{staticClass:"main"},[t("canvas",{staticStyle:{background:"linear-gradient(#8cc5ff, #d9ecff)",display:"block"},attrs:{id:"myCanvas"}}),t("div",{staticClass:"content"},[t("h2",[e._v(e._s(e.title))]),t("el-form",{ref:"userForm",attrs:{model:e.user,"status-icon":"",rules:e.rules}},[t("el-form-item",{attrs:{label:"",prop:"username"}},[t("el-input",{attrs:{placeholder:"请输入账号"},model:{value:e.user.username,callback:function(t){e.$set(e.user,"username",t)},expression:"user.username"}})],1),t("el-form-item",{attrs:{label:"",prop:"password"}},[t("el-input",{attrs:{type:"password",placeholder:"请输入密码"},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.login("userForm")}},model:{value:e.user.password,callback:function(t){e.$set(e.user,"password",t)},expression:"user.password"}})],1),t("el-form-item",[t("el-button",{attrs:{type:"primary",loading:e.loading},on:{click:function(t){return e.login("userForm")}}},[e._v("登录")])],1)],1)],1)])},n=[],o=s(9195),a={name:"LoginView",data(){return{title:"前端分组分治打包系统",user:{username:"",password:""},loading:!1,rules:{username:[{required:!0,trigger:"blur",message:"账号不能为空！"}],password:[{required:!0,trigger:"blur",message:"密码不能为空！"}]}}},methods:{login(e){this.$refs[e].validate((async e=>{if(!e)return!1;{this.loading=!0;const e=await(0,o.x4)({...this.user});e.code>0?this.$router.push({path:"/DashBoard"}):this.$message.error(e.msg),this.loading=!1}}))},getCanvas(){const e=document.getElementById("myCanvas");e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight;const t=e.getContext("2d");function s(){this.x=l(3,e.width-3),this.y=l(3,e.height-3),this.r=l(1,3),this.color=u(),this.speedX=.2*l(-3,3),this.speedY=.2*l(-3,3)}s.prototype={draw(){t.beginPath(),t.globalAlpha=1,t.fillStyle=this.color,t.arc(this.x,this.y,this.r,0,2*Math.PI),t.fill()},move(){this.x+=this.speedX,this.y+=this.speedY,(this.x<=3||this.x>e.width-3)&&(this.speedX*=-1),(this.y<=3||this.y>=e.height-3)&&(this.speedY*=-1)}};let r,n,o=[];for(let d=0;d<150;d++){let e=new s;o.push(e)}function a(){for(let e=0;e<o.length;e++){o[e].draw(),o[e].move();for(let s=0;s<o.length;s++)e!=s&&Math.sqrt(Math.pow(o[e].x-o[s].x,2)+Math.pow(o[e].y-o[s].y,2))<80&&(t.beginPath(),t.moveTo(o[e].x,o[e].y),t.lineTo(o[s].x,o[s].y),t.strokeStyle="white",t.globalAlpha=.2,t.stroke())}}function i(){for(let e=0;e<o.length;e++)Math.sqrt(Math.pow(o[e].x-r,2)+Math.pow(o[e].y-n,2))<80&&(t.beginPath(),t.moveTo(o[e].x,o[e].y),t.lineTo(r,n),t.strokeStyle="white",t.globalAlpha=.8,t.stroke())}function l(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function u(){return"rgb("+l(0,255)+","+l(0,255)+","+l(0,255)+")"}function h(){t.clearRect(0,0,e.width,e.height),i(),a(),window.requestAnimationFrame(h)}e.onmousemove=function(e){let t=event||e;r=t.offsetX,n=t.offsetY},h()}},mounted(){this.getCanvas()}},i=a,l=s(1001),u=(0,l.Z)(i,r,n,!1,null,"387db6f8",null),h=u.exports},9195:function(e,t,s){s.d(t,{Zw:function(){return a},bG:function(){return i},bs:function(){return l},kS:function(){return o},x4:function(){return n}});var r=s(7861);const n=async e=>(0,r.W)("/user/login",{method:"POST",data:e}),o=async e=>(0,r.W)("/user/logout",{method:"POST",data:e}),a=async e=>(0,r.W)("/user/getMembers",{method:"GET",params:e}),i=async e=>(0,r.W)("/user/getUserInfo",{method:"GET",params:e}),l=async e=>(0,r.W)("/user/changePassWord",{method:"POST",data:e})}}]);