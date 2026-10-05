import {parse} from 'acorn';
import {fullAncestor} from 'acorn-walk';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const palettes = {'berry':'berryPalette','autumn':'autumnPalette','hoya':'hoyaPalette','lake-mist':'lakeMistPalette','palm-springs':'palmSpringsPalette','quiet-stone':'quietStonePalette','anatomy':'anatomyPalette','sculpted':'sculptedPalette','warm-medley':'warmMedleyPalette','pastel-jumper':'pastelJumperPalette','mint-ceramic':'mintCeramicPalette','soft-stone':'softStonePalette','aurora':'auroraPalette'};
function literal(node) {
  if(node.type==='Literal') return node.value;
  if(node.type==='ArrayExpression') return node.elements.map(literal);
  if(node.type==='ObjectExpression') return Object.fromEntries(node.properties.map(p=>[p.key.name??p.key.value,literal(p.value)]));
  throw new Error('Theme configuration must contain literal values');
}
export function themeCatalog(source) {
  let result;
  fullAncestor(parse(source,{ecmaVersion:'latest'}),n=>{if(n.type==='VariableDeclarator'&&n.id.name==='themeOptions') result=literal(n.init)});
  if(!result) throw new Error('Theme catalog is missing');
  return result;
}
export function pruneCss(css,theme) {
  const root=postcss.parse(css);
  root.walkRules(rule=>{
    const selectors=selectorParser().astSync(rule.selector);
    selectors.walkAttributes(attr=>{
      if(attr.attribute!=='data-xlyneve-color-theme'||attr.value!==theme) return;
      // Remove only the matching branch of :is/:where, preserving other themes.
      const branch=attr.parent;
      if(branch?.type==='selector') {
        const pseudo=branch.parent;
        if(pseudo?.type==='pseudo'&&[':is',':where',':not'].includes(pseudo.value)) {
          branch.remove();
          if(!pseudo.nodes.length) {
            if(pseudo.value===':not') pseudo.remove();
            else { let top=pseudo;while(top.parent&&top.parent.type!=='root')top=top.parent;top.remove(); }
          }
        } else {let top=attr;while(top.parent&&top.parent.type!=='root')top=top.parent;top.remove();}
      }
    });
    if(!selectors.nodes.length) rule.remove();else rule.selector=selectors.toString();
  });
  return root.toString();
}
export function removeTheme(source,theme) {
  if(!Object.hasOwn(palettes,theme)) throw new Error('This theme cannot be deleted');
  const catalog=themeCatalog(source);
  if(!catalog.some(t=>t.value===theme)) return {source,changed:false};
  const ast=parse(source,{ecmaVersion:'latest'}),edits=[];
  const replace=(node,text)=>edits.push({start:node.start,end:node.end,text});
  const slice=n=>source.slice(n.start,n.end);
  function paletteExpression(n) {
    if(n.type!=='ConditionalExpression') return slice(n);
    if(n.test.type==='BinaryExpression'&&n.test.left.name==='selectedTheme'&&n.test.right.value===theme) return paletteExpression(n.alternate);
    return `${slice(n.test)} ? ${slice(n.consequent)} : ${paletteExpression(n.alternate)}`;
  }
  fullAncestor(ast,(n,ancestors)=>{
    if(n.type==='VariableDeclarator') {
      if(n.id.name==='themeOptions')replace(n.init,JSON.stringify(catalog.filter(t=>t.value!==theme),null,2));
      if(n.id.name===palettes[theme])replace(ancestors.at(-2),'');
      if(n.id.name==='palette')replace(n.init,paletteExpression(n.init));
      if(n.id.name==='mastheadBarColors') {const colors=literal(n.init);delete colors[theme];replace(n.init,JSON.stringify(colors,null,2));}
    }
    if(n.type==='TemplateLiteral'&&n.expressions.length===0) {
      const parent=ancestors.at(-2);
      if(parent?.type==='AssignmentExpression'&&slice(parent.left)==='themeStyle.textContent') {
        const css=n.quasis[0].value.cooked;
        if(css.includes('data-xlyneve-color-theme'))replace(n,'`'+pruneCss(css,theme).replace(/`/g,'\\`').replace(/\$\{/g,'\\${')+'`');
      }
    }
  });
  edits.sort((a,b)=>b.start-a.start);
  let end=source.length;
  for(const edit of edits){if(edit.end>end)throw new Error('Overlapping theme edits');source=source.slice(0,edit.start)+edit.text+source.slice(edit.end);end=edit.start;}
  parse(source,{ecmaVersion:'latest'});
  if(themeCatalog(source).some(t=>t.value===theme))throw new Error('Theme removal was incomplete');
  return {source,changed:true};
}
