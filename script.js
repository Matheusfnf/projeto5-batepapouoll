let mensagens = [];

const nome = prompt("Qual seu nome?");
if (!nome) window.location.reload();

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

  let child = ul.lastElementChild;
  while (child) {
    ul.removeChild(child);
    child = ul.lastElementChild;
  }

  mensagens.map((i) => {    
    const li = document.createElement("li");

    if (i.type == "status") {
      li.classList.add("status");
      li.innerHTML = `
      <span> (${i.time}) </span>
      <strong>${i.from}</strong> ${i.text}
                  `;
    }

    if (i.type == "message") {
      li.classList.add("message");
      li.innerHTML = `
      <span> (${i.time}) </span>
      <strong>${i.from}</strong> para
      ${i.to} :
      ${i.text}
                  `;
    }

    if (i.type == "private_message") {
      if (i.to == nome) {
        li.classList.add("reserved");
        li.innerHTML = `
        <span> (${i.time}) </span>
        <strong>${i.from}</strong> reservadamente para
        <strong>${i.to} </strong>:
        ${i.text}
                    `;
      }
    }
    ul.appendChild(li);
  });
}

renderizarMensagens();

async function postMessage() {
  try {
    const input = document.querySelector(".enviar-mensagem");
    const text = input.value;
    input.value = "";
    
    console.log("cliquei");
    const response = await axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",

      {
        from: nome,
        to: "Todos",
        text,
        type: "message",
      }
    );
    pegarDados();

  } catch (e) {
    deuErro(e);
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
      name: nome,
    }
  );
  promise.then((e) => console.log(e));
  promise.catch((e) => deuErro(e));
}
entrarNaSala();

async function manterConexao() {
  await axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
    name: nome,
  });

  pegarDados();
  ultimamsg();
}
setInterval(manterConexao, 3000);

function ultimamsg() {
  const li = document.querySelector("ul");
  let lastChild = li.lastChild;
  lastChild.scrollIntoView({ behavior: "smooth" });
}

function deuErro(erro) {
  if (erro.response.status === 400) {
    alert("Nome já existente!");
    window.location.reload();
  }
}
