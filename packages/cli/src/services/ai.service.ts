import { Service } from 'typedi';
import config from '@/config';
import type { INodeType, N8nAIProviderType } from 'n8n-workflow';
import { AIProviderOpenAI } from '@/services/ai/openai';
import { ApplicationError, NodeError } from 'n8n-workflow';

function isN8nAIProviderType(value: string): value is N8nAIProviderType {
	return ['openai'].includes(value);
}

@Service()
export class AIService {
	private provider: N8nAIProviderType;

	private model: AIProviderOpenAI;

	constructor() {
		const providerName = config.getEnv('ai.provider');
		if (!isN8nAIProviderType(providerName)) {
			throw new ApplicationError('Invalid AI provider. Please check the configuration.');
		}

		this.provider = providerName;
		switch (this.provider) {
			default:
				this.model = new AIProviderOpenAI();
		}
	}

	async prompt(message: string) {
		return await this.model.prompt(message);
	}

	async debugError(error: NodeError, nodeType: INodeType) {
		console.log(error, nodeType);
		return await this.prompt(
			`I'm using n8n (https://n8n.io) to integrate with ${
				nodeType.description.name
			} and encountered an error That I don't know how to solve.

Here's the complete error structure:
\`\`\`
${JSON.stringify(error, null, 2)}
\`\`\`

Could you provide a structured solution with step-by-step instructions to resolve this issue? Assume intermediate knowledge of n8n and Notion.`,
		);
	}
}
