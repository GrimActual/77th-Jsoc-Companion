/* Read-only bounded expression syntax; deliberately no evaluation or native lowering. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./sqf-structural-ast'));else root.CompanionSQFExpressions=factory(root.CompanionSQFAST);})(globalThis,AST=>{
'use strict';
const LIMITS=Object.freeze({characters:262144,tokens:8192,nodes:8192,depth:64,expressions:10000,reportBytes:8388608});
const REVIEW=Object.freeze(['variable-scopes-and-bindings','operand-types-and-effects','command-signatures-and-precedence','scheduling-and-locality','native-adapter-semantics']);
const precedence=Object.freeze({'+':1,'-':1,'*':2,'/':2,'%':2});
function parse(text){
 if(typeof text!=='string')throw Error('Expression source must be text');
 const reject=(message,offset)=>{const e=Error(message);e.offset=offset;throw e;};
 let at=0;const tokens=[],nodes=[];
 const add=(kind,value,start,end)=>{if(tokens.length>=LIMITS.tokens)reject('Expression token limit exceeded',start);tokens.push({kind,value,start,end});};
 try{
  if(text.length>LIMITS.characters)reject('Expression source limit exceeded',0);
  while(at<text.length){
   const start=at,c=text[at];if(/\s/.test(c)){at++;continue;}
   if(text.startsWith('//',at)){while(at<text.length&&text[at]!=='\n')at++;continue;}
   if(text.startsWith('/*',at)){const end=text.indexOf('*/',at+2);if(end<0)reject('Unterminated expression comment',at);at=end+2;continue;}
   if(c==='"'||c==="'"){const quote=c;let value='',closed=false;at++;while(at<text.length){if(text[at]===quote){if(text[at+1]===quote){value+=quote;at+=2;}else{at++;closed=true;break;}}else value+=text[at++];}if(!closed)reject('Unterminated expression string',start);add('string',value,start,at);continue;}
   const number=text.slice(at).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
   if(number){at+=number[0].length;const value=Number(number[0]);if(!Number.isFinite(value))reject('Non-finite numeric literal',start);add('number',value,start,at);continue;}
   const word=text.slice(at).match(/^[A-Za-z_][A-Za-z_0-9]*/);
   if(word){at+=word[0].length;add('word',word[0],start,at);continue;}
   if('+-*/%(),[]'.includes(c)){add('symbol',c,start,++at);continue;}
   reject('Unsupported expression token',start);
  }
  let cursor=0;
  const emit=(kind,start,end,extra={})=>{if(nodes.length>=LIMITS.nodes)reject('Expression node limit exceeded',start);const id='expr-'+nodes.length;nodes.push({id,kind,start,end,...extra});return id;};
  const get=id=>nodes[Number(id.slice(5))];
  const take=value=>tokens[cursor]?.value===value&&tokens[cursor]?.kind==='symbol'?(cursor++,true):false;
  function expression(min=0,depth=0){
   if(depth>=LIMITS.depth)reject('Expression nesting limit exceeded',tokens[cursor]?.start??text.length);
   const t=tokens[cursor++];if(!t)reject('Missing expression operand',text.length);let left;
   if(t.kind==='number'||t.kind==='string')left=emit('Literal',t.start,t.end,{value:t.value,literalType:t.kind});
   else if(t.kind==='word'){
    const lower=t.value.toLowerCase();
    if(['true','false'].includes(lower))left=emit('Literal',t.start,t.end,{value:lower==='true',literalType:'boolean'});
    else if(/^_[A-Za-z0-9_]+$/.test(t.value))left=emit('Symbol',t.start,t.end,{name:t.value,binding:'unresolved'});
    else reject('Command or namespace symbol requires a verified signature',t.start);
   }
   else if(t.kind==='symbol'&&['+','-'].includes(t.value)){const operand=expression(3,depth+1);left=emit('Unary',t.start,get(operand).end,{operator:t.value,operand});}
   else if(t.kind==='symbol'&&t.value==='('){const operand=expression(0,depth+1);if(!take(')'))reject('Expected closing parenthesis',tokens[cursor]?.start??text.length);left=emit('Group',t.start,tokens[cursor-1].end,{operand});}
   else if(t.kind==='symbol'&&t.value==='['){const elements=[];if(!take(']')){do{elements.push(expression(0,depth+1));}while(take(','));if(!take(']'))reject('Expected closing array bracket',tokens[cursor]?.start??text.length);}left=emit('Array',t.start,tokens[cursor-1].end,{elements});}
   else reject('Unsupported expression operand',t.start);
   while(cursor<tokens.length){const op=tokens[cursor];if(op.kind!=='symbol'||!Object.hasOwn(precedence,op.value)||precedence[op.value]<min)break;cursor++;const right=expression(precedence[op.value]+1,depth+1);left=emit('Binary',get(left).start,get(right).end,{operator:op.value,left,right});}
   return left;
  }
  const root=expression();if(cursor!==tokens.length)reject('Unconsumed syntax or unsupported command',tokens[cursor].start);
  return {status:'recognized',executable:false,semanticStatus:'unresolved',root,nodes,issue:null};
 }catch(error){return {status:'unsupported',executable:false,semanticStatus:'unresolved',root:null,nodes:[],issue:{message:error.message,offset:error.offset??at}};}
}
async function build(raw){
 // Capture validated data properties before the first asynchronous hash yields.
 if(!Array.isArray(raw)||Object.getPrototypeOf(raw)!==Array.prototype||!raw.length||raw.length>64)throw Error('Invalid expression source array');
 const keys=Reflect.ownKeys(raw).filter(k=>k!=='length');
 if(keys.length!==raw.length||keys.some(k=>typeof k!=='string'||!/^\d+$/.test(k)||Number(k)>=raw.length||!('value' in Object.getOwnPropertyDescriptor(raw,k))))throw Error('Invalid expression source fields');
 const files=raw.map(file=>{
  if(!file||![Object.prototype,null].includes(Object.getPrototypeOf(file)))throw Error('Invalid expression source record');
  const d=Object.getOwnPropertyDescriptors(file);
  if(Reflect.ownKeys(file).length!==2||!d.name||!d.text||!('value' in d.name)||!('value' in d.text)||!d.name.enumerable||!d.text.enumerable||typeof d.name.value!=='string'||typeof d.text.value!=='string')throw Error('Invalid expression source data');
  return {name:d.name.value,text:d.text.value};
 });
 // The structural builder validates plain input, filenames, aggregate sizes and source hashes first.
 const structural=await AST.build(files),sources=new Map(files.map(f=>[f.name.replace(/\\/g,'/'),f.text]));
 const report={schema:'command-sqf-expression-review',version:1,executable:false,syntaxOnly:true,offsetEncoding:'utf16-code-units',requiredReview:[...REVIEW],files:structural.files.map(f=>({...f})),expressions:[],summary:{recognized:0,unsupported:0,executionReady:0}};
 let serializedBytes=0;
 for(const node of structural.nodes){for(const part of node.parts){if(['target','counter'].includes(part.role))continue;
  if(report.expressions.length>=LIMITS.expressions)throw Error('Expression review count limit exceeded');
  const entry={nodeId:node.id,role:part.role,source:{...part.source},...parse(sources.get(part.source.file).slice(part.source.start,part.source.end))};
  // Offsets inside each expression tree are relative to its full source span, never its short preview.
  serializedBytes+=new TextEncoder().encode(JSON.stringify(entry)).length;
  if(serializedBytes>LIMITS.reportBytes)throw Error('Expression review byte limit exceeded');
  report.expressions.push(entry);report.summary[entry.status]++;
 }}
 if(new TextEncoder().encode(JSON.stringify(report)).length>LIMITS.reportBytes)throw Error('Expression review byte limit exceeded');
 return report;
}
return {LIMITS,REVIEW,parse,build};
});
