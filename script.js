let mensagens = [];

async function pegarDados() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promessa.then(dadosChegaram);
  console.log(await promessa);
}
pegarDados();

function dadosChegaram(resposta) {
  mensagens = resposta.data;
  renderizarMensagens();
  
}

function renderizarMensagens() {
  const ul = document.querySelector(".mensagens");

  for (let i of mensagens) {
    const li = document.createElement("li");
    li.innerHTML = `
    ${i.time}
    ${i.from} para
    ${i.to} :
    ${i.text}
                `;
    
    if (i.type == "status") li.classList.add("status");
    if (i.type == "message") li.classList.add("message");
    if (i.type == "private_message") li.classList.add("reserved");
    ul.appendChild(li);
    
  }
 
}

renderizarMensagens();

async function postMessage() {
  try {
    const input = document.querySelector(".enviar-mensagem");
    const text = input.value;
    
    const response = await axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      {
        from: "testezimdocria1949",
        to: "Todos",
        text,
        type: "message", // ou "private_message" para o bônus
      }
    );
    pegarDados();
  } catch (e) {
    console.log(e);
  }
}

const sendButton = document.querySelector(".botao-enviar");
sendButton.addEventListener("click", function (e) {
  postMessage();
});

function entrarNaSala() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    {
      name: "testezimdocria1949",
    }
  );
  promise.then((e) => console.log(e));
//   promise.catch((e) => console.log( e));
}
entrarNaSala();

async function manterConexao() {
  await axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
    name: "testezimdocria1949",
  });
}
setInterval(manterConexao, 5000);

function ultimamsg(){
const li = document.querySelector('.li')
var lastChild = li.lastChild
lastChild.scrollIntoView()
}
