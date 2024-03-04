import type { INodeType, NodeError } from 'n8n-workflow';
import { summarizeNodeTypeProperties } from '@/services/ai/summarizeNodeTypeProperties';

export const createDebugErrorPrompt = (
	error: NodeError,
	nodeType?: INodeType,
) => `You're an expert in workflow automation using n8n (https://n8n.io). You're helping an n8n user automate${
	nodeType ? ` using an ${nodeType.description.displayName} Node` : ''
}. The user has encountered an error that they don't know how to solve.

Use any knowledge you have about n8n ${
	nodeType ? ` and ${nodeType.description.displayName}` : ''
} to suggest a solution. Check node parameters, credentials, syntax validity, and the data being processed. Include code examples and expressions where applicable. You have access to the error object${
	nodeType
		? ` and a simplified array of nodeType properties for the ${nodeType.description.displayName} Node`
		: ''
}.
Also suggest reaching out to the support forum (https://community.n8n.io) for help if necessary.

Here's the complete error structure:
\`\`\`
${JSON.stringify(error, null, 2)}
\`\`\`

${
	nodeType
		? `Here's the simplified nodeType properties structure:
\`\`\`
${JSON.stringify(summarizeNodeTypeProperties(nodeType.description.properties), null, 2)}
\`\`\``
		: ''
}

Please provide a structured solution with step-by-step instructions to resolve this issue. Assume the following about the user you're helping:
- The user is viewing the problematic ${
	nodeType ? `${nodeType.description.displayName} ` : ''
}Node already
- The user has beginner to intermediate knowledge of n8n${
	nodeType ? ` and ${nodeType.description.displayName}` : ''
}.`;
