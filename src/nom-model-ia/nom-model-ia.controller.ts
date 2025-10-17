import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NomModelIaService } from './nom-model-ia.service';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('v1/agent')
@Controller('v1/agent')
export class NomModelIaController {
  constructor(private readonly nomModelIaService: NomModelIaService) {}

  @Post('describe-image')
  @ApiOperation({ 
    summary: 'Description d\'image avec IA',
    description: 'Upload une image et obtient une description détaillée générée par GPT-4o. Analyse visuelle complète avec détection d\'objets, couleurs, composition et contexte.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichier image à analyser',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPG, PNG, GIF, WEBP - max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Description générée avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        filename: { type: 'string' },
        description: { type: 'string' },
        timestamp: { type: 'string' },
        fileSize: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou erreur de traitement' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async describeImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier image fourni');
    }

    try {
      const description = await this.nomModelIaService.describeImage(file.buffer, file.originalname);
      
      return {
        success: true,
        filename: file.originalname,
        description: description,
        timestamp: new Date().toISOString(),
        fileSize: file.size,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de l'analyse: ${error.message}`);
    }
  }

  @Post('analyze-agriculture')
  @ApiOperation({ 
    summary: 'Analyse agricole spécialisée',
    description: 'Upload une image et obtient une analyse agricole détaillée avec recommandations. Analyse spécialisée pour l\'agriculture : santé des cultures, qualité du sol, état des plantes, recommandations agronomiques.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichier image à analyser pour l\'agriculture',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPG, PNG, GIF, WEBP - max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Analyse agricole générée avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        filename: { type: 'string' },
        analysis: { type: 'object' },
        timestamp: { type: 'string' },
        fileSize: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou erreur de traitement' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async analyzeAgriculture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier image fourni');
    }

    try {
      const analysis = await this.nomModelIaService.analyzeAgriculture(file.buffer, file.originalname);
      
      return {
        success: true,
        filename: file.originalname,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        fileSize: file.size,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de l'analyse agricole: ${error.message}`);
    }
  }

  @Post('social-media-captions')
  @ApiOperation({ 
    summary: 'Génération de légendes pour réseaux sociaux',
    description: 'Upload une image et obtient des légendes optimisées pour TikTok, Instagram, Facebook et Twitter. Génération automatique de contenu engageant avec hashtags et call-to-action adaptés à chaque plateforme.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichier image pour générer des légendes sociales',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPG, PNG, GIF, WEBP - max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Légendes générées avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        filename: { type: 'string' },
        captions: {
          type: 'object',
          properties: {
            tiktok: { type: 'string' },
            instagram: { type: 'string' },
            facebook: { type: 'string' },
            twitter: { type: 'string' }
          }
        },
        timestamp: { type: 'string' },
        fileSize: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou erreur de traitement' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async generateSocialMediaCaptions(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier image fourni');
    }

    try {
      const captions = await this.nomModelIaService.generateSocialMediaCaptions(file.buffer, file.originalname);
      
      return {
        success: true,
        filename: file.originalname,
        captions: captions,
        timestamp: new Date().toISOString(),
        fileSize: file.size,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la génération des légendes: ${error.message}`);
    }
  }

  @Post('marketing-description')
  @ApiOperation({ 
    summary: 'Description marketing commercial',
    description: 'Upload une image et obtient une description marketing complète pour e-commerce. Génération de contenu commercial professionnel : titre accrocheur, descriptions courtes et longues, arguments de vente, call-to-action.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichier image pour générer une description marketing',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPG, PNG, GIF, WEBP - max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Description marketing générée avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        filename: { type: 'string' },
        marketing: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            short_description: { type: 'string' },
            long_description: { type: 'string' },
            selling_points: { type: 'array', items: { type: 'string' } },
            call_to_action: { type: 'string' }
          }
        },
        timestamp: { type: 'string' },
        fileSize: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou erreur de traitement' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async generateMarketingDescription(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier image fourni');
    }

    try {
      const marketing = await this.nomModelIaService.generateMarketingDescription(file.buffer, file.originalname);
      
      return {
        success: true,
        filename: file.originalname,
        marketing: marketing,
        timestamp: new Date().toISOString(),
        fileSize: file.size,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la génération de la description marketing: ${error.message}`);
    }
  }

  @Post('veterinary-diagnosis')
  @ApiOperation({ 
    summary: 'Diagnostic vétérinaire de troupeau',
    description: 'Upload une image de troupeau et obtient un diagnostic vétérinaire professionnel avec actions prioritaires. Analyse spécialisée pour l\'élevage : diagnostic médical, actions urgentes/recommandées, surveillance, sources fiables (INRAE, IFIP, FAO).'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichier image de troupeau pour diagnostic vétérinaire',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPG, PNG, GIF, WEBP - max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Diagnostic vétérinaire généré avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        filename: { type: 'string' },
        diagnosis: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            diagnostic_probable: { type: 'string' },
            actions: {
              type: 'object',
              properties: {
                urgent: { type: 'array', items: { type: 'object' } },
                recommended: { type: 'array', items: { type: 'object' } },
                monitor: { type: 'array', items: { type: 'object' } }
              }
            },
            confiance: { type: 'string' }
          }
        },
        timestamp: { type: 'string' },
        fileSize: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou erreur de traitement' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async generateVeterinaryDiagnosis(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier image fourni');
    }

    try {
      const diagnosis = await this.nomModelIaService.generateVeterinaryDiagnosis(file.buffer, file.originalname);
      
      return {
        success: true,
        filename: file.originalname,
        diagnosis: diagnosis,
        timestamp: new Date().toISOString(),
        fileSize: file.size,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la génération du diagnostic vétérinaire: ${error.message}`);
    }
  }

  @Post('health-check')
  @ApiOperation({ 
    summary: 'Vérification de santé du service',
    description: 'Vérifie que le service v1/agent fonctionne correctement. Endpoint de monitoring pour vérifier la disponibilité de tous les services IA.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service opérationnel',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        service: { type: 'string' },
        timestamp: { type: 'string' },
        endpoints: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  healthCheck() {
    return {
      status: 'OK',
      service: 'v1/agent',
      timestamp: new Date().toISOString(),
      endpoints: [
        'POST /v1/agent/describe-image - Description générale d\'image avec IA',
        'POST /v1/agent/analyze-agriculture - Analyse agricole spécialisée',
        'POST /v1/agent/social-media-captions - Légendes pour réseaux sociaux',
        'POST /v1/agent/marketing-description - Description marketing commercial',
        'POST /v1/agent/veterinary-diagnosis - Diagnostic vétérinaire de troupeau',
        'POST /v1/agent/health-check - Vérification du service'
      ]
    };
  }
}
