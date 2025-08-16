// Map figurines to PGN letters
const figurineMap = {
  'pawn': '',
  'knight': 'N',
  'bishop': 'B',
  'rook': 'R',
  'queen': 'Q',
  'king': 'K',
};

function extractAndFormatMoves() {
  const moveNodes = Array.from(document.querySelectorAll('.node'));

  const moves = moveNodes.map(node => {
    const span = node.querySelector('span[data-figurine], span[class*="icon-font-chess"]');
    let moveText = node.textContent.trim();

    if (span) {
      let pieceLetter = '';

      // Try using data-figurine first
      if (span.hasAttribute('data-figurine')) {
        pieceLetter = span.getAttribute('data-figurine');
      } else {
        // Fallback to using class names like "bishop-white"
        const classes = span.className.split(' ');
        for (let cls of classes) {
          if (figurineMap.hasOwnProperty(cls.replace('-white', '').replace('-black', ''))) {
            pieceLetter = figurineMap[cls.replace('-white', '').replace('-black', '')];
            break;
          }
        }
      }

      // Remove icon text (if any) and add correct PGN letter
      const cleaned = moveText.replace(span.textContent, '').trim();
      return pieceLetter + cleaned;
    }

    return moveText;
  }).filter(text => text.length > 0);

  // Format moves like "1. e4 e5"
  let formatted = '';
  for (let i = 0; i < moves.length; i += 2) {
    const white = moves[i] || '';
    const black = moves[i + 1] || '';
    formatted += `${Math.floor(i / 2) + 1}. ${white} ${black}\n`;
  }

  return formatted.trim();
}

// Handle popup.js message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getMoves') {
    const result = extractAndFormatMoves();
    sendResponse({ moves: result });
  }
});
