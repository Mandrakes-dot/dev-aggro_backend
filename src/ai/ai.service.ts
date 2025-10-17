import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

export interface OreusChatResponse {
  id?: string;
  object?: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

@Injectable()
export class AiService {
  private readonly apiUrl =
    'https://oreus-staging.dev2.dev-id.fr/api/v1/sdk/chat/completions';

  constructor(private configService: ConfigService) {}

  async getChatCompletion() {
    const apiKey = this.configService.get<string>('OREUS_API_KEY');
    console.log('Clé API utilisée:', apiKey); // pour vérifier

    const body = {
      messages: [{ role: 'user', content: 'Quel est mon prenom' }],
      model: 'BotIntelligent',
      stream: false,
      temperature: 0,
      max_completion_tokens: 500,
      top_p: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {},
      stop: ['string'],
    };

    try {
      const response = await axios.post(this.apiUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      });

      return response.data as OreusChatResponse;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Erreur API Oreus:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur API Oreus');
    }
  }
}
