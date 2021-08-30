# Crypto API adapter
The project exposes 2 API endpoints: one for signing a message, the other for setting your webhook.
Signing a message on downstream API sometimes fails to provide a signature for your message, in that case this app will keep retrying to get the signature on the background and provide you the signature on the your webhook once the signature is obtained. Please provide your webook via set-webhook endpoint.


## API Reference

#### Get the signature for message

```http
  GET /crypto/sign?message=<message_text>
```

#### Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `message` | `string` | **Required**. Message to sign |

#### Headers
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | Your user id |

Your `userId` in header is needed in case if you want to receive a notification on your webhook.

#### Set Webhook

```http
  POST /crypto/set-webhook
```

#### Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `webhook` | `string` | **Required**. Webhook url |

#### Headers
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. Your user id |

It's enough to set webhook once, you can change your webhook by making another request to this endpoint with new webhook.


## Run Locally

Clone the project


Go to the project root directory


Install dependencies

```bash
  npm install
```

Start the server

```bash
  docker-compose up -d
  npm run start
```
