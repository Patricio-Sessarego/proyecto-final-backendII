const btnEntrar = document.getElementById('submit')

btnEntrar.addEventListener("click" , () => {
    let email = document.getElementById("inputEmail").value
    let password = document.getElementById("inputPassword").value

    let obj = { email , password }

    fetch("/login" , {
        method: "POST",
        body: JSON.stringify(obj),

        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(res => {
        if(res.status === 400){
            Swal.fire({
                text: 'CREDENCIALES INVALIDAS',
                confirmButtonText: 'ACEPTAR',
                confirmButtonColor: '#d33',
                background: '#fff3f3',
                iconColor: '#f27474',
                title: '¡ATENCIÓN!',
                padding: '20px',
                icon: 'error',
                customClass: {
                    title: 'swalTitle',
                    content: 'swalContent',
                    confirmButton: 'swalConfirmButton'
                }
            })

            document.getElementById("inputEmail").value = ''
            document.getElementById("inputPassword").value = ''
            return Promise.reject(new Error('CREDENCIALES INVALIDAS'))
        }else if(res.status == 200){
            return res.json()
        }
    })
    .then(data => {
        if(data.role === "user"){
            window.location.href = '/'
        }else{
            window.location.href = '/realTimeProducts'
        }
    })
    .catch(error => {
        console.error(error)
    })
})