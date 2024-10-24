const socket = io()

function eventAddToCart(productId , cartId){
    Swal.fire({
        text: 'PRODUCTO AGREGADO AL CARRITO',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ACEPTAR',
        background: '#e3f2fd',
        iconColor: '#4caf50',
        title: '¡EXITO!',
        padding: '20px',
        icon: 'success',

        customClass: {
            title: 'swalTitleSuccess',
            content: 'swalContentSuccess',
            confirmButton: 'swalConfirmButtonSuccess'
        }
    })

    socket.emit('productAddedToCart' , productId , cartId)
}