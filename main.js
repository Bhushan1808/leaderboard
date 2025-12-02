document.getElementById('load')?.addEventListener('click', async () => {
  const res = await fetch('/.netlify/functions/guests');
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
});