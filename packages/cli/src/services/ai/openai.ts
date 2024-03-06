import OpenAI from 'openai';
import config from '@/config';
import type { N8nAIProvider } from 'n8n-workflow';

export class AIProviderOpenAI implements N8nAIProvider {
	private model: OpenAI;

	constructor() {
		this.model = new OpenAI({
			apiKey: config.getEnv('ai.openAIApiKey'),
		});
	}

	mapResponse(data: OpenAI.ChatCompletion): string {
		return data.choices[0].message.content ?? '';
	}

	async prompt(prompt: string) {
		const data = await this.model.chat.completions.create({
			messages: [{ role: 'user', content: prompt }],
			model: 'gpt-3.5-turbo',
		});

		return this.mapResponse(data);
	}
}
