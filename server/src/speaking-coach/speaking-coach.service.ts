import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SpeakingCoachFeedbackResult = {
  score: number;
  feedback: string;
  improvement: string;
  source: 'openai' | 'xai' | 'gemini' | 'fallback';
};

type SpeakingCoachChatMode = 'coach' | 'translate_en_vi' | 'translate_vi_en';

type SpeakingCoachChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

type SpeakingCoachChatResult = {
  reply: string;
  translatedText: string;
  correctedText: string;
  source: 'openai' | 'xai' | 'gemini' | 'fallback';
  mode: SpeakingCoachChatMode;
};

type AiProvider = 'openai' | 'xai' | 'gemini';

type ConfiguredProvider = {
  provider: AiProvider;
  apiKey: string;
};

class SafeAiRequestError extends Error {}

@Injectable()
export class SpeakingCoachService {
  private readonly logger = new Logger(SpeakingCoachService.name);

  constructor(private readonly configService: ConfigService) {}

  async getFeedback(
    topic: string,
    response: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const providers = this.getConfiguredProviders();

    if (providers.length === 0) {
      this.logger.warn(
        'No AI API key configured. Falling back to heuristic feedback.',
      );
      return this.buildFallbackFeedback(topic, response);
    }

    for (const { provider, apiKey } of providers) {
      try {
        if (provider === 'openai') {
          return await this.requestFromOpenAI(topic, response, apiKey);
        }
        if (provider === 'xai') {
          return await this.requestFromXAI(topic, response, apiKey);
        }

        return await this.requestFromGemini(topic, response, apiKey);
      } catch (error) {
        this.logProviderFailure('coaching', provider, error);
      }
    }

    return this.buildFallbackFeedback(topic, response);
  }

  async getChatReply(
    topic: string,
    input: string,
    messages: SpeakingCoachChatMessage[],
    mode: SpeakingCoachChatMode,
  ): Promise<SpeakingCoachChatResult> {
    const providers = this.getConfiguredProviders();
    const sanitizedMessages = messages
      .filter((message) => message.content?.trim())
      .slice(-8);

    if (providers.length === 0) {
      return this.buildFallbackChatReply(input, mode);
    }

    for (const { provider, apiKey } of providers) {
      try {
        if (provider === 'openai') {
          return await this.requestChatFromOpenAI(
            topic,
            input,
            sanitizedMessages,
            mode,
            apiKey,
          );
        }
        if (provider === 'xai') {
          return await this.requestChatFromXAI(
            topic,
            input,
            sanitizedMessages,
            mode,
            apiKey,
          );
        }

        return await this.requestChatFromGemini(
          topic,
          input,
          sanitizedMessages,
          mode,
          apiKey,
        );
      } catch (error) {
        this.logProviderFailure('chat', provider, error);
      }
    }

    return this.buildFallbackChatReply(input, mode);
  }

  private getConfiguredProviders(): ConfiguredProvider[] {
    const keys: Partial<Record<AiProvider, string>> = {
      openai: this.configService.get<string>('OPENAI_API_KEY')?.trim(),
      xai:
        this.configService.get<string>('XAI_API_KEY')?.trim() ||
        this.configService.get<string>('GROK_API_KEY')?.trim(),
      gemini: this.configService.get<string>('GEMINI_API_KEY')?.trim(),
    };
    const configuredPreference = this.configService
      .get<string>('AI_PROVIDER')
      ?.trim()
      .toLowerCase();
    const preferred = this.isAiProvider(configuredPreference)
      ? configuredPreference
      : undefined;
    const order = [preferred, 'openai', 'xai', 'gemini'].filter(
      (provider, index, providers): provider is AiProvider =>
        provider !== undefined && providers.indexOf(provider) === index,
    );

    return order.flatMap((provider) => {
      const apiKey = keys[provider];
      return apiKey ? [{ provider, apiKey }] : [];
    });
  }

  private isAiProvider(value: string | undefined): value is AiProvider {
    return value === 'openai' || value === 'xai' || value === 'gemini';
  }

