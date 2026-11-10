# Home card pins

Use **Pin to Home** in a saved note's actions, or the pin icon on a search result. The actual card appears as a floating Home widget. Drag its top grip, resize from the lower-right corner, open the original with the arrow, or unpin with ×. Arrow keys also move/resize the focused controls.

Pins sync through the existing private CEP Firestore project in `homePinnedCards`. Existing owner-only rules cover the collection; no new backend function is required. Each pin stores its source reference and a saved preview. Home listens for changes to the pinned source documents; secondary Clinical Notes/ChatGPTX projects use their existing sign-in sessions and fall back to the saved preview if signed out. Confirmed deleted notes show an unavailable message instead of a stale copy.

Card positions and sizes stay in local storage, separately for narrow and wide layouts. Moving/resizing does not write to Firebase. Source pages only load the pin store when a pin action is used; Home subscribes to the pin collection and the individual pinned source documents. Search typing does not query the pin store.

Unpinning deletes only the pin metadata, never the original note. Search pins retain original record content instead of preview font fitting/search highlights. The shared source-card renderer provides theme styling, rich text, media and definition interactions.
