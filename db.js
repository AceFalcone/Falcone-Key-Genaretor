const DB_NAME = "falcone-key-generator";
const DB_VERSION = 1;
let dbPromise;
export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of ["users","apps","records","attachments","settings","audit","customers"]) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
export async function all(store) {
  const db = await openDB();
  return new Promise((resolve,reject) => {
    const tx = db.transaction(store,"readonly"), req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
export async function get(store,id) {
  const db = await openDB();
  return new Promise((resolve,reject) => {
    const req=db.transaction(store,"readonly").objectStore(store).get(id);
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
export async function put(store,value) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(store,"readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete=()=>resolve(value); tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error);
  });
}
export async function remove(store,id) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(store,"readwrite"); tx.objectStore(store).delete(id);
    tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
  });
}
export async function putMany(entries) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction([...new Set(entries.map(e=>e[0]))],"readwrite");
    for(const [store,value] of entries) tx.objectStore(store).put(value);
    tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error);
  });
}
export async function clearStore(store) {
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(store,"readwrite"); tx.objectStore(store).clear();
    tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
  });
}
