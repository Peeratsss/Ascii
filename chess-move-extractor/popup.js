// Handle "Copy" button
document.getElementById('copyMoves').addEventListener('click', () => {
  sendMoveRequest((moves) => {
    navigator.clipboard.writeText(moves).then(() => {
      console.log('✅ Moves copied to clipboard!');
    });
  });
});

// Handle "Download as .pgn" button
document.getElementById('downloadMoves').addEventListener('click', () => {
  sendMoveRequest((moves) => {
    const pgnContent = `[Event "Chess.com Game"]
[Site "Chess.com"]
[Date "${new Date().toISOString().split('T')[0]}"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]

${moves}
*`;

    const blob = new Blob([pgnContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chess_game.pgn';
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Helper to request moves from content script
function sendMoveRequest(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getMoves' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      callback(response.moves);
    });
  });
}
