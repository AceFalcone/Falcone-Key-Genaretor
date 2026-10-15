import {all,put} from "./db.js";
export const DEFAULT_PERMS = {
  generateDemo:true, generateLifetime:true, viewDemo:true, viewLifetime:true,
  viewSlips:true, downloadPDF:true, shareDetails:true
};
export async function seed() {
  const users=await all("users");
  if(!users.length){
    const now=new Date().toISOString();
    await put("users",{id:"u-owner",username:"owner",password:"falcone123",name:"Demo Owner",role:"Owner",active:true,permissions:{...DEFAULT_PERMS,manage:true},createdAt:now});
    await put("users",{id:"u-manager",username:"manager",password:"demo123",name:"Demo Manager",role:"Manager",active:true,permissions:{...DEFAULT_PERMS,manage:false},createdAt:now});
    await put("users",{id:"u-cashier",username:"cashier",password:"demo123",name:"Demo Cashier",role:"Cashier",active:true,permissions:{...DEFAULT_PERMS,viewDemo:false,viewLifetime:false,viewSlips:false,downloadPDF:true,shareDetails:true,manage:false,ownRecordsOnly:true},createdAt:now});
  }
  const settings=await all("settings");
  if(!settings.some(x=>x.id==="company")) await put("settings",{id:"company",companyName:"Falcone Software",address:"",phone:"",whatsapp:"",email:"",website:"",logoData:"",defaultInstall:"",defaultActivate:"",policy:"[Add your sharing/resale policy here]"});
  const apps=await all("apps");
  if(!apps.length) await put("apps",{id:"APP01",name:"Falcone Demo App",version:"1.0.0",description:"Fictional sample application",logoData:"",apkUrl:"https://example.com/app.apk",installInstructions:"Download the APK and install it on your Android device. Allow installation from your browser/file manager if prompted.",activationInstructions:"Open the app, go to Activation, and enter the key provided below.",demoDays:7,active:true});
}
export async function login(username,password) {
  const users=await all("users");
  const user=users.find(u=>u.username.toLowerCase()===username.trim().toLowerCase()&&u.password===password&&u.active);
  return user||null;
}
export function isOwner(user){return user?.role==="Owner" || user?.permissions?.manage===true;}
export function can(user,permission,record=null) {
  if(isOwner(user)) return true;
  if(permission==="viewDemo"||permission==="viewLifetime") {
    if(user.permissions?.ownRecordsOnly) return !!record && record.createdById===user.id;
  }
  return !!user.permissions?.[permission];
}
