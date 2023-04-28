
async function generate() {
  let levelSecurity = document.getElementById("levelsecurity").value;

  let api = `https://api.stringgy.com/`
  if (levelSecurity === 'low') api += '?length=8&chars=abc1dfg2'
  if (levelSecurity === 'medium') api += '?length=10'
  if (levelSecurity === 'high') api += '?length=12'

  let response = await fetch(api)
  response = await response.json()

  document.getElementById("password").innerText = 'Your password is: ' + response[0]
  try {
  
    await navigator.clipboard.writeText(response[0]);
    document.getElementById("messageClipboard").innerText = 'Copied in clipboard!'
  } catch (error) {
    console.log(error);
    document.getElementById("messageClipboard").innerText = 'cannot copy in clipboard'

  }

}

document.getElementById('generate').addEventListener('click', (event) => {
  generate()
})









