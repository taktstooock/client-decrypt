import {deriveKey} from "./derive-key.js";

export const enc=async(file,pass)=>{
  const iv=window.crypto.getRandomValues(new Uint8Array(12));
  const algo={name:"AES-GCM",iv};
  const salt=self.crypto.getRandomValues(new Uint8Array(16));
  const key=await deriveKey(pass,salt);
  const data=await (new Blob([iv,file])).arrayBuffer();
  console.log(`enc(${JSON.stringify(algo)},key(${pass}),${new Uint8Array(data)})`);
  const ab=await window.crypto.subtle.encrypt(algo,key,data);
  console.log(`result:${new Uint8Array(ab)}`);
  return new File([iv,salt,ab],file.name+"-e");
};

export const dec=async(file,pass)=>{
  const res=await file.arrayBuffer();
  const iv=new Uint8Array(res,0,12);
  const salt=new Uint8Array(res,12,16);
  const ab=res.slice(12+16,res.byteLength);
  const algo={name:"AES-GCM",iv};
  const key=await deriveKey(pass,salt);
  const rtn=await crypto.subtle.decrypt(algo,key,ab);
  if((new TextDecoder()).decode(rtn.slice(0,12))==(new TextDecoder()).decode(iv)){
    return new Blob([rtn.slice(12,rtn.byteLength)]);
  }else{
    return null;
  }
};
