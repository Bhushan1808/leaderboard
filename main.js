async function loadLeaderboard() {
  const res = await fetch('/.netlify/functions/leaderboard');
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

document.getElementById('load')?.addEventListener('click', loadLeaderboard);

// handle add form submit
document.getElementById('add-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailEl = document.getElementById('email');
  const scoreEl = document.getElementById('score');
  const email = (emailEl.value || '').trim();
  const score = scoreEl.value;

  if (!email) {
    alert('Please provide an email');
    return;
  }
  if (!score) {
    alert('Please provide a score');
    return;
  }

  try {
    const res = await fetch('/.netlify/functions/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, score: Number(score) }),
    });
    const result = await res.json();
    if (res.ok) {
      emailEl.value = '';
      scoreEl.value = '';
      loadLeaderboard();
      alert('Added successfully');
    } else {
      alert('Error: ' + (result.error || JSON.stringify(result)));
    }
  } catch (err) {
    alert('Request failed: ' + err.message);
  }
});

// Auto-load on page open
loadLeaderboard();