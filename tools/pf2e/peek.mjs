import { ClassicLevel } from 'classic-level';
const dir = process.argv[2];
const db = new ClassicLevel(dir, { keyEncoding:'utf8', valueEncoding:'json' });
let n=0; const keys=[]; let sample=null;
for await (const [k,v] of db.iterator()) { if(n<8) keys.push(k); if(!sample && v && v.type) sample=v; n++; }
console.log("total keys:", n);
console.log("sample keys:", keys);
console.log("sample doc type:", sample && sample.type, "| name:", sample && sample.name);
await db.close();
