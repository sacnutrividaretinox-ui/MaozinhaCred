import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// === Configurações ===
const TOKEN = "687eeeae24e56030ffe2aeef838d1f0e";
const PORT = process.env.PORT || 3000;

// === Caminho do diretório atual ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Servir arquivos estáticos (HTML, CSS, JS, imagens etc.) ===
app.use(express.static(__dirname));

// === Rota inicial ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// === Rota de simulação de crédito ===
app.post("/api/checkout", async (req, res) => {
  const { cpf, valor, parcelas } = req.body;

  if (!cpf || !valor) {
    return res.status(400).json({
      error: "Descrição e valor são obrigatórios."
    });
  }

  try {
    const url = `https://apela-api.tech/?user=${TOKEN}&cpf=${cpf}&valor=${valor}&parcelas=${parcelas || 1}`;
    console.log(`📡 Consultando API externa: ${url}`);

    const response = await fetch(url);
    const data = await response.json();

    // Se a API retornar erro
    if (data.error) {
      console.warn("⚠️ Erro retornado pela API externa:", data.error);
      return res.status(400).json({ error: data.error });
    }

    // Sucesso
    console.log("✅ Consulta concluída com sucesso!");
    res.json({
      status: data.status || "Aprovado",
      nome: data.nome || "Cliente",
      valorSolicitado: valor,
      parcelas: parcelas,
      analise: data.mensagem || "Crédito analisado com sucesso!",
      retornoOriginal: data
    });
  } catch (error) {
    console.error("❌ Erro ao consultar API:", error.message);
    res.status(500).json({
      error: "Falha ao consultar API externa",
      detalhes: error.message
    });
  }
});

// === Inicialização do servidor ===
app.listen(PORT, () => {
  console.log("===================================");
  console.log("🔥 Mãozinha Cred Backend Ativo!");
  console.log(`🚀 Rodando em http://localhost:${PORT}`);
  console.log("===================================");
});
