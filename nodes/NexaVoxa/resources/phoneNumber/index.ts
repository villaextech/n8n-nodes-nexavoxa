import type { INodeProperties } from 'n8n-workflow';
import { listPaging, splitListResponse } from '../../shared/descriptions';

const showOnlyForNumbers = { resource: ['phoneNumber'] };
const showForGetMany = { ...showOnlyForNumbers, operation: ['getAll'] };
const showForAvailable = { ...showOnlyForNumbers, operation: ['getAvailable'] };
const showForPurchase = { ...showOnlyForNumbers, operation: ['purchase'] };
const showForAssign = { ...showOnlyForNumbers, operation: ['assign'] };

export const phoneNumberDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForNumbers },
		default: 'getAll',
		options: [
			{
				name: 'Assign to Agent',
				value: 'assign',
				action: 'Assign a number to an agent',
				description: 'Route calls to this number to a given agent',
				routing: {
					request: { method: 'POST', url: '=/v1/phone-numbers/{{$parameter.numberId}}/assign' },
				},
			},
			{
				name: 'Get Available',
				value: 'getAvailable',
				action: 'Search numbers available to buy',
				description: 'Search numbers that can be purchased',
				routing: {
					request: { method: 'GET', url: '/v1/phone-numbers/available' },
					...splitListResponse,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many phone numbers',
				description: 'List the numbers on your account',
				routing: { request: { method: 'GET', url: '/v1/phone-numbers' }, ...splitListResponse },
			},
			{
				name: 'Purchase',
				value: 'purchase',
				action: 'Purchase a phone number',
				description: 'Buy a number found with Get Available',
				routing: { request: { method: 'POST', url: '/v1/phone-numbers/purchase' } },
			},
		],
	},

	...listPaging(showForGetMany, 'id'),

	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: 'US',
		description: 'ISO-3166 alpha-2 country code to search in, for example <code>US</code>',
		displayOptions: { show: showForAvailable },
		routing: { send: { type: 'query', property: 'country' } },
	},

	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+14155550123',
		description: 'A number returned by Get Available',
		displayOptions: { show: showForPurchase },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName:
			'Purchasing a number charges your NexaVoxa wallet and the charge is not reversible.',
		name: 'purchaseNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForPurchase },
	},

	{
		displayName: 'Number ID',
		name: 'numberId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of a number already on your account',
		displayOptions: { show: showForAssign },
	},
	{
		displayName: 'Agent ID',
		name: 'agent_id',
		type: 'number',
		required: true,
		default: 0,
		description: 'The agent that should answer calls to this number',
		displayOptions: { show: showForAssign },
		routing: { send: { type: 'body', property: 'agent_id' } },
	},
	{
		displayName:
			'A number serves one agent. Assigning it to another agent replaces the previous routing.',
		name: 'assignNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForAssign },
	},
];
