// Small read-only CSS helpers: preserve variable-based shorthand declarations.
export function splitStyleText(text, separator) {
  const result=[]; let start=0,depth=0,quote='';
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(quote){if(c===quote&&text[i-1]!=='\\')quote='';continue;}
    if(c==='"'||c==="'"){quote=c;continue;}
    if(c==='('||c==='[')depth++; else if(c===')'||c===']')depth--;
    if(c===separator&&!depth){result.push(text.slice(start,i));start=i+1;}
  }
  result.push(text.slice(start));return result;
}
export function readStyleDeclarations(text) {
  return splitStyleText(text,';').map(part=>{
    const colon=part.indexOf(':');if(colon<0)return null;
    const name=part.slice(0,colon).trim(),raw=part.slice(colon+1).trim();
    const important=/!important\s*$/i.test(raw);
    return {name,value:raw.replace(/!important\s*$/i,'').trim(),important};
  }).filter(item=>item&&item.name&&item.value);
}
export function readStyleRules(text) {
  text=text.replace(/\/\*[\s\S]*?\*\//g,'');
  const rules=[];let cursor=0;
  while(cursor<text.length){
    let quote='',depth=0,open=-1;
    for(let i=cursor;i<text.length;i++){
      const c=text[i];if(quote){if(c===quote&&text[i-1]!=='\\')quote='';continue;}
      if(c==='"'||c==="'"){quote=c;continue;}if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;
      if(c==='{'&&!depth){open=i;break;}
    }
    if(open<0)break;
    let close=open+1,braces=1;quote='';
    for(;close<text.length;close++){
      const c=text[close];if(quote){if(c===quote&&text[close-1]!=='\\')quote='';continue;}
      if(c==='"'||c==="'"){quote=c;continue;}if(c==='{')braces++;if(c==='}'&&!--braces)break;
    }
    const header=text.slice(cursor,open).trim(),body=text.slice(open+1,close);cursor=close+1;
    if(header.startsWith('@')){
      if(/^@(media|supports|layer)\b/.test(header))rules.push({header,rules:readStyleRules(body)});
    }else if(header)rules.push({header,body,declarations:readStyleDeclarations(body)});
  }
  return rules;
}
