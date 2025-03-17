/**
 * Utility functions for fetch operations
 */

/**
 * Fetch JSON data from an API endpoint
 * @param url The URL to fetch from
 * @param options Optional fetch options
 * @returns The parsed JSON response
 */
export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Post JSON data to an API endpoint
 * @param url The URL to post to
 * @param data The data to send
 * @param options Optional fetch options
 * @returns The parsed JSON response
 */
export async function postJson<T>(url: string, data: any, options?: RequestInit): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Put JSON data to an API endpoint
 * @param url The URL to put to
 * @param data The data to send
 * @param options Optional fetch options
 * @returns The parsed JSON response
 */
export async function putJson<T>(url: string, data: any, options?: RequestInit): Promise<T> {
  return fetchJson<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Delete a resource from an API endpoint
 * @param url The URL to delete from
 * @param options Optional fetch options
 * @returns The parsed JSON response
 */
export async function deleteJson<T>(url: string, options?: RequestInit): Promise<T> {
  return fetchJson<T>(url, {
    method: 'DELETE',
    ...options,
  });
} 