import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class NomModelIaService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',
    });
  }

  async describeImage(imageBuffer: Buffer, filename: string): Promise<string> {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Décris cette ferme et ses produits à partir des photos envoyées. \n' +
                  'Ton objectif est de rédiger une description attrayante et naturelle \n' +
                  'pour une application qui met en valeur les fermes et leurs produits agricoles.\n' +
                  '\n' +
                  '- Utilise un ton professionnel, chaleureux et authentique.\n' +
                  '- Mets en avant les atouts visuels : paysages, animaux, cultures, produits, etc.\n' +
                  '- Décris les couleurs, la qualité et l’ambiance du lieu.\n' +
                  '- Si tu reconnais un animal ou un produit, parle-en sans exagérer.\n' +
                  '- Reste concis (5 à 8 phrases maximum) et écris en français naturel.\n' +
                  '- N’invente pas de détails qui ne sont pas visibles sur la photo.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'Impossible de décrire l\'image';
    } catch (error) {
      console.error('Erreur lors de la description de l\'image:', error);
      throw new Error('Erreur lors de l\'analyse de l\'image');
    }
  }

  async analyzeAgriculture(imageBuffer: Buffer, filename: string): Promise<string> {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Tu es un expert en agriculture. Analyse cette image et donne des conseils agricoles spécifiques, des recommandations pour améliorer les cultures, et identifie les problèmes potentiels. Réponds en français.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
      });

      return response.choices[0]?.message?.content || 'Impossible d\'analyser l\'image agricole';
    } catch (error) {
      console.error('Erreur lors de l\'analyse agricole:', error);
      throw new Error('Erreur lors de l\'analyse agricole');
    }
  }

  async generateSocialMediaCaptions(imageBuffer: Buffer, filename: string): Promise<object> {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Tu es un expert en marketing digital et réseaux sociaux. Analyse cette image et génère des légendes optimisées pour chaque plateforme :

- TikTok : Légende fun, virale, avec hashtags tendance
- Instagram : Légende inspirante, esthétique, avec hashtags lifestyle
- Facebook : Légende informative, communautaire, avec hashtags engagement
- Twitter : Légende concise, professionnelle, avec hashtags actualité

Réponds UNIQUEMENT avec un JSON structuré sous cette forme :
{
  "tiktok": "légende tiktok",
  "instagram": "légende instagram", 
  "facebook": "légende facebook",
  "twitter": "légende twitter"
}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        const parsedContent = JSON.parse(cleanContent);
        
        const extractText = (caption: any): string => {
          if (typeof caption === 'string') {
            return caption;
          }
          if (caption && typeof caption === 'object' && caption.caption) {
            return caption.caption;
          }
          return String(caption);
        };

        return {
          tiktok: extractText(parsedContent.tiktok),
          instagram: extractText(parsedContent.instagram),
          facebook: extractText(parsedContent.facebook),
          twitter: extractText(parsedContent.twitter),
        };
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        return {
          tiktok: 'Légende TikTok générée',
          instagram: 'Légende Instagram générée',
          facebook: 'Légende Facebook générée',
          twitter: 'Légende Twitter générée',
        };
      }
    } catch (error) {
      console.error('Erreur lors de la génération des légendes:', error);
      throw new Error('Erreur lors de la génération des légendes');
    }
  }

  async generateMarketingDescription(imageBuffer: Buffer, filename: string, location?: string, ip?: string): Promise<object> {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      const contextualData = {
        weather: {
          condition: 'ensoleillé',
          temperature: 22,
          humidity: 65,
          season: 'automne',
          agricultural_impact: 'Conditions idéales pour les semis d\'automne',
        },
        news: {
          articles: [
            'Sécheresse exceptionnelle dans le Sud-Ouest de la France',
            'Prix du blé en hausse de 15% cette semaine',
            'Nouvelle réglementation bio européenne en vigueur',
          ],
          market_trends: 'Demande croissante pour les produits bio et durables',
        },
        geolocation: {
          country: 'France',
          region: 'Nouvelle-Aquitaine',
          city: 'Bordeaux',
          agricultural_zone: 'Zone tempérée - Agriculture céréalière et viticole',
        },
        timestamp: new Date().toISOString(),
      };

      const contextualPrompt = `
Tu es un expert en rédaction marketing et e-commerce spécialisé dans l'agriculture. Ta mission est de décrire de manière commerciale un produit à partir de l'image fournie, en intégrant le contexte actuel pour rendre la description ultra-pertinente.

CONTEXTE ACTUEL :
- Météo : ${contextualData.weather.condition} (${contextualData.weather.temperature}°C, humidité ${contextualData.weather.humidity}%)
- Saison : ${contextualData.weather.season} (${contextualData.weather.agricultural_impact})
- Actualités agricoles : ${contextualData.news.articles.join(', ')}
- Tendances du marché : ${contextualData.news.market_trends}
- Géolocalisation : ${contextualData.geolocation.city}, ${contextualData.geolocation.region}, ${contextualData.geolocation.country} (${contextualData.geolocation.agricultural_zone})

Contraintes pour la description marketing :
- Propose un TITRE accrocheur et professionnel, adapté au contexte.
- Fournis une DESCRIPTION COURTE (1 phrase) pour une fiche produit, intégrant le contexte.
- Fournis une DESCRIPTION LONGUE (3 à 5 phrases) orientée bénéfices, en utilisant le contexte pour souligner la pertinence du produit.
- Liste 3 à 5 ARGUMENTS sous forme de bullet points avec des emojis ✅, 🔥 ou ⭐, directement liés au contexte actuel.
- Termine par un CALL TO ACTION adapté à la cible et au contexte.

Style attendu : professionnel, rassurant pour l'agriculture, et très pertinent par rapport au contexte fourni.
Langue : FR

IMPORTANT: Réponds UNIQUEMENT avec un JSON structuré sous cette forme :
{
  "title": "Titre accrocheur",
  "short_description": "Description courte",
  "long_description": "Description longue orientée bénéfices",
  "selling_points": ["Argument 1", "Argument 2", "Argument 3"],
  "call_to_action": "Call to action adapté"
}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: contextualPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        const parsedContent = JSON.parse(cleanContent);
        return {
          ...parsedContent,
          context: contextualData,
        };
      } catch (parseError) {
        console.error('Erreur de parsing JSON marketing:', parseError);
        return {
          title: 'Produit agricole de qualité',
          short_description: 'Solution innovante pour l\'agriculture moderne',
          long_description: 'Ce produit révolutionnaire répond aux défis actuels de l\'agriculture durable. Conçu pour maximiser les rendements tout en respectant l\'environnement, il s\'intègre parfaitement dans votre stratégie agricole.',
          selling_points: [
            '✅ Technologie de pointe',
            '🔥 Résultats garantis',
            '⭐ Qualité certifiée',
          ],
          call_to_action: 'Découvrez dès maintenant les avantages de cette solution !',
          context: contextualData,
        };
      }
    } catch (error) {
      console.error('Erreur lors de la génération marketing:', error);
      throw new Error('Erreur lors de la génération de la description marketing');
    }
  }

  async generateVeterinaryDiagnosis(imageBuffer: Buffer, filename: string): Promise<object> {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      const validationResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Tu es un expert en validation d'images pour l'analyse vétérinaire d'animaux d'élevage.

RÈGLES STRICTES - VALIDATION AUTOMATIQUE :
- ✅ ACCEPTER UNIQUEMENT : Chèvres, bovins, ovins (moutons, brebis, béliers) visibles dans l'image
- ✅ ACCEPTER UNIQUEMENT : Matériel agricole spécifique à la santé des troupeaux
- ✅ ACCEPTER UNIQUEMENT : Contexte agricole avec animaux d'élevage présents

- ❌ REFUSER ABSOLUMENT : Toute image contenant des humains (même partiellement)
- ❌ REFUSER ABSOLUMENT : Toute image contenant des voitures, tracteurs, véhicules
- ❌ REFUSER ABSOLUMENT : Toute image contenant des chats, chiens, oiseaux domestiques
- ❌ REFUSER ABSOLUMENT : Toute image de paysage sans animaux d'élevage
- ❌ REFUSER ABSOLUMENT : Toute image d'objets sans rapport avec l'élevage
- ❌ REFUSER ABSOLUMENT : Toute image sans animaux d'élevage visibles

IMPORTANT : Si tu vois UN SEUL humain, véhicule, ou animal domestique, tu DOIS refuser l'image.

Analyse cette image et détermine si elle contient UNIQUEMENT des animaux d'élevage (chèvres, bovins, ovins).

Réponds UNIQUEMENT avec un JSON structuré :
{
  "isValid": true/false,
  "reason": "Description précise de ce qui est visible",
  "confidence": 0.0-1.0,
  "detectedAnimals": ["liste des animaux d'élevage détectés"],
  "inappropriateElements": ["éléments inappropriés détectés (humains, véhicules, etc.)"]
}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const validationContent = validationResponse.choices[0]?.message?.content || '{}';
      let cleanValidationContent = validationContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      let validationResult;
      try {
        validationResult = JSON.parse(cleanValidationContent);
      } catch (error) {
        console.error('Erreur de parsing validation:', error);
        validationResult = { isValid: false, reason: 'Erreur lors de l\'analyse de l\'image', confidence: 0 };
      }

      console.log('🔍 Résultat validation:', validationResult);

      if (!validationResult.isValid) {
        return {
          error: 'Image hors contexte agricole',
          message: 'Je suis spécialisé dans l\'analyse d\'animaux d\'élevage (chèvres, bovins, ovins). Merci de fournir une image en lien avec ce domaine.',
          timestamp: new Date().toISOString()
        };
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Tu es un vétérinaire expert spécialisé dans l'élevage de troupeaux (chèvres, bovins, ovins). Ta mission : analyser des images ou des descriptions textuelles d'animaux et fournir un **diagnostic précis et actionnable** comme le ferait un vétérinaire professionnel.

Pour chaque analyse, tu dois générer une réponse structurée, claire et priorisée :

1️⃣ **Description clinique** : Décris l'état observé du ou des animaux (pelage, posture, respiration, comportement...).
2️⃣ **Diagnostic probable** : Indique l'hypothèse médicale la plus probable.
3️⃣ **Actions urgentes (🔴)** : Ce qu'il faut réaliser immédiatement.
4️⃣ **Actions recommandées (🟡)** : Ce qui doit être fait selon le contexte.
5️⃣ **Points à surveiller (🟢)** : Observations à suivre dans le temps.
6️⃣ **Sources** : Cite toujours des références fiables (INRAE, IFIP, FAO…).

Format de sortie attendu (JSON) :
{
  "description": "...",
  "diagnostic_probable": "...",
  "actions": {
    "urgent": [{"action": "...", "reason": "...", "source": "..."}],
    "recommended": [{"action": "...", "reason": "...", "source": "..."}],
    "monitor": [{"action": "...", "reason": "...", "source": "..."}]
  },
  "confiance": "..."
}

🔹 Si tu n'es pas sûr, propose plusieurs hypothèses.
🔹 Priorise toujours les actions par gravité.
🔹 Utilise un langage clair et professionnel, compréhensible par un éleveur.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        const parsedContent = JSON.parse(cleanContent);
        return {
          success: true,
          filename,
          diagnosis: parsedContent,
          timestamp: new Date().toISOString(),
          fileSize: imageBuffer.length,
        };
      } catch (parseError) {
        console.error('Erreur de parsing JSON vétérinaire:', parseError);
        return {
          success: true,
          filename,
          diagnosis: {
            description: 'Analyse vétérinaire en cours...',
            diagnostic_probable: 'Consultation vétérinaire recommandée',
            actions: {
              urgent: [
                {
                  action: 'Consulter un vétérinaire immédiatement',
                  reason: 'Diagnostic nécessitant une expertise professionnelle',
                  source: 'Ordre des vétérinaires'
                }
              ],
              recommended: [
                {
                  action: 'Surveiller l\'état général du troupeau',
                  reason: 'Prévention et suivi sanitaire',
                  source: 'INRAE'
                }
              ],
              monitor: [
                {
                  action: 'Observer le comportement et l\'appétit',
                  reason: 'Détection précoce de problèmes',
                  source: 'IFIP'
                }
              ]
            },
            confiance: 'Faible - Consultation professionnelle requise',
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString(),
          fileSize: imageBuffer.length,
        };
      }
    } catch (error) {
      console.error('Erreur lors du diagnostic vétérinaire:', error);
      throw new Error('Erreur lors du diagnostic vétérinaire');
    }
  }

  async healthCheck(): Promise<object> {
    return {
      status: 'OK',
      service: 'NomModelIaService',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
