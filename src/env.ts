import '@std/dotenv/load'

const API_ID = Number.parseInt(Deno.env.get('API_ID')!)
const API_HASH = Deno.env.get('API_HASH')!

if (Number.isNaN(API_ID) || !API_HASH) {
    throw new Error('API_ID or API_HASH not set!')
}

export { API_HASH, API_ID }