  private async requestFromOpenAI(
    topic: string,
    response: string,
    apiKey: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const payload = await this.fetchJson<{
      choices?: Array<{ message?: { content?: string } }>;
    }>('openai', 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content:
              'You are an encouraging English speaking coach. Return valid JSON only with fields score (0-100), feedback (short encouraging feedback in Vietnamese), improvement (one clear actionable tip in Vietnamese).',
          },
          {
            role: 'user',
            content: `Topic: ${topic}\nStudent response: ${response}\nReturn a compact JSON object.`,
          },
        ],
      }),
    });
    const content = payload.choices?.[0]?.message?.content ?? '';
    const parsed = this.parseJsonPayload(content);

    if (parsed) {
      return {
        score: this.clampScore(parsed.score ?? 70),
        feedback: parsed.feedback || 'Câu trả lời của bạn đang khá tốt.',
        improvement:
          parsed.improvement ||
          'Hãy thêm một chi tiết cụ thể để câu trả lời giàu ý nghĩa hơn.',
        source: 'openai',
      };
    }

    throw new SafeAiRequestError('openai response did not contain valid JSON');
  }

  private async requestFromXAI(
    topic: string,
    response: string,
    apiKey: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const model = this.configService.get<string>(
      'XAI_SPEAKING_MODEL',
      'grok-4.3',
    );
    const payload = await this.fetchJson<{
      choices?: Array<{ message?: { content?: string } }>;
    }>('xai', 'https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content:
              'You are an encouraging English speaking coach. Return valid JSON only with fields score (0-100), feedback (short encouraging feedback in Vietnamese), improvement (one clear actionable tip in Vietnamese).',
          },
          {
            role: 'user',
            content: `Topic: ${topic}\nStudent response: ${response}\nReturn a compact JSON object.`,
          },
        ],
      }),
    });
    const content = payload.choices?.[0]?.message?.content ?? '';
    const parsed = this.parseJsonPayload(content);

    if (parsed) {
      return {
        score: this.clampScore(parsed.score ?? 70),
        feedback: parsed.feedback || 'Câu trả lời của bạn đang khá tốt.',
        improvement:
          parsed.improvement ||
          'Hãy thêm một chi tiết cụ thể để câu trả lời giàu ý nghĩa hơn.',
        source: 'xai',
      };
    }

    throw new SafeAiRequestError('xai response did not contain valid JSON');
  }

  private async requestFromGemini(
    topic: string,
    response: string,
    apiKey: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const model = this.configService.get<string>(
      'GEMINI_SPEAKING_MODEL',
      'gemini-3.5-flash',
    );
    const payload = await this.fetchJson<{
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    }>(
      'gemini',
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an encouraging English speaking coach. Return valid JSON only with fields score (0-100), feedback (short encouraging feedback in Vietnamese), improvement (one clear actionable tip in Vietnamese). Topic: ${topic}\nStudent response: ${response}\nReturn a compact JSON object.`,
                },
              ],
            },
          ],
        }),
      },
    );
    const content = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const parsed = this.parseJsonPayload(content);

    if (parsed) {
      return {
        score: this.clampScore(parsed.score ?? 70),
        feedback: parsed.feedback || 'Câu trả lời của bạn đang khá tốt.',
        improvement:
          parsed.improvement ||
          'Hãy thêm một chi tiết cụ thể để câu trả lời giàu ý nghĩa hơn.',
        source: 'gemini',
      };
    }

    throw new SafeAiRequestError('gemini response did not contain valid JSON');
  }

  private async requestChatFromOpenAI(
    topic: string,
    input: string,
    messages: SpeakingCoachChatMessage[],
    mode: SpeakingCoachChatMode,
    apiKey: string,
  ): Promise<SpeakingCoachChatResult> {
    const payload = await this.fetchJson<{
      choices?: Array<{ message?: { content?: string } }>;
    }>('openai', 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: this.buildChatSystemPrompt(mode),
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          {
            role: 'user',
            content: `Topic: ${topic}\nUser input: ${input}\nReturn JSON only.`,
          },
        ],
      }),
    });
    const content = payload.choices?.[0]?.message?.content ?? '';
    return this.parseChatPayload(content, mode, 'openai');
  }

  private async requestChatFromXAI(
    topic: string,
    input: string,
    messages: SpeakingCoachChatMessage[],
    mode: SpeakingCoachChatMode,
    apiKey: string,
  ): Promise<SpeakingCoachChatResult> {
    const model = this.configService.get<string>(
      'XAI_SPEAKING_MODEL',
      'grok-4.3',
    );
    const payload = await this.fetchJson<{
      choices?: Array<{ message?: { content?: string } }>;
    }>('xai', 'https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: this.buildChatSystemPrompt(mode),
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          {
            role: 'user',
            content: `Topic: ${topic}\nUser input: ${input}\nReturn JSON only.`,
          },
        ],
      }),
    });
    const content = payload.choices?.[0]?.message?.content ?? '';
    return this.parseChatPayload(content, mode, 'xai');
  }

  private async requestChatFromGemini(
    topic: string,
    input: string,
    messages: SpeakingCoachChatMessage[],
    mode: SpeakingCoachChatMode,
    apiKey: string,
  ): Promise<SpeakingCoachChatResult> {
    const historyText = messages
      .map(
        (message) =>
          `${message.role === 'assistant' ? 'Coach' : 'User'}: ${message.content}`,
      )
      .join('\n');
    const prompt = `${this.buildChatSystemPrompt(mode)}\n\nConversation history:\n${historyText || '(empty)'}\n\nTopic: ${topic}\nUser input: ${input}\nReturn JSON only.`;

    const model = this.configService.get<string>(
      'GEMINI_SPEAKING_MODEL',
      'gemini-3.5-flash',
    );
    const payload = await this.fetchJson<{
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    }>(
      'gemini',
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );
    const content = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return this.parseChatPayload(content, mode, 'gemini');
  }

  private async fetchJson<T>(
    provider: AiProvider,
    url: string,
    init: RequestInit,
  ): Promise<T> {
    const timeoutMs = this.configService.get<number>(
      'AI_REQUEST_TIMEOUT_MS',
      15_000,
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;

    try {
      response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      const timedOut =
        controller.signal.aborted ||
        (error instanceof Error && error.name === 'AbortError');

      throw new SafeAiRequestError(
        timedOut
          ? `${provider} request timed out`
          : `${provider} network request failed`,
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new SafeAiRequestError(
        `${provider} returned HTTP ${response.status}`,
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new SafeAiRequestError(`${provider} returned invalid JSON`);
    }
  }

  private logProviderFailure(
    operation: 'coaching' | 'chat',
    provider: AiProvider,
    error: unknown,
  ) {
    const errorMessage =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : '';
    const detail = new RegExp(
      `^${provider} (?:request timed out|network request failed|returned HTTP \\d{3}|returned invalid JSON|response did not contain valid JSON|chat response did not contain valid JSON|chat response is missing reply)$`,
    ).test(errorMessage)
      ? errorMessage
      : `${provider} unexpected provider failure`;

    this.logger.warn(
      `AI ${operation} request failed (${detail}); trying the next provider or local fallback.`,
    );
  }

  private parseChatPayload(
    content: string,
    mode: SpeakingCoachChatMode,
    source: 'openai' | 'xai' | 'gemini',
  ): SpeakingCoachChatResult {
    const parsed = this.parseJsonObject(content);
    if (!parsed) {
      throw new SafeAiRequestError(
        `${source} chat response did not contain valid JSON`,
      );
    }

    const reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : '';
    const translatedText =
      typeof parsed.translatedText === 'string'
        ? parsed.translatedText.trim()
        : '';
    const correctedText =
      typeof parsed.correctedText === 'string'
        ? parsed.correctedText.trim()
        : '';

    if (!reply) {
      throw new SafeAiRequestError(`${source} chat response is missing reply`);
    }

    return {
      reply,
      translatedText,
      correctedText,
      source,
      mode,
    };
  }

  private buildChatSystemPrompt(mode: SpeakingCoachChatMode): string {
    if (mode === 'translate_en_vi') {
      return 'You are an English to Vietnamese translator. Return JSON with keys: reply, translatedText, correctedText. reply should be natural Vietnamese translation. translatedText should be the same Vietnamese translation. correctedText should be corrected English input if needed, otherwise echo original.';
    }

    if (mode === 'translate_vi_en') {
      return 'You are a Vietnamese to English translator. Return JSON with keys: reply, translatedText, correctedText. reply should be natural English translation. translatedText should be the same English translation. correctedText should be corrected Vietnamese input if needed, otherwise echo original.';
    }

    return 'You are a conversational English speaking coach. Return JSON with keys: reply, translatedText, correctedText. reply should be your short conversational response in English (2-4 sentences) and end with one follow-up question. translatedText should be Vietnamese translation of your reply. correctedText should be a corrected version of the user input in English.';
  }

  private parseJsonPayload(content: string): {
    score?: number;
    feedback?: string;
    improvement?: string;
  } | null {
    const parsed = this.parseJsonObject(content);
    if (!parsed) {
      return null;
    }

    return {
      score: typeof parsed.score === 'number' ? parsed.score : undefined,
      feedback:
        typeof parsed.feedback === 'string' ? parsed.feedback : undefined,
      improvement:
        typeof parsed.improvement === 'string' ? parsed.improvement : undefined,
    };
  }

  private parseJsonObject(content: string): Record<string, unknown> | null {
    const normalizedContent = content
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();

    try {
      const parsed = JSON.parse(normalizedContent) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private buildFallbackFeedback(
    topic: string,
    response: string,
  ): SpeakingCoachFeedbackResult {
    const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
    const hasConnector = /because|but|and|so|however|also/i.test(response);
    const hasPastTense = /was|were|did|went|made|had|worked|learned/i.test(
      response,
    );

    const score = this.clampScore(
      70 + wordCount + (hasConnector ? 6 : 0) + (hasPastTense ? 4 : 0),
    );

    const feedback =
      score >= 85
        ? `Bạn đang phản xạ rất tốt cho chủ đề ${topic}.`
        : score >= 75
          ? `Bạn đã có nền tảng khá ổn cho chủ đề ${topic}.`
          : `Hãy nói chậm và chia câu thành các ý ngắn hơn cho chủ đề ${topic}.`;

    const improvement =
      score >= 85
        ? 'Giữ nguyên phong cách này và thêm một ví dụ cụ thể để câu trả lời sống động hơn.'
        : 'Hãy thêm một câu nối và một chi tiết cụ thể để câu trả lời trôi chảy hơn.';

    return {
      score,
      feedback,
      improvement,
      source: 'fallback',
    };
  }

  private buildFallbackChatReply(
    input: string,
    mode: SpeakingCoachChatMode,
  ): SpeakingCoachChatResult {
    if (mode === 'translate_en_vi') {
      return {
        reply:
          'Mình chưa gọi được AI thật lúc này. Bạn có thể gửi câu ngắn hơn, mình sẽ tiếp tục dịch khi kết nối ổn định.',
        translatedText:
          'Tạm thời chưa dịch tự động do giới hạn API. Hãy thử lại sau vài phút.',
        correctedText: input.trim(),
        source: 'fallback',
        mode,
      };
    }

    if (mode === 'translate_vi_en') {
      return {
        reply:
          'AI translation is temporarily unavailable. Please try again in a few minutes.',
        translatedText:
          'Automatic translation is temporarily unavailable because of API limits.',
        correctedText: input.trim(),
        source: 'fallback',
        mode,
      };
    }

    return {
      reply:
        'Great effort! I cannot reach live AI right now, but we can keep practicing. Could you describe your idea in one more sentence?',
      translatedText:
        'Bạn làm rất tốt! Hiện mình chưa gọi được AI thật, nhưng vẫn có thể luyện tiếp. Bạn có thể mô tả ý của mình thêm một câu nữa không?',
      correctedText: input.trim(),
      source: 'fallback',
      mode,
    };
  }

  private clampScore(score: number): number {
    return Math.min(100, Math.max(60, Math.round(score)));
  }
}
