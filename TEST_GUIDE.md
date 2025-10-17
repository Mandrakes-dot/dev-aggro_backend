# 🧪 Guide de Test - Dev-Agro Backend API

## 📚 Documentation API
- **Swagger UI**: http://localhost:3000/api
- **Interface interactive** pour tester tous les endpoints

## 🚀 Endpoints disponibles

### 1. **Health Check**
```bash
# Test de santé du service
curl -X POST http://localhost:3000/nom-model-ia/health-check
```

### 2. **Description d'image générale**
```bash
# Upload d'image pour description
curl -X POST \
  -F "image=@chemin/vers/votre-image.jpg" \
  http://localhost:3000/nom-model-ia/describe-image
```

### 3. **Analyse agricole spécialisée**
```bash
# Upload d'image pour analyse agricole
curl -X POST \
  -F "image=@chemin/vers/votre-image.jpg" \
  http://localhost:3000/nom-model-ia/analyze-agriculture
```

### 4. **Légendes réseaux sociaux**
```bash
# Upload d'image pour générer des légendes sociales
curl -X POST \
  -F "image=@chemin/vers/votre-image.jpg" \
  http://localhost:3000/nom-model-ia/social-media-captions
```

## 🖼️ Comment tester avec des images

### **Méthode 1: Curl (Terminal)**
```bash
# 1. Téléchargez une image de test
curl -o test-image.jpg "https://images.unsplash.com/photo-1416879595882-3373a0480b5b"

# 2. Testez la description
curl -X POST \
  -F "image=@test-image.jpg" \
  http://localhost:3000/nom-model-ia/describe-image

# 3. Testez l'analyse agricole
curl -X POST \
  -F "image=@test-image.jpg" \
  http://localhost:3000/nom-model-ia/analyze-agriculture

# 4. Testez les légendes réseaux sociaux
curl -X POST \
  -F "image=@test-image.jpg" \
  http://localhost:3000/nom-model-ia/social-media-captions
```

### **Méthode 2: Swagger UI (Recommandé)**
1. Ouvrez http://localhost:3000/api
2. Cliquez sur "nom-model-ia"
3. Sélectionnez un endpoint
4. Cliquez sur "Try it out"
5. Uploadez votre image
6. Cliquez sur "Execute"

### **Méthode 3: Postman**
1. Créez une nouvelle requête POST
2. URL: `http://localhost:3000/nom-model-ia/describe-image`
3. Body → form-data
4. Clé: `image`, Type: File
5. Sélectionnez votre image
6. Envoyez la requête

## 📋 Types d'images supportés
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WEBP
- ❌ Autres formats non supportés

## 📏 Limitations
- **Taille max**: 10MB par image
- **Format**: Images uniquement
- **Connexion**: Internet requis pour OpenAI

## 🔧 Tests de validation

### **Test 1: Image valide**
```bash
curl -X POST -F "image=@valid-image.jpg" http://localhost:3000/nom-model-ia/describe-image
```
**Résultat attendu**: Description détaillée de l'image

### **Test 2: Fichier non-image**
```bash
curl -X POST -F "image=@document.pdf" http://localhost:3000/nom-model-ia/describe-image
```
**Résultat attendu**: Erreur 400 - "Seuls les fichiers image sont autorisés"

### **Test 3: Image trop volumineuse**
```bash
curl -X POST -F "image=@large-image.jpg" http://localhost:3000/nom-model-ia/describe-image
```
**Résultat attendu**: Erreur si > 10MB

### **Test 4: Pas de fichier**
```bash
curl -X POST http://localhost:3000/nom-model-ia/describe-image
```
**Résultat attendu**: Erreur 400 - "Aucun fichier image fourni"

## 🌱 Exemples d'images pour tests agricoles

### **Images recommandées pour l'analyse agricole:**
- 🌾 Champs de blé/maïs
- 🥬 Légumes (tomates, salades)
- 🌳 Arbres fruitiers
- 🍃 Feuilles avec maladies
- 🌱 Plantes en serre
- 🐛 Parasites sur plantes

## 📊 Réponses attendues

### **Description générale**
```json
{
  "success": true,
  "filename": "image.jpg",
  "description": "Description détaillée générée par GPT-4o...",
  "timestamp": "2025-10-16T20:46:59.272Z",
  "fileSize": 1234567
}
```

### **Analyse agricole**
```json
{
  "success": true,
  "filename": "image.jpg",
  "analysis": {
    "culture": "Blé",
    "sante": "Bon état",
    "problemes": [],
    "recommandations": ["Arrosage régulier"]
  },
  "timestamp": "2025-10-16T20:46:59.272Z",
  "fileSize": 1234567
}
```

### **Légendes réseaux sociaux**
```json
{
  "success": true,
  "filename": "image.jpg",
  "captions": {
    "tiktok": "Lever de soleil magique! 🌅 #NatureLover #MorningVibes #FYP",
    "instagram": "Chaque lever de soleil est un rappel de la beauté naturelle... #NatureBrilliance #SunriseGlow",
    "facebook": "Découvrez la magie d'un lever de soleil sur des champs dorés... #SunriseMagic #CommunityFarming",
    "twitter": "Lever de soleil sur les champs: une nouvelle journée commence. 🌅 #SustainableAgriculture #Sunrise"
  },
  "timestamp": "2025-10-16T20:46:59.272Z",
  "fileSize": 1234567
}
```

## 🚨 Dépannage

### **Erreur: "nest: command not found"**
```bash
cd /Users/macbookpro/WORKS/CODE/IA/HACKATHON-IA/dev-aggro_backend
npm install
npm run start:dev
```

### **Erreur: "OpenAI API Error"**
- Vérifiez la clé API dans le service
- Vérifiez votre connexion internet
- Vérifiez vos crédits OpenAI

### **Erreur: "File too large"**
- Réduisez la taille de l'image
- Compressez l'image avant upload

## 🎯 Prochaines étapes
1. Testez avec différentes images
2. Intégrez avec votre frontend
3. Ajoutez l'authentification si nécessaire
4. Optimisez les performances
