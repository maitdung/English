import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SpeakingCoachFeedbackResult = {
  score: number;
  feedback: string;
  improvement: string;
  source: 'openai' | 'xai' | 'fallback';
};

@Injectable()
export class SpeakingCoachService {
  private readonly logger = new Logger(SpeakingCoachService.name);

  constructor(private readonly configService: ConfigService) {}

  async getFeedback(
    topic: string,
    response: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const xaiApiKey =
      this.configService.get<string>('XAI_API_KEY')?.trim() ||
      this.configService.get<string>('GROK_API_KEY')?.trim();
    const openAiApiKey = this.configService
      .get<string>('OPENAI_API_KEY')
      ?.trim();
    const provider = this.configService
      .get<string>('AI_PROVIDER')
      ?.trim()
      .toLowerCase();

    if (!xaiApiKey && !openAiApiKey) {
      this.logger.warn(
        'No AI API key configured. Falling back to heuristic feedback.',
      );
      return this.buildFallbackFeedback(topic, response);
    }

    try {
      if (provider === 'openai' || (!provider && openAiApiKey && !xaiApiKey)) {
        return await this.requestFromOpenAI(topic, response, openAiApiKey!);
      }

      if (provider === 'xai' || xaiApiKey) {
        return await this.requestFromXAI(topic, response, xaiApiKey!);
      }
    } catch (error) {
      this.logger.warn(`AI coaching request failed: ${String(error)}`);
    }

    return this.buildFallbackFeedback(topic, response);
  }

  private async requestFromOpenAI(
    topic: string,
    response: string,
    apiKey: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const openAiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
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
      },
    );

    if (!openAiResponse.ok) {
      const errorBody = await openAiResponse.text();
      throw new Error(
        `OpenAI request failed with status ${openAiResponse.status}: ${errorBody}`,
      );
    }

    const payload = (await openAiResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
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

    throw new Error('OpenAI response did not contain valid JSON.');
  }

  private async requestFromXAI(
    topic: string,
    response: string,
    apiKey: string,
  ): Promise<SpeakingCoachFeedbackResult> {
    const xaiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
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

    if (!xaiResponse.ok) {
      const errorBody = await xaiResponse.text();
      throw new Error(
        `xAI request failed with status ${xaiResponse.status}: ${errorBody}`,
      );
    }

    const payload = (await xaiResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
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

    throw new Error('xAI response did not contain valid JSON.');
  }

  private parseJsonPayload(content: string): {
    score?: number;
    feedback?: string;
    improvement?: string;
  } | null {
    const normalizedContent = content
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();

    try {
      const parsed = JSON.parse(normalizedContent) as {
        score?: unknown;
        feedback?: unknown;
        improvement?: unknown;
      };

      return {
        score: typeof parsed.score === 'number' ? parsed.score : undefined,
        feedback:
          typeof parsed.feedback === 'string' ? parsed.feedback : undefined,
        improvement:
          typeof parsed.improvement === 'string'
            ? parsed.improvement
            : undefined,
      };
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

  private clampScore(score: number): number {
    return Math.min(100, Math.max(60, Math.round(score)));
  }
}
