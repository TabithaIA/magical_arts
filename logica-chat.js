const firebaseConfig = {
    apiKey: "AIzaSyCAiHt-zBRm0uIAK3Xh3h8-L2jZtqGRRe8",
    authDomain: "magical-diarylife.firebaseapp.com",
    databaseURL: "https://magical-diarylife-default-rtdb.firebaseio.com",
    projectId: "magical-diarylife",
    storageBucket: "magical-diarylife.appspot.com",
    messagingSenderId: "344723190244",
    appId: "1:344723190244:web:e774b902d4b794b7a917f1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.getElementById('btn-enviar').addEventListener('click', () => {
    const usuarioInput = document.getElementById('name');
    const mensajeInput = document.getElementById('msg');

    const usuario = usuarioInput.value.trim() || 'Anónimo';
    const texto = mensajeInput.value.trim();

    if (texto !== '') {
        db.ref('mensajes').push({
            usuario: usuario,
            texto: texto,
            timestamp: Date.now()
        }).then(() => {
            mensajeInput.value = '';
        }).catch((error) => {
            alert("No se pudo enviar el mensaje.");
        });
    }
});

db.ref('mensajes').on('child_added', (snapshot) => {
    const datos = snapshot.val();
    const mensajeKey = snapshot.key;
    const chatBox = document.getElementById('chat-box');

    let horaTrans = "";
    if (datos.timestamp) {
        const fecha = new Date(datos.timestamp);
        horaTrans = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    }

    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.id = "msg-" + mensajeKey;
    nuevoMensaje.innerHTML = `<strong>${escapeHtml(datos.usuario)}:</strong> ${escapeHtml(datos.texto)}
    <button onclick="eliminarMensaje('${mensajeKey}')" style="background: none; border: none; color: red; cursor: pointer; font-size: 10px; margin-left: 8px;" title="Eliminar">X</button>
    `;

    chatBox.appendChild(nuevoMensaje);

    chatBox.scrollTop = chatBox.scrollHeight;
});

db.ref('mensajes').on('child_removed', (snapshot) => {
    const mensajeKey = snapshot.key;
    const elementoeliminar = document.getElementById("msg-" + mensajeKey);

    if (elementoeliminar) {
        elementoeliminar.remove();
    }
});

function eliminarMensaje(key) {
    if (confirm("¿Eliminar mensaje?")) {
        db.ref('mensajes/' + key).remove()
        .then(() => {
            if (elementoDiv) {
                elementoDiv.remove();
            }
        })
        .catch((error) => {
            alert("Error al realizar la acción");
        });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}