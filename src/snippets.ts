import { URLExt } from "@jupyterlab/coreutils";

import { ServerConnection } from "@jupyterlab/services";

/**
 * The type for a Snippet.
 */
export type Snippet = string[];

/**
 * The Snippet Content interface
 */
export interface SnippetContent {
  content: string;
}

/**
 * List the available snippets.
 */
export async function listSnippets() {
  return requestAPI<Snippet[]>("list");
}

/**
 * Fetch a snippet given its path.
 * @param snippet The path of the snippet to fetch.
 */
export async function fetchSnippet(snippet: Snippet) {
  let request: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ snippet })
  };
  return requestAPI<SnippetContent>("get", request);
}

/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
async function requestAPI<T>(
  endPoint: string = "",
  init: RequestInit = {}
): Promise<T> {
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(
    settings.baseUrl,
    "snippets",
    endPoint
  );

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message);
  }

  return data;
}
