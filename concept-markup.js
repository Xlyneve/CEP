(function () {
  'use strict';
  if (window.CEPConceptMarkup) return;
  const excluded = 'a,button,script,style,textarea,input,select';
  const blocks = 'p,div,li,td,th,h1,h2,h3,h4,h5,h6,pre,blockquote';
  window.CEPConceptMarkup = {
    linkify(root, createLink) {
      const groups = []; let nodes = [], block = null;
      const flush = () => { if (nodes.length) groups.push(nodes); nodes = []; block = null; };
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeType === 1) {
          if (node.matches('br,img,hr') || node.matches(excluded)) flush();
          continue;
        }
        if (node.parentElement.closest(excluded)) { flush(); continue; }
        const currentBlock = node.parentElement.closest(blocks) || root;
        if (block && currentBlock !== block) flush();
        block = currentBlock; nodes.push(node);
      }
      flush();
      groups.forEach(group => {
        const text = group.map(node => node.nodeValue).join('');
        const matches = [...text.matchAll(/\[\[([^\]\[]+?)\]\]/g)];
        const point = offset => {
          for (const node of group) {
            if (offset <= node.nodeValue.length) return [node, offset];
            offset -= node.nodeValue.length;
          }
        };
        matches.reverse().forEach(match => {
          const concept = match[1].trim(); if (!concept) return;
          const start = point(match.index), end = point(match.index + match[0].length);
          if (!start || !end) return;
          const range = document.createRange(); range.setStart(...start); range.setEnd(...end);
          const content = range.extractContents();
          const inner = []; const textWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
          while (textWalker.nextNode()) inner.push(textWalker.currentNode);
          let remaining = 2;
          for (const node of inner) {
            const amount = Math.min(remaining, node.nodeValue.length);
            node.nodeValue = node.nodeValue.slice(amount); remaining -= amount;
            if (!remaining) break;
          }
          remaining = 2;
          for (const node of [...inner].reverse()) {
            const amount = Math.min(remaining, node.nodeValue.length);
            node.nodeValue = node.nodeValue.slice(0, node.nodeValue.length - amount); remaining -= amount;
            if (!remaining) break;
          }
          range.insertNode(createLink(concept, content));
        });
      });
      return root;
    }
  };
})();
