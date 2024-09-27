import { generateHeadlineAndSummary } from '../utils/apiUtils';

self.addEventListener('message', async (event) => {
  const { messages } = event.data;
  try {
    const result = await generateHeadlineAndSummary(messages);
    self.postMessage({ type: 'success', data: result });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
});