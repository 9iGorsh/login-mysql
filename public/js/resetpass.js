const submit =document.querySelector('#resetpass');
const err =document.querySelector('.pass-match');
const email =document.querySelector('.emailForPass').textContent;

submit.addEventListener('submit', async(e) =>{
    e.preventDefault();
    const password1 =document.querySelector("#password1").value;
    const password2 =document.querySelector("#password2").value;

    if(password1!==password2){
        err.classList.add('pass-match--visible');
        return setTimeout(() =>{
          err.classList.remove('pass-match--visible');
        }, 1500);          
    }
        const data={
            password:password1,
            email
        }; 
        console.log('Reset form data ' ,data)     

    const response =await fetch('/resetpass', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  const resJSON =await response.json(); // parses JSON response into native JavaScript objects
  // return console.log('resJSON:',resJSON);
  if(resJSON.page==='error'){
    return window.location.href='/error';
  }
  if(resJSON.page==='profile'){
    console.log('res.json with profile received')
    return window.location.href='/profile';
  }
});
