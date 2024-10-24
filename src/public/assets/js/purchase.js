let id
let user
let email
let purchaseStatus

document.addEventListener('DOMContentLoaded', () => {
    const spinner = document.getElementById('loadingContainer')

    setTimeout(() => { //AGARRAMOS EL ELEMENTO CON ID 'carritoId'
        spinner.classList.add("d-none")
        id = document.getElementById('purchase').getAttribute('cid')
        user = document.getElementById('purchase').getAttribute('user')
        email = document.getElementById('purchase').getAttribute('email')
        purchaseStatus = document.getElementById('purchase').getAttribute('status')
        
        if(purchaseStatus == 'success'){
            Swal.fire({
                text: `DETALLES DE LA COMPRA ENVIADOS A ${email}`,
                title: `GRACIAS POR TU COMPRA ${user.toUpperCase()}`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ACEPTAR',
                allowOutsideClick: false,
                background: '#e3f2fd',
                iconColor: '#4caf50',
                padding: '20px',
                icon: 'success',
                
                customClass: {
                    popup: 'swalSuccess',
                    title: 'swalTitleSuccess',
                    content: 'swalContentSuccess',
                    confirmButton: 'swalConfirmButtonSuccess'
                }
            }).then((res) => {
                if(res.isConfirmed){
                    window.location.href = `/carts/${id}`
                }
            })
        }else{
            Swal.fire({ //SI FALTA LLENAR ALGUN CAMPO MOSTRAMOS UNA ALERTA
                text: 'ACTUALMENTE NO HAY STOCK DE LO QUE DESEA COMPRAR',
                confirmButtonText: 'ACEPTAR',
                confirmButtonColor: '#d33',
                allowOutsideClick: false,
                title: '¡LO SENTIMOS!',
                background: '#fff3f3',
                iconColor: '#f27474',
                padding: '20px',
                icon: 'error',

                customClass: {
                    popup: 'swal',
                    title: 'swalTitle',
                    content: 'swalContent',
                    confirmButton: 'swalConfirmButton'
                }
            }).then((res) => {
                if(res.isConfirmed){
                    window.location.href = `/carts/${id}`
                }
            })
        }
    }, 3000)
})