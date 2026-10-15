/* Scalar replacement literals only; no evaluation, recursive expansion or target code generation. */
'use strict';
const LIMITS=Object.freeze({bodyCharacters:4096,replacements:4096});
const NAME=/^[A-Za-z_][A-Za-z0-9_]{0,127}$/;
// Keep source spelling, including doubled quotes. No backslash escapes, signs, octal or suffixes.
const SCALAR=/^(?:0[xX][0-9A-Fa-f]+|(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|"(?:[^"\\\x00-\x1f]|"")*")$/;
function create(markers,block,location,sourceView){
 const definitions=new Map();
 const reject=(source,detail)=>block('UNSUPPORTED_SCALAR_MACRO',source,detail);
 return {
  signature(){return JSON.stringify([...markers].sort().map(name=>[name,definitions.get(name)?.text??null]));},
  define(payload,source,active,includeOccurrenceId){
   const parsed=/^([A-Za-z_][A-Za-z0-9_]*)(?:[\t ]+([\s\S]*))?$/.exec(payload);
   if(!parsed||!NAME.test(parsed[1])||parsed[1].startsWith('__'))reject(source,'Expected a literal object-like macro name. Function macros and reserved names are unsupported.');
   const name=parsed[1],text=parsed[2]?.trim()||null;
   if(text!==null&&(text.length>LIMITS.bodyCharacters||!SCALAR.test(text)))reject(source,'Replacement must be one bounded numeric or double-quoted scalar literal; aliases, expressions and function macros are unsupported.');
   if(!active)return;
   if(markers.has(name)&&(definitions.get(name)?.text??null)!==text)reject(source,'Conflicting macro redefinition requires an explicit undef.');
   if(!markers.has(name)&&markers.size>=256)reject(source,'Conditional marker budget exceeded.');
   markers.add(name);
   if(text!==null){const view=sourceView(source.file).slice(source.start,source.end),offset=view.lastIndexOf(text);if(offset<0)throw Error('Macro origin span missing');definitions.set(name,{text,source:location(source.file,source.start+offset,source.start+offset+text.length),includeOccurrenceId});}
  },
  undef(name){definitions.delete(name);},
  replacements(file,start,end){
   const text=sourceView(file),found=[];
   for(let i=start;i<end;){
    const c=text[i];
    if(c==='"'){i++;while(i<end){if(text[i]==='"'){if(text[i+1]==='"'){i+=2;continue;}i++;break;}i++;}continue;}
    if(c==="'")reject(location(file,i,i+1),'Single-quoted active strings need Arma-specific macro rules and are outside this profile.');
    if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(text[i+1]||''))){i++;while(i<end){if(/[eEpP]/.test(text[i])&&/[+-]/.test(text[i+1]||'')){i+=2;continue;}if(/[A-Za-z0-9_.]/.test(text[i])){i++;continue;}break;}continue;}
    if(/[A-Za-z_]/.test(c)){
     const begin=i++;while(i<end&&/[A-Za-z0-9_]/.test(text[i]))i++;const name=text.slice(begin,i),source=location(file,begin,i);
     if(name.startsWith('__'))reject(source,'Reserved builtin substitutions are unsupported.');
     if(!markers.has(name))continue;
     const definition=definitions.get(name);
     if(!definition)reject(source,'Empty marker substitution is unsupported; markers may only control conditions.');
     if(/[A-Za-z0-9_.$"'\u0080-\uffff]/.test(text[begin-1]||'')||/[A-Za-z0-9_.$"'\u0080-\uffff]/.test(text[i]||''))reject(source,'Adjacent source tokens could merge with the replacement; explicit spacing or punctuation is required.');
     if(found.length>=LIMITS.replacements)throw Error('Scalar macro replacement limit exceeded');
     found.push({name,source,definition});
    }else i++;
   }
   return found;
  }
 };
}
module.exports={LIMITS,create};
