/* --- */ 
if(location.href==='http://localhost:4000/dashboard'){
    const displayed =document.getElementById('displayed');
    const hidden =document.querySelector('.not-visible');
    const change =document.querySelector('#displayed > button');
    const dashMsge =document.querySelector('.pass-match');

    setTimeout(() =>{
        dashMsge.classList.add('not-visible');
    }, 1500);
    
    change.onclick =(e) =>{
        displayed.classList.add('not-visible');
        hidden.classList.remove('not-visible');
    }
}

