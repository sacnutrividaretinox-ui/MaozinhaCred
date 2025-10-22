import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// === Config ===
const TOKEN = "687eeeae24e56030ffe2aeef838d1f0e";

// === Rota inicial ===
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// === Rota de proxy CPF ===
app.get("/api/cpf", async (req, res) => {
  const cpf = req.query.cpf?.replace(/\D/g, "");

  if (!cpf || cpf.length !== 11) {
    return res.status(400).json({ error: "CPF inválido. Use 11 dígitos numéricos." });
  }

  try {
    const url = `https://apela-api.tech/?user=${TOKEN}&cpf=${cpf}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro ao consultar API:", error.message);
    res.status(500).json({ error: "Falha ao consultar API externa", details: error.message });
  }
});

// === Servir o front-end (index.html e assets) ===
app.use(express.static("."));

// === Iniciar servidor ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
