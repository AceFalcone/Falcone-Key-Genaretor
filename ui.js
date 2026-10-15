export const $ = (s,root=document)=>root.querySelector(s);
export const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
export function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
export function id(prefix="id"){return prefix+"-"+crypto.randomUUID();}
export function date(v){return v?new Date(v).toLocaleString():"—";}
export function dayStart(){const d=new Date();d.setHours(0,0,0,0);return d.toISOString();}
export function statusOf(r){if(r.status==="Revoked")return "Revoked";if(r.licenseType==="Demo"&&r.expiryAt&&Date.now()>new Date(r.expiryAt).getTime())return "Expired";return "Active";}
export function badge(text,kind=""){return `<span class="badge ${kind||String(text).toLowerCase()}">${esc(text)}</span>`;}
export function empty(title,sub=""){return `<div class="empty"><b>${esc(title)}</b>${esc(sub)}</div>`;}
let toastTimer;
export function toast(message,error=false){const el=$("#toast");el.textContent=message;el.classList.toggle("error-toast",error);el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3500);}
export function ask(message){return window.confirm(message);}
export function validPhone(v){return /^[+]?[\d\s().-]{7,22}$/.test(v.trim())&&v.replace(/\D/g,"").length>=7;}
export function validUrl(v){try{const u=new URL(v);return u.protocol==="https:"||u.protocol==="http:";}catch{return false;}}
export async function copyText(text){try{await navigator.clipboard.writeText(text);toast("Copied to clipboard.");}catch{const ta=document.createElement("textarea");ta.value=text;document.body.append(ta);ta.select();const ok=document.execCommand("copy");ta.remove();toast(ok?"Copied to clipboard.":"Clipboard access failed. Please copy manually.",!ok);}}
export function safeFileName(s){return String(s||"activation").replace(/[^a-z0-9-_]/gi,"_");}
