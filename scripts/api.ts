import type { ApiResponse } from './types.js';

const baseUrl = "https://api.quotable.io/random"

const getQuote = async () => {
    const res = await fetch(baseUrl)
    const body = await res.json() as ApiResponse
    return body
}

export{
    getQuote
}