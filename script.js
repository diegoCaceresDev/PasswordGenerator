//funcion donde generamos la clave con la API
async function generate() {
  let levelSecurity = document.getElementById("levelsecurity").value;

  let api = `https://api.stringgy.com/`
  if (levelSecurity === 'low') api += '?length=8&chars=abc1dfg2'
  if (levelSecurity === 'medium') api += '?length=10'
  if (levelSecurity === 'high') api += '?length=12'

  let response = await fetch(api)
  response = await response.json()

  document.getElementById("password").innerText = 'Your password is: ' + response[0]
  //metodo para copiar la clave al clipboard
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


let btnCheckPassword = document.getElementById("btn_password").addEventListener('click', ()=>{
	const password = document.getElementById("input_password").value;
	const divEstado = document.getElementById("estado");
	const divCriterios = document.getElementById("criterios");
  const listaRecomendaciones = comprobarFortaleza(password);

	isPasswordCompromised(password).then(compromised => {
		if (compromised) {
			divEstado.style.background = 'RGB(255,0,0)';
			divEstado.style.color = 'RGB(255, 255, 255)';
			divEstado.innerText= 'Contraseña comprometida. Esta contraseña está registrada en las base de datos de contraseñas hackeadas. No es segura.'
		} else {
			divEstado.style.background = 'green';
			divEstado.style.color = 'RGB(255, 255, 255)'
			divEstado.innerText= 'La contraseña no ha sido comprometida, su contraseña es segura.';
		}
		if(listaRecomendaciones.length > 0){
			divCriterios.innerHTML = "<ul>" + listaRecomendaciones + "</ul>";
			divCriterios.style.background = '#f0ad4e';
  		}else{
			divCriterios.innerText= 'Felicidades! Tu contraseña es altamente segura. Para asegurarnos de esto, hemos verificado en base de datos de contraseñas hackeadas y tu contraseña no parece estar comprometida. Además, hemos verificado su fortaleza y es altamente segura porque incluye combinaciones de números, letras en mayúsculas y minúsculas, caracteres especiales y su longitud es de ' + password.length + ' caracteres.'
			divEstado.style.background = 'green';
			divEstado.style.color = 'RGB(255, 255, 255)'
      
		}
  	}).catch(error => console.error(error));;
	
});


// Función para obtener el hash SHA-1 de una cadena de texto
async function sha1(message) {
	const msgUint8 = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

// Función para obtener los primeros cinco caracteres de un hash SHA-1
function getHashPrefix(hash) {
  return hash.substr(0, 5);
}

// Función para buscar un hash_suffix en la lista de contraseñas comprometidas
function findHashSuffix(hashList, hashSuffix) {
	for (let i = 0; i < hashList.length; i++) {
		if (hashList[i].startsWith(hashSuffix)) {
			return hashList[i].split(':')[1];
		}
	}
	return null;
}

// Función principal para verificar si una contraseña ha sido comprometida
async function isPasswordCompromised(password) {
	const hash = await sha1(password);
	const hashPrefix = getHashPrefix(hash);
	const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
	const text = await response.text();
	const hashList = text.split('\n');
	const hashSuffix = hash.substr(5).toUpperCase();
	const compromisedHash = findHashSuffix(hashList, hashSuffix);
	return compromisedHash !== null;
}

function comprobarFortaleza(pword){
	let listaCriterios = "";

	// Longitud de la contraseña
	if (password.length <= 8) {
		listaCriterios += "<li>La contraseña debería 9 caractéres como mínimo.</li>";
	}
	
	// Uso de mayúsculas y minúsculas
	if (!(/[a-z]/.test(pword) && /[A-Z]/.test(pword))) {
		listaCriterios += "<li>La contraseña no tiene combinaciones entre mayusculas y minusculas</li>";
	}

	// Uso de números
	if (!/\d/.test(pword)) {
		listaCriterios += "<li>La contraseña no tiene números.</li>";
	}

	// Uso de caracteres especiales
	if (!/[^a-zA-Z0-9]/.test(pword)) {
		listaCriterios += "<li>La contraseña no tiene caractéres especiales.</li>";
	}
	return listaCriterios;
}







