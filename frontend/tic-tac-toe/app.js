// Tic‑Tac‑Toe game module – no globals thanks to ES6 module scope
const Game = (() => {
  const boardEl = document.getElementById('board');
  const cells = boardEl.querySelectorAll('.cell');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset');

  let board = Array(9).fill(null);
  let current = 'X';
  let moves = 0;
  let active = true;

  const winLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const setStatus = (msg, color) => {
    statusEl.textContent = msg;
    statusEl.style.color = color || 'inherit';
  };

  const updateCell = (i) => {
    const cell = cells[i];
    cell.textContent = board[i];
    cell.disabled = true;
    cell.setAttribute('aria-label', `${board[i]}, row ${Math.floor(i/3)+1} column ${(i%3)+1}`);
  };

  const checkWin = () => {
    for (const line of winLines) {
      const [a,b,c] = line;
      if (board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
    }
    return null;
  };

  const checkDraw = () => moves===9;

  const endGame = (msg, color) => {
    active = false;
    setStatus(msg, color);
  };

  const makeMove = (index) => {
    if (!active || board[index]) return;
    board[index] = current;
    moves++;
    updateCell(index);

    const winner = checkWin();
    if (winner) {
      endGame(`Player ${winner} wins!`, winner==='X'? 'var(--accent-x)' : 'var(--accent-o)');
      return;
    }
    if (checkDraw()) {
      endGame('Draw!','gray');
      return;
    }
    // toggle turn
    current = current==='X' ? 'O' : 'X';
    setStatus(`Turn: ${current}`, current==='X'? 'var(--accent-x)' : 'var(--accent-o)');
  };

  const handleClick = (e) => {
    const btn = e.target.closest('.cell');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    makeMove(idx);
  };

  const handleKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const btn = e.target.closest('.cell');
    if (!btn) return;
    e.preventDefault();
    const idx = Number(btn.dataset.index);
    makeMove(idx);
  };

  const resetGame = () => {
    board = Array(9).fill(null);
    moves = 0;
    active = true;
    current = 'X';
    cells.forEach(c => {
      c.textContent = '';
      c.disabled = false;
      c.setAttribute('aria-label','empty');
    });
    setStatus('Turn: X', 'var(--accent-x)');
    cells[0].focus();
  };

  const init = () => {
    boardEl.addEventListener('click', handleClick);
    boardEl.addEventListener('keydown', handleKey);
    resetBtn.addEventListener('click', resetGame);
    resetGame(); // initial UI
  };

  return { init };
})();

Game.init();