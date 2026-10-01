import type { INodeProperties } from 'n8n-workflow';
import { listPaging, splitListResponse } from '../../shared/descriptions';

const showOnlyForAgents = { resource: ['agent'] };
const showForGetMany = { ...showOnlyForAgents, operation: ['getAll'] };
const showForGet = { ...showOnlyForAgents, operation: ['get'] };
const showForCreate = { ...showOnlyForAgents, operation: ['create'] };
const showForUpdate = { ...showOnlyForAgents, operation: ['update'] };
const showForDelete = { ...showOnlyForAgents, operation: ['delete'] };

export const agentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAgents },
		default: 'getAll',
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an agent',
				description: 'Create a voice agent from a template or a plain-English description',
				routing: { request: { method: 'POST', url: '/v1/agents' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an agent',
				description: 'Permanently delete an agent',
				routing: { request: { method: 'DELETE', url: '=/v1/agents/{{$parameter.agentId}}' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an agent',
				description: 'Retrieve a single agent by ID',
				routing: { request: { method: 'GET', url: '=/v1/agents/{{$parameter.agentId}}' } },
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many agents',
				description: 'List your agents, newest first',
				routing: { request: { method: 'GET', url: '/v1/agents' }, ...splitListResponse },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an agent',
				description: 'Change an existing agent',
				routing: { request: { method: 'PATCH', url: '=/v1/agents/{{$parameter.agentId}}' } },
			},
		],
	},

	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'number',
		required: true,
		default: 0,
		description: 'The numeric ID of the agent',
		displayOptions: { show: { ...showOnlyForAgents, operation: ['get', 'update', 'delete'] } },
	},

	...listPaging(showForGetMany, 'id'),

	// --- Create -----------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'What to call the agent in your dashboard',
		displayOptions: { show: showForCreate },
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		description:
			'What the agent should do, in plain English — NexaVoxa drafts the agent from this. Supply either this or a Template ID.',
		displayOptions: { show: showForCreate },
		routing: { send: { type: 'body', property: 'description' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForCreate },
		options: [
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				typeOptions: { rows: 5 },
				default: '',
				description: 'The full system prompt, if you would rather write it yourself',
				routing: { send: { type: 'body', property: 'instructions' } },
			},
			{
				displayName: 'Knowledge Base ID',
				name: 'knowledge_base_id',
				type: 'string',
				default: '',
				description: 'Attach an existing knowledge base so the agent can answer from it',
				routing: { send: { type: 'body', property: 'knowledge_base_id' } },
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'en',
				description: 'ISO-639-1 code, for example <code>en</code>',
				routing: { send: { type: 'body', property: 'language' } },
			},
			{
				displayName: 'Max Duration (Seconds)',
				name: 'max_duration_secs',
				type: 'number',
				typeOptions: { minValue: 30, maxValue: 3600 },
				default: 600,
				description: 'Hard stop for a call, between 30 and 3600 seconds',
				routing: { send: { type: 'body', property: 'max_duration_secs' } },
			},
			{
				displayName: 'Template ID',
				name: 'template_id',
				type: 'number',
				default: 0,
				description: 'Start from a template instead of a description',
				routing: { send: { type: 'body', property: 'template_id' } },
			},
			{
				displayName: 'Welcome Message',
				name: 'welcome_message',
				type: 'string',
				default: '',
				description: 'The first thing the agent says when the call connects',
				routing: { send: { type: 'body', property: 'welcome_message' } },
			},
		],
	},

	// --- Update -----------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForUpdate },
		options: [
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				typeOptions: { rows: 5 },
				default: '',
				routing: { send: { type: 'body', property: 'instructions' } },
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'en',
				routing: { send: { type: 'body', property: 'language' } },
			},
			{
				displayName: 'Max Duration (Seconds)',
				name: 'max_duration_secs',
				type: 'number',
				typeOptions: { minValue: 30, maxValue: 3600 },
				default: 600,
				routing: { send: { type: 'body', property: 'max_duration_secs' } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Welcome Message',
				name: 'welcome_message',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'welcome_message' } },
			},
		],
	},

	// Placeholder so the Delete operation has a visible confirmation of what it
	// will act on; the id field above is already shown for it.
	{
		displayName:
			'Deleting an agent is permanent. Calls already placed by it are kept, but the agent cannot be recovered.',
		name: 'deleteNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForDelete },
	},

	{
		displayName:
			'Returns the agent as stored. Use Get Many first if you do not know the ID.',
		name: 'getNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForGet },
	},
];
