import http from "@/lib/http";
import { HttpError } from "@/lib/error";

const path = "/seo-redirect";

export interface SeoRedirectCheckResponse {
  found: boolean;
  to_url?: string;
  redirect_type?: number;
  message?: string;
}

const SeoRedirectApi = {
  /**
   * Check if URL has redirect
   * @param url - The URL to check
   * @returns Promise with redirect information
   */
  checkRedirect: async (url: string): Promise<SeoRedirectCheckResponse> => {
    try {
      const apiUrl = `${path}/check?url=${encodeURIComponent(url)}`;
      
      console.log('[SEO Redirect API] Checking URL:', url);
      console.log('[SEO Redirect API] API Path:', apiUrl);
      
      const response = await http.get<any>(apiUrl);
      console.log('[SEO Redirect API] Response received:', JSON.stringify(response, null, 2));
      
      // Handle API response format (status, data structure)
      // Response structure: { status: 200, payload: { status: 'success', data: {...} } }
      if (response && response.payload) {
        console.log('[SEO Redirect API] Payload:', JSON.stringify(response.payload, null, 2));
        
        if (response.payload.status === 'success' && response.payload.data) {
          const data = response.payload.data;
          console.log('[SEO Redirect API] Parsed data:', JSON.stringify(data, null, 2));
          
          if (data.found === true && data.to_url) {
            console.log('[SEO Redirect API] Redirect found!', {
              found: true,
              to_url: data.to_url,
              redirect_type: data.redirect_type,
            });
            return {
              found: true,
              to_url: data.to_url,
              redirect_type: data.redirect_type || 301,
            };
          } else {
            console.log('[SEO Redirect API] Data found but no redirect:', data);
          }
        } else {
          console.log('[SEO Redirect API] Payload status is not success or data missing:', {
            status: response.payload.status,
            hasData: !!response.payload.data,
          });
        }
        
        // Fallback: check if data is directly in payload
        if (response.payload.found !== undefined) {
          console.log('[SEO Redirect API] Found redirect (fallback):', response.payload);
          return {
            found: response.payload.found || false,
            to_url: response.payload.to_url,
            redirect_type: response.payload.redirect_type,
          };
        }
      } else {
        console.log('[SEO Redirect API] Response or payload is missing:', {
          hasResponse: !!response,
          hasPayload: !!(response && response.payload),
        });
      }
      
      console.log('[SEO Redirect API] No redirect found');
      return { found: false };
    } catch (error) {
      console.error('[SEO Redirect API] Error checking redirect:', error);
      
      if (error instanceof HttpError) {
        console.error('[SEO Redirect API] HttpError details:', {
          status: error.status,
          payload: error.payload,
          message: error.message,
        });
      } else if (error instanceof Error) {
        console.error('[SEO Redirect API] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      } else {
        console.error('[SEO Redirect API] Unknown error type:', error);
      }
      
      return { found: false };
    }
  },
};

export { SeoRedirectApi };

