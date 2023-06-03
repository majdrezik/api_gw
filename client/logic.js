
// npm install ajax

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

// base64
const token = 'QmVhcmVyIGV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowYVcxbElqb2lVMkYwSUVwMWJpQXdNeUF5TURJeklERXlPakV6T2pNMklFZE5WQ3N3TXpBd0lDaEpjM0poWld3Z1JHRjViR2xuYUhRZ1ZHbHRaU2tpTENKMWMyVnlTV1FpT2pFeUxDSnBZWFFpT2pFMk9EVTNPRE0yTVRaOS5XMDh6WTIzWXBaZmpZcG1hOW5qc3otQ2V5ZF9DX1ozLVRMLUQwZC03ZktZ'

var isLoggedIn = false



const login = () => {
  // var data = JSON.parse(JSON.stringify(credentials))
  return $.ajax({
    url: "http://localhost:3000/login/tryLogin",
    type: "GET",
    async: false,
    mode: "cors",
    contentType: "application/json;",
    headers: { "authorization": "bWFqZDpwYXNzd29yZA==" },
    // data: {
    //   username: username,
    //   password: password
    // },
    success: function (response) {
      console.log("POST request is done")
      console.log('redirecting to: ' + response.redirect_path)
      if (response.redirect_path === '/')
        alert("Wrong credentials")
    }
  })
}
const catalog = () => {

}

const discount = () => {

}

const order = () => {

}