import { ExternalLanguageApiService } from './external-language-api.service';

async function testExternalApiService() {
  console.log('🧪 Testing External Language API Service...\n');

  const service = new ExternalLanguageApiService(true); // Enable logging
  const testWord = 'hello';

  console.log(`🔍 Testing with word: "${testWord}"\n`);

  try {
    const enhanced = await service.enhanceVocabularyItem({
      word: testWord,
      ipa: '/həˈloʊ/', // Existing IPA from content
      type: 'interjection', // Existing part of speech
      meaning: 'Used as a greeting or to begin a telephone conversation.',
      example: 'Hello, how are you today?',
      exampleTranslation: 'Xin chào, bạn có khỏe không hôm nay?',
    } as any); // Casting to VocabularyItem interface

    console.log('✅ Enhancement successful!');
    console.log('📝 Original data:');
    console.log(`   Word: ${enhanced.word}`);
    console.log(`   IPA: ${enhanced.ipa}`);
    console.log(`   Part of speech: ${enhanced.type}`);
    console.log(`   Meaning: ${enhanced.meaning}`);
    console.log(`   Example: ${enhanced.example}\n`);

    console.log('🚀 Enhanced data from APIs:');
    if (enhanced.pronunciationAudio) {
      console.log(`   🔊 Pronunciation audio: ${enhanced.pronunciationAudio}`);
    }
    if (enhanced.synonyms && enhanced.synonyms.length > 0) {
      console.log(
        `   🔁 Synonyms (${enhanced.synonyms.length}): ${enhanced.synonyms.slice(0, 5).join(', ')}${enhanced.synonyms.length > 5 ? '...' : ''}`,
      );
    }
    if (enhanced.antonyms && enhanced.antonyms.length > 0) {
      console.log(
        `   🔁 Antonyms (${enhanced.antonyms.length}): ${enhanced.antonyms.slice(0, 5).join(', ')}${enhanced.antonyms.length > 5 ? '...' : ''}`,
      );
    }
    if (enhanced.examples && enhanced.examples.length > 0) {
      console.log(`   📝 Additional examples (${enhanced.examples.length}):`);
      enhanced.examples.slice(0, 3).forEach((ex, i) => {
        console.log(`      ${i + 1}. "${ex}"`);
      });
      if (enhanced.examples.length > 3) {
        console.log(`      ... and ${enhanced.examples.length - 3} more`);
      }
    }
    console.log('\n🎉 Test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testExternalApiService()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      console.error('💥 Unhandled error:', err);
      process.exit(1);
    });
}

export default ExternalLanguageApiService;
