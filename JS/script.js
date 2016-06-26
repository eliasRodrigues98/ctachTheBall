// Variavéis globais,
var canvas, ctx, LARGURA, ALTURA, estadoAtual, recordBall, 
tempo = 10,

teclas = {},

estados = {
	jogar: 0,
	jogando: 1,
	perdeu: 2
},

player = {
	x: 325,
	y: 350,
	largura: 50,
	altura: 50,
	velocidade: 8,
	score: 0,
	cor: "#FFFFFF",

	desenha: function() {
		ctx.fillStyle = this.cor;
		ctx.fillRect(this.x, this.y, this.largura, this.altura);
	},

	mover: function() {
		if (38 in teclas && player.y > 0) {
			player.y -= player.velocidade; 		
		} else if (40 in teclas && player.y + player.altura + 5 <= ALTURA) {
			player.y += player.velocidade;
		}

		if (37 in teclas && player.x - 3 > 0) {
			player.x -= player.velocidade;
		} else if (39 in teclas && player.x + player.largura + 5 <= LARGURA) {
			player.x += player.velocidade;
		}
	},

	reset: function() {
		if (this.score > recordBall) {
			localStorage.setItem("recordBall", this.score);
			recordBall = this.score;
		}
		this.score = 0;
		tempo = 10;
	}
},

bolas = {
	x: Math.random() * 550,
	y: Math.random() * 550,
	largura: 10,
	altura: 10,
	cor: "#FFFFFF",

	atualiza: function() {
		if ((player.x <= bolas.x + 5 && player.x + player.largura > bolas.x) && 
			(player.y <= bolas.y + 5 && player.y + player.altura > bolas.y)) {
			this.x = Math.random() * 550;
			this.y = Math.random() * 550;
			this.cor = '#'+Math.floor(Math.random()*16777215).toString(16);
			player.score++;
		}
	},

	desenha: function() {
		ctx.fillStyle = this.cor;
		ctx.fillRect(this.x, this.y, this.largura, this.altura);
	}
};

// função para pegar os cliques do mouse,
function clique(event) {
	if (estadoAtual == estados.jogar) {
		estadoAtual = estados.jogando;
	} else if (estadoAtual == estados.perdeu) {
		player.reset();
		estadoAtual = estados.jogar;
	}
}

// evento de leitura para receber os valores apertados
// no teclado,
document.addEventListener("keydown", function(e) {
	teclas[e.keyCode] = true; 
}, false);

document.addEventListener("keyup", function(e) {
	delete teclas[e.keyCode];
}, false);

function tempoJogo() {
	if (tempo >= 0) {
		tempo -= 0.01; 
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "50px Arial";
		ctx.fillText(parseInt(tempo*1), 350, 350);
		setTimeout("tempo", 1000);

		if (tempo <= 0) {
			estadoAtual = estados.perdeu;
		}
	}
}

// função principal, onde todos os eventos irão se encontrar,
function main() {
	// resgata os valores da tela do usuário,
	LARGURA = window.innerWidth;
	ALTURA = window.innerHeight;
	// inseri os valores de altura e largura nas variavéis
	// de acordo com a condição,
	if (LARGURA >= 500) {
		LARGURA = 700;
		ALTURA = 600;
	}
	// cria o elemento canvas e o inseri na variavél,
	canvas = document.createElement("canvas");
	canvas.width = LARGURA;
	canvas.height = ALTURA;
	canvas.style.border = "20px #FF0000 solid"; 
	// a variavél ctx recebe o contexto 2D,
	ctx = canvas.getContext("2d");
	// desenha a canvas no corpo do html,
	document.body.appendChild(canvas);
	// adiciona o evento de leitura do clique do mouse e
	// quando isso ocorrer chama a função clique,
	document.addEventListener("mousedown", clique);

	estadoAtual = estados.jogar;

	recordBall = localStorage.getItem("recordBall");

	if (recordBall == null) {
		recordBall = 0;
	} 

	roda();
}

// função para atualizar frequentemente os eventos,
function atualizar() {
	if (estadoAtual == estados.jogando) {
		player.mover();
		bolas.atualiza();
	}
	
}

// função para rodar os desenhos,
function roda() {
	atualizar();
	desenha();
	if (estadoAtual == estados.jogando) {
		tempoJogo();
	}

	window.requestAnimationFrame(roda);
}

// função para desenhar todos os objetos na tela,
function desenha() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, LARGURA, ALTURA);

	if (estadoAtual == estados.jogar) {
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "50px Arial";
		ctx.fillText("Click to play!", LARGURA / 2 - 150, ALTURA / 2);
	} else if (estadoAtual == estados.jogando) {
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "50px Arial";
		ctx.fillText(player.score, LARGURA / 2 - 20, 50);
		bolas.desenha();
		player.desenha();
	} else {
		ctx.fillStyle = "#FF0000";
		ctx.font = "100px Arial";
		ctx.fillText("Game Over", LARGURA / 2 - 250, ALTURA / 2 - 100);	
		ctx.font = "50px Arial";
		if (player.score > recordBall) {
			ctx.fillStyle = "#FF00FF";
			ctx.fillText("New Record: " + player.score, LARGURA / 2 - 160, ALTURA / 2);
		} else {
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("Your score: " + player.score, LARGURA / 2 - 150, ALTURA / 2);
			ctx.fillStyle = "#00FF00";
			ctx.fillText("Record: " + recordBall, LARGURA / 2 - 110, ALTURA / 2 + 100);
		}	
		ctx.fillStyle = "#00FFFF";
		ctx.fillText("Play Again? Click!", LARGURA / 2 - 200, ALTURA / 2 + 200);
	}		
}

// chama a função principal e roda o jogo,
main();