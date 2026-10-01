import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NexaVoxaApi implements ICredentialType {
	name = 'nexaVoxaApi';

	displayName = 'NexaVoxa API';

	icon: Icon = { light: 'file:../icons/nexavoxa.svg', dark: 'file:../icons/nexavoxa.dark.svg' };

	documentationUrl = 'https://nexavoxa.com/help/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Create one in the NexaVoxa dashboard under Developers. Keys start with <code>nxa_</code> and carry scopes — give the key the scopes the operations you use require, rather than full access.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.nexavoxa.com',
			description:
				'Leave as-is unless NexaVoxa gave you a different host. Only change this if you were told to.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				// The API rejects a bare key: the Bearer prefix is required.
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// Cheapest authenticated read on the API, and it needs only agents:read —
	// so "Test" does not fail for a correctly-scoped key that simply cannot
	// list something heavier.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/agents',
			method: 'GET',
			qs: { limit: 1 },
		},
	};
}
