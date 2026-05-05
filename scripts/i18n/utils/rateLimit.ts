import { i18nConfig } from '../config'

interface RateLimitState {
  requests: number[]
}

const state: RateLimitState = {
  requests: []
}

/**
 * Rate limiter with exponential backoff
 */
export async function rateLimitedCall<T>(
  fn: () => Promise<T>,
  attempt: number = 0
): Promise<T> {
  // Clean up old requests outside the window
  const now = Date.now()
  state.requests = state.requests.filter(
    timestamp => now - timestamp < i18nConfig.rateLimitWindow
  )
  
  // Check if we've hit the rate limit
  if (state.requests.length >= i18nConfig.rateLimit) {
    const oldestRequest = state.requests[0]
    const waitTime = i18nConfig.rateLimitWindow - (now - oldestRequest)
    
    console.log(`Rate limit reached, waiting ${Math.ceil(waitTime / 1000)}s...`)
    await sleep(waitTime)
    
    // Retry after waiting
    return rateLimitedCall(fn, attempt)
  }
  
  // Execute the function with retry logic
  try {
    state.requests.push(now)
    return await fn()
  } catch (error: any) {
    // Retry with exponential backoff for certain errors
    if (attempt < i18nConfig.maxRetries) {
      const isRetryable = 
        error.status === 429 || // Rate limit
        error.status === 503 || // Service unavailable
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT'
      
      if (isRetryable) {
        const delay = i18nConfig.retryDelay * Math.pow(i18nConfig.backoffMultiplier, attempt)
        console.log(`Retrying after ${delay}ms (attempt ${attempt + 1}/${i18nConfig.maxRetries})...`)
        await sleep(delay)
        return rateLimitedCall(fn, attempt + 1)
      }
    }
    
    throw error
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

