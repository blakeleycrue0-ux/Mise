/**
 * Wires up the app-wide AIService singleton and chooses providers based on
 * configuration:
 *   - AI gateway configured  -> GatewayProvider primary, Mock fallback
 *   - otherwise               -> Mock only (fully offline/dev)
 *
 * Swapping the underlying model later = change the gateway, or drop in a new
 * AIProvider here. No feature code changes.
 */
import { AIService, type AILogger } from './AIService';
import { GatewayProvider } from './providers/GatewayProvider';
import { MockProvider } from './providers/MockProvider';
import { config, hasAiGateway } from '@utils/config';
import { supabase } from '@services/supabase';

const supabaseLogger: AILogger = {
  log(entry) {
    // Fire-and-forget; never block the UI on logging.
    void supabase
      ?.from('ai_interactions_log')
      .insert({
        kind: entry.kind,
        model: entry.model,
        success: entry.success,
        latency_ms: entry.latencyMs ?? null,
        request_summary: entry.requestSummary ?? null,
      });
  },
};

const mock = new MockProvider();

export const ai: AIService = hasAiGateway
  ? new AIService(new GatewayProvider(config.aiGatewayUrl), mock, supabaseLogger)
  : new AIService(mock, undefined, supabaseLogger);

export { AIService } from './AIService';
export * from './prompts';
