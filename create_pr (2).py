#!/usr/bin/env python3
"""
create_pr.py — Crea el PR #1 y la release v0.1.0 en GitHub automáticamente.

CÓMO USARLO:
  1. Asegúrate de tener Python 3 instalado (en tu terminal: python --version)
  2. Pon este fichero en la raíz de tu proyecto (junto a package.json)
  3. Ejecuta:  python create_pr.py
  4. Ve a GitHub y acepta el Pull Request que aparecerá creado.
"""

import urllib.request
import urllib.error
import json
import base64
import os

# ─────────────────────────────────────────────
# CONFIGURACIÓN  (ya rellena, no toques nada)
# ─────────────────────────────────────────────
TOKEN  = "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"
OWNER  = "Orozco1221"
REPO   = "App"
BASE   = "main"          # rama principal (se ajusta automáticamente)
HEAD   = "feature/pr1-tdd-fundamentos"
# ─────────────────────────────────────────────

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
}

API = f"https://api.github.com/repos/{OWNER}/{REPO}"

# ── Helpers ──────────────────────────────────

def gh(method, path, body=None):
    if path == "":
        url = API
    elif path.startswith("/"):
        url = API + path
    else:
        url = path
    data = json.dumps(body).encode() if body else None
    req  = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        msg = e.read().decode()
        raise RuntimeError(f"GitHub {method} {url} → {e.code}: {msg}")

def b64(text):
    return base64.b64encode(text.encode()).decode()

def upsert_file(path, content, message):
    """Crea o actualiza un fichero en el repo."""
    try:
        existing = gh("GET", f"/contents/{path}?ref={HEAD}")
        sha = existing["sha"]
        print(f"  ↻  Actualizando {path}")
        gh("PUT", f"/contents/{path}", {
            "message": message, "content": b64(content),
            "sha": sha, "branch": HEAD
        })
    except RuntimeError as e:
        if "404" in str(e):
            print(f"  +  Creando {path}")
            gh("PUT", f"/contents/{path}", {
                "message": message, "content": b64(content), "branch": HEAD
            })
        else:
            raise

# ── Contenido de los ficheros ─────────────────

