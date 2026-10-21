// Layout and structure only. No database reads or writes.
const MIN_WIDTH = 72;
const NEW_WIDTH = 120;
const states = new WeakMap();
const tableSelector = ':is(.cep-pn-editor,[contenteditable="true"],.note-card,.note-tile,.chatBubble,.cep-source-surface,.cep-source-chat,.cep-source-text,.note-content,.note-text,.vaccine-card-notes,.zoom-card-notes) table';

function gridFor(table) {
  const rows = [...table.rows], grid = [], positions = new Map();
  rows.forEach((row, r) => {
    grid[r] ||= [];
    let c = 0;
    for (const cell of row.cells) {
      while (grid[r][c]) c++;
      const span = cell.colSpan || 1, down = Math.min(cell.rowSpan || rows.length-r, rows.length-r);
      positions.set(cell,{row:r,column:c,span,down});
      for (let y=r;y<r+down;y++) {
        grid[y] ||= [];
        for (let x=c;x<c+span;x++) grid[y][x] = cell;
      }
      c += span;
    }
  });
  return {rows,grid,positions,count:Math.max(0,...grid.map(row=>row.length))};
}
function setStyle(node,name,value) {
  if (node.style.getPropertyValue(name)!==value || node.style.getPropertyPriority(name)!=='important') node.style.setProperty(name,value,'important');
}
function pixelWidth(node) {
  const value = node.style.width;
  return /^\d+(?:\.\d+)?px$/.test(value) ? parseFloat(value) : 0;
}
function initialWidths(table,grid) {
  const cols = [...table.querySelectorAll(':scope > colgroup > col')];
  const widths = Array(grid.count).fill(0);
  if (cols.length===grid.count && cols.every(col=>pixelWidth(col)>0)) return cols.map(col=>Math.max(MIN_WIDTH,pixelWidth(col)));
  // Unmerged cells identify individual widths more accurately than a spanning header.
  for (const [cell,pos] of grid.positions) if(pos.span===1) widths[pos.column]=Math.max(widths[pos.column],pixelWidth(cell) || cell.getBoundingClientRect().width);
  for (const [cell,pos] of grid.positions) if(pos.span>1) {
    const missing=[];let known=0;
    for(let c=pos.column;c<pos.column+pos.span;c++) { if(widths[c])known+=widths[c];else missing.push(c); }
    const remaining=(pixelWidth(cell) || cell.getBoundingClientRect().width)-known;
    for(const column of missing)widths[column]=Math.max(MIN_WIDTH,remaining/missing.length || NEW_WIDTH);
  }
  return widths.map(width=>Math.max(MIN_WIDTH,Math.round(width || NEW_WIDTH)));
}
export function normalizeNoteTable(table, widths) {
  const grid = gridFor(table);
  if (!grid.count) return null;
  const old = states.get(table);
  widths = widths || (old?.widths.length===grid.count ? old.widths : initialWidths(table,grid));
  widths = widths.map(width=>Math.max(MIN_WIDTH,Math.round(width)));
  let group = [...table.children].find(node=>node.tagName==='COLGROUP');
  if (!group) { group=document.createElement('colgroup'); table.insertBefore(group,table.tHead || table.tBodies[0] || table.firstChild); }
  for (const other of [...table.children].filter(node=>node.tagName==='COLGROUP' && node!==group)) other.remove();
  while (group.children.length>widths.length) group.lastElementChild.remove();
  while (group.children.length<widths.length) group.append(document.createElement('col'));
  widths.forEach((width,index)=>setStyle(group.children[index],'width',width+'px'));
  for (const [cell,pos] of grid.positions) {
    const width = widths.slice(pos.column,pos.column+pos.span).reduce((a,b)=>a+b,0);
    setStyle(cell,'width',width+'px'); setStyle(cell,'min-width',width+'px');
    setStyle(cell,'box-sizing','border-box');
  }
  const total = widths.reduce((a,b)=>a+b,0);
  setStyle(table,'display','table'); setStyle(table,'table-layout','fixed');
  setStyle(table,'width',total+'px'); setStyle(table,'min-width',total+'px'); setStyle(table,'max-width','none');
  const host = table.parentElement?.closest('.cep-pn-editor,[contenteditable="true"],.note-content,.note-text,.note-display,.vaccine-card-notes,.zoom-card-notes,.note-card,.note-tile,.chatBubble,.cep-source-text,.cep-source-content,.cep-source-surface,.cep-source-chat');
  host?.classList.add('cep-note-table-host');
  const state = {...grid,widths}; states.set(table,state); return state;
}
export function noteTableColumn(cell) {
  const table=cell.closest('table');
  return table ? gridFor(table).positions.get(cell)?.column : undefined;
}
export function resizeNoteTableColumn(table,index,width) {
  const state=normalizeNoteTable(table); if(!state || index==null || index>=state.widths.length)return;
  const widths=[...state.widths]; widths[index]=Math.max(MIN_WIDTH,width); normalizeNoteTable(table,widths);
}
function emptyCell(tag) { const cell=document.createElement(tag); cell.innerHTML='<br>'; return cell; }
function focusCell(cell) {
  if (!cell?.isContentEditable) return;
  const target=cell.querySelector('[contenteditable="true"]') || cell;
  const editor=target.closest('[contenteditable="true"]');
  editor?.focus({preventScroll:true});
  const range=document.createRange();range.selectNodeContents(target);range.collapse(true);
  const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
  const host=cell.closest('table')?.parentElement?.closest('.cep-note-table-host');
  if(host) {
    const bounds=cell.getBoundingClientRect(),view=host.getBoundingClientRect();
    if(bounds.right>view.right)host.scrollLeft+=bounds.right-view.right+8;
    else if(bounds.left<view.left)host.scrollLeft-=view.left-bounds.left+8;
  }
}
export function addNoteTableColumn(table,afterCell=null,makeCell=emptyCell) {
  const state=normalizeNoteTable(table); if(!state)return;
  const pos=state.positions.get(afterCell);
  const index=pos ? pos.column+pos.span : state.count;
  const expanded=new Set();
  let focus;
  state.rows.forEach((row,r)=>{
    const crossing=state.grid[r]?.[index]; const at=state.positions.get(crossing);
    if(at && at.column<index) { if(!expanded.has(crossing)){crossing.colSpan++;expanded.add(crossing);}return; }
    const tag=row.closest('thead') || (row.cells.length && [...row.cells].every(cell=>cell.tagName==='TH')) ? 'th' : 'td';
    const before=[...row.cells].find(cell=>state.positions.get(cell).column>=index);
    const created=makeCell(tag);row.insertBefore(created,before || null);
    if(!focus || r===pos?.row)focus=created;
  });
  const widths=[...state.widths]; widths.splice(index,0,NEW_WIDTH); normalizeNoteTable(table,widths);
  focusCell(focus);
}
export function removeNoteTableColumn(table,cell) {
  const state=normalizeNoteTable(table); if(!state || state.count<=1)return false;
  const index=state.positions.get(cell)?.column; if(index==null)return false;
  for(const target of new Set(state.grid.map(row=>row[index]).filter(Boolean))) {
    if(target.colSpan>1)target.colSpan--;else target.remove();
  }
  const row=state.positions.get(cell)?.row || 0;
  const widths=[...state.widths];widths.splice(index,1);const next=normalizeNoteTable(table,widths);
  focusCell(next?.grid[row]?.[Math.min(index,widths.length-1)]);return true;
}
export function addNoteTableRow(table,cell,makeCell=emptyCell) {
  const state=normalizeNoteTable(table);const pos=state?.positions.get(cell);if(!pos)return;
  const index=pos.row+1, covered=new Set(), expanded=new Set();
  for(let c=0;c<state.count;c++) {
    const target=state.grid[pos.row][c], at=state.positions.get(target);
    if(at && at.row+at.down>index) { covered.add(c);if(!expanded.has(target)){target.rowSpan=at.down+1;expanded.add(target);} }
  }
  const row=document.createElement('tr');
  for(let c=0;c<state.count;c++) if(!covered.has(c))row.append(makeCell(cell.parentElement.closest('thead')?'th':'td'));
  cell.parentElement.after(row);normalizeNoteTable(table,state.widths);
  focusCell(row.cells[0]);
}
export function removeNoteTableRow(table,cell) {
  const state=normalizeNoteTable(table);const pos=state?.positions.get(cell);if(!pos || state.rows.length<=1)return false;
  const index=pos.row,next=state.rows[index+1];
  for(const [target,at] of state.positions) {
    if(at.row<index && at.row+at.down>index)target.rowSpan=at.down-1;
    else if(at.row===index && at.down>1 && next) {
      target.rowSpan=at.down-1;
      const before=[...next.cells].find(other=>state.positions.get(other).column>at.column);
      next.insertBefore(target,before || null);
    }
  }
  state.rows[index].remove();const remaining=normalizeNoteTable(table,state.widths);
  focusCell(remaining?.grid[Math.min(index,remaining.rows.length-1)]?.[pos.column]);return true;
}

const style=document.createElement('style');style.id='cep-note-table-layout';
style.textContent=`
 html:root:root:root:root:root:root:root body .cep-note-table-host { min-width:0 !important; max-width:100% !important; overflow-x:auto !important; box-sizing:border-box !important; }
 html:root:root:root:root:root:root:root body .cep-note-table-host table { overflow:visible !important; }
 html:root:root:root:root:root:root:root body .cep-note-table-host table :is(td,th) { white-space:normal !important; overflow-wrap:anywhere !important; word-break:normal !important; }
`;
document.head.append(style);
function scan(root) {
  const tables=new Set(root.querySelectorAll?.(tableSelector) || []);
  if(root.matches?.(tableSelector))tables.add(root);
  const owner=root.closest?.(tableSelector);if(owner)tables.add(owner);
  tables.forEach(table=>normalizeNoteTable(table));
}
function start(){scan(document);new MutationObserver(records=>{
 const roots=new Set();for(const record of records){if(record.target instanceof Element && record.target.closest('table'))roots.add(record.target);for(const node of record.addedNodes)if(node.nodeType===1)roots.add(node);}
 roots.forEach(scan);
}).observe(document.body,{subtree:true,childList:true});}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
