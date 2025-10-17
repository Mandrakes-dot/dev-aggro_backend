# 📚 Guide API Dev-Agro v1/agent

## 🚀 **Endpoints disponibles**

### **Base URL:** `http://localhost:3000/v1/agent/`

---

## 🔍 **1. Description d'image avec IA**
**Endpoint:** `POST /v1/agent/describe-image`

**Description:** Analyse visuelle complète avec détection d'objets, couleurs, composition et contexte.

**Test avec curl:**
```bash
curl -X POST -F "image=@votre-image.jpg" http://localhost:3000/v1/agent/describe-image
```

**Réponse attendue:**
```json
{
  "success": true,
  "filename": "image.jpg",
  "description": "Description détaillée de l'image...",
  "timestamp": "2025-10-17T07:26:46.494Z",
  "fileSize": 30339
}
```

---

## 🌾 **2. Analyse agricole spécialisée**
**Endpoint:** `POST /v1/agent/analyze-agriculture`

**Description:** Analyse spécialisée pour l'agriculture : santé des cultures, qualité du sol, état des plantes, recommandations agronomiques.

**Test avec curl:**
```bash
curl -X POST -F "image=@champ-agricole.jpg" http://localhost:3000/v1/agent/analyze-agriculture
```

**Réponse attendue:**
```json
{
  "success": true,
  "filename": "champ-agricole.jpg",
  "analysis": {
    "santé_cultures": "...",
    "qualité_sol": "...",
    "recommandations": "..."
  },
  "timestamp": "2025-10-17T07:26:46.494Z",
  "fileSize": 30339
}
```

---

## 📱 **3. Légendes pour réseaux sociaux**
**Endpoint:** `POST /v1/agent/social-media-captions`

**Description:** Génération automatique de contenu engageant avec hashtags et call-to-action adaptés à chaque plateforme.

**Test avec curl:**
```bash
curl -X POST -F "image=@image-social.jpg" http://localhost:3000/v1/agent/social-media-captions
```

**Réponse attendue:**
```json
{
  "success": true,
  "filename": "image-social.jpg",
  "captions": {
    "tiktok": "Légende TikTok optimisée...",
    "instagram": "Légende Instagram avec hashtags...",
    "facebook": "Légende Facebook communautaire...",
    "twitter": "Légende Twitter concise..."
  },
  "timestamp": "2025-10-17T07:27:01.961Z",
  "fileSize": 30339
}
```

---

## 💼 **4. Description marketing commercial**
**Endpoint:** `POST /v1/agent/marketing-description`

**Description:** Génération de contenu commercial professionnel : titre accrocheur, descriptions courtes et longues, arguments de vente, call-to-action.

**Test avec curl:**
```bash
curl -X POST -F "image=@produit.jpg" http://localhost:3000/v1/agent/marketing-description
```

**Réponse attendue:**
```json
{
  "success": true,
  "filename": "produit.jpg",
  "marketing": {
    "title": "Titre accrocheur du produit",
    "short_description": "Description courte en une phrase",
    "long_description": "Description détaillée orientée bénéfices...",
    "selling_points": [
      "✅ Argument de vente 1",
      "🔥 Argument de vente 2",
      "⭐ Argument de vente 3"
    ],
    "call_to_action": "Call to action adapté à la cible"
  },
  "timestamp": "2025-10-17T07:27:01.961Z",
  "fileSize": 30339
}
```

---

## 🩺 **5. Diagnostic vétérinaire de troupeau**
**Endpoint:** `POST /v1/agent/veterinary-diagnosis`

**Description:** Analyse spécialisée pour l'élevage : diagnostic médical, actions urgentes/recommandées, surveillance, sources fiables (INRAE, IFIP, FAO).

**Test avec curl:**
```bash
curl -X POST -F "image=@troupeau.jpg" http://localhost:3000/v1/agent/veterinary-diagnosis
```

**Réponse attendue:**
```json
{
  "success": true,
  "filename": "troupeau.jpg",
  "diagnosis": {
    "description": "Description clinique de l'état observé",
    "diagnostic_probable": "Hypothèse médicale la plus probable",
    "actions": {
      "urgent": [
        {
          "action": "Action urgente à réaliser",
          "reason": "Raison de l'urgence",
          "source": "Source fiable (INRAE, IFIP, FAO)"
        }
      ],
      "recommended": [
        {
          "action": "Action recommandée",
          "reason": "Raison de la recommandation",
          "source": "Source fiable"
        }
      ],
      "monitor": [
        {
          "action": "Point à surveiller",
          "reason": "Raison de la surveillance",
          "source": "Source fiable"
        }
      ]
    },
    "confiance": "Niveau de confiance du diagnostic"
  },
  "timestamp": "2025-10-17T07:27:01.961Z",
  "fileSize": 30339
}
```

---

## 🏥 **6. Vérification de santé du service**
**Endpoint:** `POST /v1/agent/health-check`

**Description:** Vérifie que le service v1/agent fonctionne correctement. Endpoint de monitoring pour vérifier la disponibilité de tous les services IA.

**Test avec curl:**
```bash
curl -X POST http://localhost:3000/v1/agent/health-check
```

**Réponse attendue:**
```json
{
  "status": "OK",
  "service": "v1/agent",
  "timestamp": "2025-10-17T07:26:17.940Z",
  "endpoints": [
    "POST /v1/agent/describe-image - Description générale d'image avec IA",
    "POST /v1/agent/analyze-agriculture - Analyse agricole spécialisée",
    "POST /v1/agent/social-media-captions - Légendes pour réseaux sociaux",
    "POST /v1/agent/marketing-description - Description marketing commercial",
    "POST /v1/agent/veterinary-diagnosis - Diagnostic vétérinaire de troupeau",
    "POST /v1/agent/health-check - Vérification du service"
  ]
}
```

---

## 📋 **Spécifications techniques**

### **Formats d'image supportés:**
- JPG/JPEG
- PNG
- GIF
- WEBP

### **Limites:**
- Taille maximale: 10MB
- Types MIME autorisés: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

### **Headers requis:**
```
Content-Type: multipart/form-data
```

### **Paramètres:**
- `image`: Fichier image (obligatoire)

---

## 🔧 **Interface Swagger**

**URL de documentation:** `http://localhost:3000/api`

La documentation Swagger interactive permet de tester tous les endpoints directement depuis le navigateur.

---

## 🚨 **Codes d'erreur**

- **400 Bad Request:** Fichier invalide ou erreur de traitement
- **500 Internal Server Error:** Erreur interne du serveur

---

## 🎯 **Exemples d'utilisation**

### **Frontend React:**
```javascript
const response = await axios.post('http://localhost:3000/v1/agent/describe-image', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### **JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/v1/agent/describe-image', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 📊 **Monitoring**

- **Health Check:** `POST /v1/agent/health-check`
- **Documentation:** `GET /api`
- **Logs:** Vérifiez les logs du serveur NestJS

---

*Dernière mise à jour: 17 octobre 2025*
