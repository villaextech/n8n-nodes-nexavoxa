import type { INodeProperties } from 'n8n-workflow';
import { listPaging, splitListResponse } from '../../shared/descriptions';

const showOnlyForCalls = { resource: ['call'] };
const showForGetMany = { ...showOnlyForCalls, operation: ['getAll'] };
const showForCreate = { ...showOnlyForCalls, operation: ['create'] };

export const callDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCalls },
		default: 'create',
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Place an outbound call',
				description: 'Have an agent telephone someone',
				routing: { request: { method: 'POST', url: '/v1/calls' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Erase a call',
				description: 'Erase a call recording and transcript',
				routing: { request: { method: 'DELETE', url: '=/v1/calls/{{$parameter.callId}}' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a call',
				description: 'Retrieve a call, including its transcript once analysis has finished',
				routing: { request: { method: 'GET', url: '=/v1/calls/{{$parameter.callId}}' } },
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many calls',
				description: 'List your calls, newest first',
				routing: { request: { method: 'GET', url: '/v1/calls' }, ...splitListResponse },
			},
		],
	},

	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'call_067ac9a3ae74423b83db54cc',
		description: 'The ID returned when the call was placed',
		displayOptions: { show: { ...showOnlyForCalls, operation: ['get', 'delete'] } },
	},

	...listPaging(showForGetMany, 'id'),

	// --- Create -----------------------------------------------------------
	{
		displayName: 'Agent ID',
		name: 'agent_id',
		type: 'number',
		required: true,
		default: 0,
		description: 'Which agent should make the call',
		displayOptions: { show: showForCreate },
		routing: { send: { type: 'body', property: 'agent_id' } },
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+14155550123',
		description: 'The number to call, in E.164 format',
		displayOptions: { show: showForCreate },
		routing: { send: { type: 'body', property: 'to' } },
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
				displayName: 'Contact Email',
				name: 'contact_email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Where to send the call summary, if your account has that enabled',
				routing: { send: { type: 'body', property: 'contact_email' } },
			},
			{
				displayName: 'From Trunk ID',
				name: 'from_trunk_id',
				type: 'string',
				default: '',
				description:
					'Which of your numbers to call from. Leave empty to use the account default.',
				routing: { send: { type: 'body', property: 'from_trunk_id' } },
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description:
					'Arbitrary JSON stored with the call and returned on its webhooks — useful for carrying your own record ID through',
				routing: { send: { type: 'body', property: 'metadata' } },
			},
		],
	},

	{
		displayName:
			'A call is placed asynchronously. This returns immediately with the call ID and a queued status; subscribe to webhooks, or poll Get, to learn how it went.',
		name: 'createNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForCreate },
	},
];
