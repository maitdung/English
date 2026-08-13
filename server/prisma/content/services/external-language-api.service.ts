import axios from 'axios';

import type { VocabularyItem } from '../types';

type DictionaryApiEntry = {
  phonetics?: Array<{ audio?: string }>;
};

type DatamuseWord = {
  word?: string;
};

type TatoebaSentence = {
  lang?: string;
  text?: string;
};

// Interface for enhanced vocabulary data
export interface EnhancedVocabularyItem extends VocabularyItem {
  // Additional fields from APIs
  pronunciationAudio?: string; // URL to pronunciation audio
  synonyms?: string[]; // List of synonyms
  antonyms?: string[]; // List of antonyms
  examples?: string[]; // Additional example sentences
}

/**
 * Service to fetch vocabulary data from free public APIs
 * Designed to be used during content import to enrich vocabulary data
 */
export class ExternalLanguageApiService {
  private readonly dictionaryApiBase =
    'https://api.dictionaryapi.dev/api/v2/entries/en';
  private readonly datamuseApiBase = 'https://api.datamuse.com/words';
  private readonly tatoebaApiBase = 'https://tortoise.tatoeba.org/api/v0';
  private readonly requestTimeout = 10_000;

  // Rate limiting - delay between requests (ms)
  private readonly requestDelay = 100;

  constructor(private readonly enableLogging: boolean = false) {}

  /**
   * Enhance a vocabulary item with data from free APIs
   * @param vocabItem Original vocabulary item from content
   * @returns Enhanced vocabulary item with additional data
   */
  async enhanceVocabularyItem(
    vocabItem: VocabularyItem,
  ): Promise<EnhancedVocabularyItem> {
    const startTime = Date.now();

    try {
      // Fetch data from multiple sources in parallel
      const [dictData, synonyms, antonyms, tatoebaData] = await Promise.all([
        this.fetchFromDictionaryAPI(vocabItem.word),
        this.fetchFromDatamuseAPI(vocabItem.word, 'rel_syn'),
        this.fetchFromDatamuseAPI(vocabItem.word, 'rel_ant'),
        this.fetchFromTatoebaAPI(vocabItem.word),
      ]);

      // Combine all data
      const enhanced: EnhancedVocabularyItem = {
        ...vocabItem,
        // Dictionary API data
        pronunciationAudio: dictData?.phonetics?.[0]?.audio || undefined,
        synonyms: this.extractRelatedWords(synonyms),
        antonyms: this.extractRelatedWords(antonyms),
        // Tatoeba data - additional examples
        examples: [
          ...(vocabItem.example ? [vocabItem.example] : []),
          ...this.extractExamples(tatoebaData),
        ],
      };

      if (this.enableLogging) {
        const duration = Date.now() - startTime;
        console.log(
          `[API Service] Enhanced "${vocabItem.word}" in ${duration}ms`,
        );
      }

      return enhanced;
    } catch (error: unknown) {
      if (this.enableLogging) {
        const message = error instanceof Error ? error.message : String(error);

        console.warn(
          `[API Service] Failed to enhance "${vocabItem.word}":`,
          message,
        );
      }
      // Return original item if enhancement fails
      return {
        ...vocabItem,
        pronunciationAudio: undefined,
        synonyms: [],
        antonyms: [],
        examples: vocabItem.example ? [vocabItem.example] : [],
      };
    }
  }

  /**
   * Fetch data from DictionaryAPI.dev
   */
  private async fetchFromDictionaryAPI(
    word: string,
  ): Promise<DictionaryApiEntry | null> {
    try {
      await this.delay();
      const response = await axios.get<DictionaryApiEntry[]>(
        `${this.dictionaryApiBase}/${encodeURIComponent(word)}`,
        { timeout: this.requestTimeout },
      );
      return response.data[0] || null; // Return first result
    } catch {
      // Word not found or API error
      return null;
    }
  }

  /**
   * Fetch related words from Datamuse API
   */
  private async fetchFromDatamuseAPI(
    word: string,
    relation: 'rel_syn' | 'rel_ant',
  ): Promise<DatamuseWord[]> {
    try {
      await this.delay();
      const response = await axios.get<DatamuseWord[]>(this.datamuseApiBase, {
        params: {
          [relation]: word,
          max: 10,
        },
        timeout: this.requestTimeout,
      });
      return response.data;
    } catch {
      return [];
    }
  }

  /**
   * Fetch example sentences from Tatoeba API
   */
  private async fetchFromTatoebaAPI(word: string): Promise<string[]> {
    try {
      await this.delay();
      const response = await axios.get<TatoebaSentence[]>(
        `${this.tatoebaApiBase}/search`,
        {
          params: {
            from: 'eng',
            query: word,
            format: 'json',
            dir: 'forward',
          },
          timeout: this.requestTimeout,
        },
      );

      // Tatoeba API returns sentences in multiple languages
      // We need to filter for English sentences
      const sentences = response.data || [];

      // Filter for English sentences (lang: eng) and extract text
      const englishSentences = sentences
        .filter((item) => item.lang === 'eng' && typeof item.text === 'string')
        .map((item) => item.text as string)
        .slice(0, 5); // Limit to 5 examples

      return englishSentences;
    } catch {
      return [];
    }
  }

  /**
   * Extract synonyms and antonyms from Datamuse response
   */
  private extractRelatedWords(data: DatamuseWord[]): string[] {
    return data
      .map((item) => item.word)
      .filter((word): word is string => typeof word === 'string')
      .filter((word, index, words) => words.indexOf(word) === index)
      .slice(0, 8);
  }

  /**
   * Extract example sentences from Tatoeba response
   */
  private extractExamples(data: string[]): string[] {
    return data.filter((text) => text.trim().length > 0).slice(0, 5);
  }

  /**
   * Simple delay for rate limiting
   */
  private delay(ms: number = this.requestDelay): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Batch process multiple vocabulary items with rate limiting
   */
  async enhanceVocabularyBatch(
    vocabItems: VocabularyItem[],
    batchSize: number = 5,
  ): Promise<EnhancedVocabularyItem[]> {
    const results: EnhancedVocabularyItem[] = [];

    for (let i = 0; i < vocabItems.length; i += batchSize) {
      const batch = vocabItems.slice(i, i + batchSize);

      // Process batch concurrently (but still respect rate limits via delay in each request)
      const batchPromises = batch.map((item) =>
        this.enhanceVocabularyItem(item),
      );
      const batchResults = await Promise.all(batchPromises);

      results.push(...batchResults);

      // If not the last batch, wait before next batch to be extra nice to APIs
      if (i + batchSize < vocabItems.length) {
        await this.delay(500); // 500ms between batches
      }
    }

    return results;
  }
}

// Export a singleton instance for use throughout the module
export const externalLanguageApiService = new ExternalLanguageApiService(false);
// Enable logging by passing true: new ExternalLanguageApiService(true)