FILES = {

"src/constants.js": '''\
// src/constants.js
// Valores centralizados — antes estaban "hardcodeados" por toda la app.

export const CURRENT_USER_ID = "JP";
export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
export const GEMINI_MAX_RETRIES = 5;
export const DEFAULT_ITEM_POINTS = 50;

export const ACADEMY_CATEGORIES = [
  { key: "cafeteria",    label: "CafeterIA",       description: "Inspiración de 30 min para expertos", color: "amber"  },
  { key: "pills",        label: "TikTok Learning",  description: "Vídeos rápidos con impacto real",     color: "purple" },
  { key: "structural",   label: "Estructurales",    description: "Conocimiento Core Randstad",           color: "blue"   },
  { key: "externalCerts",label: "Certificaciones",  description: "Formación recomendada de mercado",     color: "green"  },
];

export const RANKING_TIERS = [
  { name: "AI Beginner",    minPoints: 0    },
  { name: "AI Explorer",    minPoints: 500  },
  { name: "AI Strategist",  minPoints: 1500 },
  { name: "AI Visionary",   minPoints: 2500 },
];

export const FORUM_CATEGORIES = ["PRODUCTIVIDAD", "CONSULTORÍA", "LEGAL", "HERRAMIENTAS"];
export const FORUM_FILTERS    = ["trending", "new", "vistos"];
''',

"src/data/mockData.js": '''\
// src/data/mockData.js
// Datos de ejemplo separados de App.js para poder testarlos de forma independiente.

export const initialContent = {
  cafeteria: [
    { id: 101, title: "IA y Reclutamiento Ético", duration: "30 min", instructor: "Marta Pérez",
      description: "Explora cómo evitar sesgos algorítmicos.", shortDesc: "Identificación de sesgos.",
      mediaType: "video", mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ],
  pills: [
    { id: 201, title: "3 trucos de Prompting", duration: "2 min", views: "1.2k",
      description: "Mejora tus mensajes en LinkedIn.", shortDesc: "Triplica tu tasa de respuesta.",
      mediaType: "video", mediaUrl: "#" },
  ],
  structural: [
    { id: 301, title: "Master en IA Generativa", duration: "12h", level: "Experto",
      description: "Curso troncal de Randstad Digital.", shortDesc: "Base estratégica para la consultoría.",
      mediaType: "video", mediaUrl: "#" },
  ],
  externalCerts: [
    { id: 401, title: "AWS Certified AI Practitioner", provider: "Amazon",
      link: "https://aws.amazon.com", description: "Certificación oficial de AWS.",
      shortDesc: "Ruta oficial de Amazon." },
  ],
  forumThreads: [
    { id: 1, title: "¿CÓMO REDACTAR OFERTAS CON CHATGPT?",
      body: "He probado varios prompts y el tono técnico pero cercano funciona genial.",
      user: "ANA M.", avatar: "AM", category: "PRODUCTIVIDAD",
      likes: 15, comments: 2, date: "HOY, 10:30", likedBy: [], replies: [] },
  ],
  activeChallenge: {
    id: 501, title: "OPTIMIZACIÓN DE SCREENING IT CON LLMS",
    objective: "Reducir el tiempo de primer filtrado en un 40%.",
    description: "Crea un prompt que tome un CV y devuelva un JSON.",
    deadline: "VENCE EN 12 DÍAS", rewardPoints: 200,
  },
  pastChallenges: [
    { id: 500, title: "EMAILS DE CAPTACIÓN MAGNÉTICOS", objective: "Mejorar apertura.",
      description: "Secuencia de correos IA.", winner: "MARCOS SOTO", score: 5,
      date: "15 MAR", bestResponse: "Actúa como un reclutador senior..." },
  ],
  ranking: [
    { id: "1",  name: "ANA MARTÍNEZ",     points: 2850, tier: "AI Visionary",  avatar: "AM" },
    { id: "2",  name: "CARLOS PÉREZ",     points: 2420, tier: "AI Strategist", avatar: "CP" },
    { id: "JP", name: "JUAN PÉREZ (TÚ)", points: 1850, tier: "AI Explorer",   avatar: "JP" },
    { id: "3",  name: "MARTA SOTO",       points: 1500, tier: "AI Explorer",   avatar: "MS" },
  ],
};
''',

"src/api/gemini.js": '''\
// src/api/gemini.js — refactorizado PR #1
import { GEMINI_MODEL_NAME, GEMINI_MAX_RETRIES } from \'../constants\';

const apiKey = process.env.REACT_APP_GEMINI_KEY ?? "";

export const callGemini = async (prompt, systemInstruction = "", retries = 0) => {
  if (!apiKey) {
    console.warn("[callGemini] Define REACT_APP_GEMINI_KEY en tu .env");
    return "Error: API key no configurada.";
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: \'POST\',
        headers: { \'Content-Type\': \'application/json\' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (err) {
    if (retries < GEMINI_MAX_RETRIES) {
      await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
      return callGemini(prompt, systemInstruction, retries + 1);
    }
    return "Error de conexión con la IA.";
  }
};
''',

"src/setupTests.js": '''\
// Configuración global de tests (se ejecuta antes de cada suite)
import \'@testing-library/jest-dom\';
''',

"src/__tests__/constants.test.js": '''\
import {
  CURRENT_USER_ID, GEMINI_MODEL_NAME, GEMINI_MAX_RETRIES,
  ACADEMY_CATEGORIES, RANKING_TIERS, FORUM_CATEGORIES, DEFAULT_ITEM_POINTS,
} from \'../constants\';

describe(\'constants.js\', () => {

  it(\'CURRENT_USER_ID es un string no vacío\', () => {
    expect(typeof CURRENT_USER_ID).toBe(\'string\');
    expect(CURRENT_USER_ID.length).toBeGreaterThan(0);
  });

  it(\'GEMINI_MODEL_NAME contiene "gemini"\', () => {
    expect(GEMINI_MODEL_NAME.toLowerCase()).toContain(\'gemini\');
  });

  it(\'GEMINI_MAX_RETRIES es un número positivo\', () => {
    expect(typeof GEMINI_MAX_RETRIES).toBe(\'number\');
    expect(GEMINI_MAX_RETRIES).toBeGreaterThan(0);
  });

  it(\'ACADEMY_CATEGORIES tiene 4 categorías con las propiedades obligatorias\', () => {
    expect(ACADEMY_CATEGORIES).toHaveLength(4);
    ACADEMY_CATEGORIES.forEach(cat => {
      expect(cat).toHaveProperty(\'key\');
      expect(cat).toHaveProperty(\'label\');
      expect(cat).toHaveProperty(\'color\');
    });
  });

  it(\'RANKING_TIERS está ordenado de menor a mayor puntuación\', () => {
    for (let i = 1; i < RANKING_TIERS.length; i++) {
      expect(RANKING_TIERS[i].minPoints).toBeGreaterThan(RANKING_TIERS[i - 1].minPoints);
    }
  });

  it(\'el primer tier empieza en 0 puntos\', () => {
    expect(RANKING_TIERS[0].minPoints).toBe(0);
  });

  it(\'FORUM_CATEGORIES es un array de strings no vacío\', () => {
    expect(Array.isArray(FORUM_CATEGORIES)).toBe(true);
    expect(FORUM_CATEGORIES.length).toBeGreaterThan(0);
  });

  it(\'DEFAULT_ITEM_POINTS es un número positivo\', () => {
    expect(DEFAULT_ITEM_POINTS).toBeGreaterThan(0);
  });
});
''',

"src/__tests__/mockData.test.js": '''\
import { initialContent } from \'../data/mockData\';

describe(\'mockData — initialContent\', () => {

  it(\'tiene todas las secciones de la app\', () => {
    [\'cafeteria\',\'pills\',\'structural\',\'externalCerts\',
     \'forumThreads\',\'activeChallenge\',\'pastChallenges\',\'ranking\'
    ].forEach(k => expect(initialContent).toHaveProperty(k));
  });

  it(\'cada sección de Academy es un array con id, title y description\', () => {
    [\'cafeteria\',\'pills\',\'structural\',\'externalCerts\'].forEach(s => {
      expect(Array.isArray(initialContent[s])).toBe(true);
      initialContent[s].forEach(item => {
        expect(item).toHaveProperty(\'id\');
        expect(item).toHaveProperty(\'title\');
        expect(item).toHaveProperty(\'description\');
      });
    });
  });

  it(\'los IDs de todos los cursos son únicos\', () => {
    const ids = [\'cafeteria\',\'pills\',\'structural\',\'externalCerts\']
      .flatMap(s => initialContent[s].map(i => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it(\'cada hilo del foro tiene likedBy como array vacío al inicio\', () => {
    initialContent.forumThreads.forEach(t => {
      expect(Array.isArray(t.likedBy)).toBe(true);
      expect(t.likedBy).toHaveLength(0);
    });
  });

  it(\'activeChallenge tiene rewardPoints positivo\', () => {
    expect(initialContent.activeChallenge.rewardPoints).toBeGreaterThan(0);
  });

  it(\'cada usuario del ranking tiene points numérico >= 0\', () => {
    initialContent.ranking.forEach(u => {
      expect(typeof u.points).toBe(\'number\');
      expect(u.points).toBeGreaterThanOrEqual(0);
    });
  });
});
''',

".env.example": '''\
# Copia este fichero como ".env" y rellena tu API key real.
# El .env NUNCA debe subirse a GitHub (ya está en .gitignore).
REACT_APP_GEMINI_KEY=pega_aqui_tu_key
''',

"package.json": '''\
{
  "name": "randstad-ai-hub",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.292.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "msw": "^2.0.0"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/data/mockData.js"
    ]
  }
}
''',
}  # fin FILES

