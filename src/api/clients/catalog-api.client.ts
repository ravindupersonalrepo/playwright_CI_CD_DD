import type { APIRequestContext, APIResponse } from '@playwright/test';

type SearchResponse = {
  response: APIResponse;
  html: string;
};

export class CatalogApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getHomePage(): Promise<SearchResponse> {
    const response = await this.request.get('/');
    const html = await response.text();

    return { response, html };
  }

  async searchProducts(searchTerm: string): Promise<SearchResponse> {
    const response = await this.request.get('/search', {
      params: { q: searchTerm },
    });
    const html = await response.text();

    return { response, html };
  }

  async getProductPage(productSlug: string): Promise<SearchResponse> {
    const response = await this.request.get(productSlug);
    const html = await response.text();

    return { response, html };
  }

  extractAddToCartProductId(html: string): string | null {
    const match = html.match(/add-to-cart-button-(\d+)/i);

    return match?.[1] ?? null;
  }

  hasText(html: string, text: string): boolean {
    return html.toLowerCase().includes(text.toLowerCase());
  }
}
