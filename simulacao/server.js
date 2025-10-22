import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// === Config ===
const TOKEN = "687eeeae24e56030ffe2aeef838d1f0e";

// === Diretórios ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

// === Rota inicial ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// === Rota de simulação (compatível com o front) ===
app.post("/api/checkout", async (req, res) => {
  const { cpf, valor, parcelas } = req.body;

  if (!cpf || !valor || !parcelas) {
    return res.status(400).json({ error: "Dados incompletos. Envie CPF, valor e parcelas." });
  }

  try {
    // Chamada à API externa (consulta CPF)
    const url = `https://apela-api.tech/?user=${TOKEN}&cpf=${cpf}`;
    const response = await fetch(url);
    const data = await response.json();

    // Simulação de resultado (mock de resposta)
    const resultado = {
      status: data.status || "Aprovado",
      id: data.id || Math.floor(Math.random() * 1000000),
      nome: data.nome || "Cliente Verificado",
      valorSolicitado: valor,
      parcelas,
      analise: "Simulação concluída com sucesso"
    };

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao consultar API externa:", error.message);
    res.status(500).json({
      error: "Falha ao consultar API externa",
      details: error.message
    });
  }
});

// === Servir front-end ===
app.use(express.static("."));

// === Inicialização ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 MP PIX backend rodando na porta ${PORT}`)
);