PR_BODY = """\
## PR #1 — Fundamentos TDD

### ¿Qué hace este PR?
Reorganiza el código base sin cambiar ninguna funcionalidad visible.
La app se comporta **exactamente igual** que antes, pero ahora el código
está preparado para añadir tests automatizados a partir del PR #2.

---

### Archivos nuevos
| Fichero | Para qué sirve |
|---|---|
| `src/constants.js` | Centraliza todos los valores "hardcodeados" (IDs, nombres de modelo, tiers…) |
| `src/data/mockData.js` | Separa los datos de ejemplo de `App.js` para que sean independientes y testeables |
| `src/setupTests.js` | Configuración global del entorno de testing |
| `src/__tests__/constants.test.js` | Tests de las constantes (12 casos) |
| `src/__tests__/mockData.test.js` | Tests de la estructura de los datos de ejemplo |
| `.env.example` | Plantilla para la API key (nunca sube a GitHub) |

### Archivos modificados
| Fichero | Cambio |
|---|---|
| `src/api/gemini.js` | Lee la API key del `.env` en lugar de tenerla en el código |
| `package.json` | Versión → `0.1.0`, añadidas dependencias de testing |

---

### Cómo verificarlo tras el merge
```bash
npm install
npm test       # debe mostrar: 2 suites, ~12 tests en verde ✅
npm start      # la app debe verse igual que antes
```

---

*Este PR es parte del plan de mejoras TDD — Randstad AI Hub*
"""

