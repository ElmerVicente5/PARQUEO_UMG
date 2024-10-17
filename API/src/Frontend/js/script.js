document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let telefono=document.getElementById('telefono').value;
    // Validaciones

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert('Por favor ingrese un correo electrónico válido.');
        return;
    }

    if (!password || password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }


    let formData = {
        nombres: nombre,
        apellidos: apellido,
        email: email,
        password: password,
        telefono:telefono
    };

    console.log(formData);

    fetch('http://localhost:8000/api/usuario/registrar', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        if(data.message === 'El correo ya está registrado') {
            alert('El correo ya está registrado, por favor ingrese otro correo.');
            return;
        }else{
            alert('Usuario creado');
            //si no hay errores
            console.log('Success:', data);
            console.log('Usuario creado');

        }
       
        
    })
    .catch((error) => {
        // Manejo del error
        if (error.message === 'El correo ya está registrado') {
            alert('El correo ya está registrado, por favor ingrese otro correo.');
        } else {
            console.error('Error:', error);
            alert('Hubo un problema al registrar el usuario.');
        }
        
        
    });
});
