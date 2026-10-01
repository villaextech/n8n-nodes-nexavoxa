import type { INodeProperties } from 'n8n-workflow';

/**
 * Paging shared by every "Get Many" operation.
 *
 * The API is cursor-paged: each list returns `has_more` and the caller passes
 * the last id back as `starting_after`. That is why pagination is expressed
 * here rather than as a page number — there is no page number to send.
 */
export function listPaging(
	showOnly: Record<string, string[]>,
	cursorFrom: string,
): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show: showOnly },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: { paginate: '={{ $value }}', type: 'query', property: 'limit', value: '100' },
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							// `has_more` is the API's own signal; trusting it means we stop
							// exactly when it says to rather than guessing from page size.
							continue: '={{ $response.body?.has_more === true }}',
							request: {
								qs: {
									starting_after: `={{ $response.body?.data?.[$response.body.data.length - 1]?.${cursorFrom} }}`,
								},
							},
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: { show: { ...showOnly, returnAll: [false] } },
			typeOptions: { minValue: 1, maxValue: 100 },
			default: 50,
			description: 'Max number of results to return',
			routing: {
				send: { type: 'query', property: 'limit' },
				output: { maxResults: '={{$value}}' },
			},
		},
	];
}

/**
 * Lists come back as `{ object: "list", data: [...], has_more }`. Without this
 * every run would emit one item containing an array, which is almost never
 * what the next node in a workflow wants.
 */
export const splitListResponse = {
	output: {
		postReceive: [
			{
				type: 'rootProperty' as const,
				properties: { property: 'data' },
			},
		],
	},
};
