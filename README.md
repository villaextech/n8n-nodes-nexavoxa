# n8n-nodes-nexavoxa

An n8n community node for [NexaVoxa](https://nexavoxa.com) — AI voice agents that make and
answer phone calls.

Use it to place outbound calls from a workflow, pull transcripts and outcomes back out, and
manage agents and phone numbers without hand-writing HTTP requests.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/)
workflow automation platform.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) ·
[Compatibility](#compatibility) · [Resources](#resources)

## Installation

Follow the
[community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
and install `n8n-nodes-nexavoxa`.

## Credentials

You need a NexaVoxa account and an API key.

1. Sign in at [nexavoxa.com](https://nexavoxa.com).
2. Open **Dashboard → Developers** and create an API key. Keys start with `nxa_`.
3. Choose the scopes the key needs. A key created without selecting scopes gets full access,
   which is rarely what you want for an automation — `agents:read` and `calls:write` cover
   most workflows.
4. In n8n, create a **NexaVoxa API** credential and paste the key.

Leave **Base URL** at `https://api.nexavoxa.com` unless NexaVoxa has told you otherwise.

Use **Test** on the credential before building anything. A failure there is a key problem; a
failure later is usually a scope problem — the API answers `403 insufficient_scope` and
names the scope it wanted.

## Operations

### Agent

| Operation | What it does |
| --- | --- |
| Create | Build an agent from a template, or from a plain-English description |
| Get | Fetch one agent |
| Get Many | List your agents, newest first |
| Update | Change an agent's name, prompt, language or call limit |
| Delete | Permanently remove an agent |

### Call

| Operation | What it does |
| --- | --- |
| Create | Have an agent telephone someone |
| Get | Fetch a call, including its transcript once analysis has finished |
| Get Many | List your calls, newest first |
| Delete | Erase a call's recording and transcript |

### Phone Number

| Operation | What it does |
| --- | --- |
| Get Many | List the numbers on your account |
| Get Available | Search numbers available to buy |
| Purchase | Buy a number |
| Assign to Agent | Route calls on a number to an agent |

## Two things worth knowing before you build

**Create Call returns immediately.** It gives you a call ID and a queued status — the call
itself happens afterwards and often takes minutes. A workflow that places a call and reads
the transcript in the next node will find nothing there.

Either poll **Get Call** until its status is `completed`, or subscribe to NexaVoxa's webhooks
and trigger a second workflow from `call.ended`.

**Purchasing a number charges your wallet**, and the charge is not reversible. Worth knowing
before putting that operation inside a loop.

## Compatibility

Requires n8n running on Node.js 22 or later. Built against the NexaVoxa public API version
`2026-09-01`.

## Resources

- [NexaVoxa API reference](https://nexavoxa.com/help/api-reference)
- [NexaVoxa documentation](https://nexavoxa.com/help)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
