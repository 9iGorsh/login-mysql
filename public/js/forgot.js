const submit =document.querySelector('#forgot');

submit.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const email =document.querySelector('#email').value;

const data={
    email
};
    const response =await fetch('/forgot', {
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
    return window.location.href='/profile';
  }
  
});
