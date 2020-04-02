const submit =document.querySelector('#register');

submit.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const email =document.querySelector('#email').value;
    const first_name =document.querySelector('#first_name').value;
    const last_name =document.querySelector('#last_name').value;
    const password =document.querySelector("#password").value;

const data={
    email,
    first_name,
    last_name,
    password
};
    const response =await fetch('/register', {
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
  if(resJSON.msg==='error'){
    return window.location.href='/error';
  }
  if(resJSON.msg==='profile'){
    return window.location.href='/profile';
  }
  
});