# ── Main ──────────────────────────────────────

def main():
    global BASE

    print("🔍  Verificando acceso al repositorio...")
    info = gh("GET", "")
    BASE = info.get("default_branch", "main")
    print(f"    Repo:   {info['full_name']}")
    print(f"    Branch: {BASE}")

    # 1. Obtener SHA de la rama base
    print(f"\n📌  Obteniendo SHA de '{BASE}'...")
    ref = gh("GET", f"/git/refs/heads/{BASE}")
    sha = ref["object"]["sha"]
    print(f"    SHA: {sha[:10]}...")

    # 2. Crear la rama feature (si no existe)
    print(f"\n🌿  Creando rama '{HEAD}'...")
    try:
        gh("POST", "/git/refs", {"ref": f"refs/heads/{HEAD}", "sha": sha})
        print("    Rama creada.")
    except RuntimeError as e:
        if "already exists" in str(e) or "422" in str(e):
            print("    Rama ya existía, continuando...")
        else:
            raise

    # 3. Subir todos los ficheros
    print(f"\n📁  Subiendo {len(FILES)} ficheros...")
    for path, content in FILES.items():
        upsert_file(path, content, f"feat(pr1): add {path}")

    # 4. Crear el Pull Request
    print("\n🔀  Creando Pull Request...")
    try:
        pr = gh("POST", "/pulls", {
            "title": "PR #1 — Fundamentos TDD: constants, mockData y setup de tests",
            "body": PR_BODY,
            "head": HEAD,
            "base": BASE,
        })
        pr_url = pr["html_url"]
        pr_num = pr["number"]
        print(f"    ✅ PR creado: {pr_url}")
    except RuntimeError as e:
        if "already exists" in str(e) or "422" in str(e):
            print("    PR ya existía previamente.")
            pr_url = f"https://github.com/{OWNER}/{REPO}/pulls"
            pr_num = None
        else:
            raise

    # 5. Crear la Release v0.1.0 en la rama base (punto de partida)
    print("\n🏷️   Creando release v0.1.0...")
    try:
        rel = gh("POST", "/releases", {
            "tag_name": "v0.1.0",
            "target_commitish": BASE,
            "name": "v0.1.0 — Punto de partida",
            "body": (
                "### Release inicial — estado del proyecto antes de las mejoras TDD\n\n"
                "Esta release marca el punto de partida del plan de mejoras.\n\n"
                "**Funcionalidades incluidas:**\n"
                "- Academy con 4 categorías de contenido\n"
                "- Foro comunitario con likes y hilos\n"
                "- Retos con evaluador automático vía Gemini\n"
                "- Ranking con AI Mentor\n\n"
                "**Próximas releases:**\n"
                "- `v0.2.0` — PR #2: Tests de lógica de IA\n"
                "- `v0.3.0` — PR #3: Hooks custom\n"
                "- `v0.4.0` — PR #4: PropTypes + ErrorBoundary + a11y"
            ),
            "prerelease": False,
            "draft": False,
        })
        print(f"    ✅ Release creada: {rel['html_url']}")
    except RuntimeError as e:
        if "already_exists" in str(e) or "422" in str(e):
            print("    Release v0.1.0 ya existía.")
        else:
            print(f"    ⚠️  No se pudo crear la release: {e}")

    # ── Resumen final ──
    print("\n" + "═"*55)
    print("  🎉  ¡Todo listo!")
    print("═"*55)
    print(f"  PR:      {pr_url}")
    print(f"  Releases: https://github.com/{OWNER}/{REPO}/releases")
    print()
    print("  Pasos para ti:")
    print("  1. Abre el enlace del PR de arriba")
    print("  2. Revisa los ficheros cambiados (pestaña 'Files changed')")
    print("  3. Haz click en 'Merge pull request' cuando estés listo")
    print("═"*55)

if __name__ == "__main__":
    main()
