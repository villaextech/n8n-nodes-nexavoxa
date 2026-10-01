import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { agentDescription } from './resources/agent';
import { callDescription } from './resources/call';
import { phoneNumberDescription } from './resources/phoneNumber';

export class NexaVoxa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NexaVoxa',
		name: 'nexaVoxa',
		icon: { light: 'file:../../icons/nexavoxa.svg', dark: 'file:../../icons/nexavoxa.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Build AI voice agents that make and answer phone calls',
		defaults: { name: 'NexaVoxa' },
		// Lets an AI Agent node call these operations as tools. The operation
		// `action` strings are what the model sees, which is why they read as
		// instructions ("Place an outbound call") rather than as method names.
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'nexaVoxaApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'call',
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'Call', value: 'call' },
					{ name: 'Phone Number', value: 'phoneNumber' },
				],
			},
			...agentDescription,
			...callDescription,
			...phoneNumberDescription,
		],
	};
}
