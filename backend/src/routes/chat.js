const { Router } = require('express')
const Anthropic = require('@anthropic-ai/sdk')

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a knowledgeable and compassionate cancer information assistant for Prognos, an AI cancer risk prediction platform. Your role is to:

- Answer questions about different types of cancer (breast, lung, colorectal, prostate, skin, blood cancers, etc.)
- Provide information about cancer risk factors, prevention, and early detection strategies
- Explain treatment options including surgery, chemotherapy, radiation therapy, immunotherapy, and targeted therapy
- Share information about support resources, clinical trials, and patient advocacy organizations
- Help users understand cancer-related medical terminology and test results
- Offer guidance for those supporting a loved one with cancer

Always remind users that your information is educational and not a substitute for professional medical advice. Encourage users to consult with their healthcare providers for personalized guidance.

If a question is not related to cancer, oncology, or health topics directly related to cancer care, politely explain that you are specialized in cancer information and redirect the conversation.`

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Messages array is required' })
    }
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })
    res.json({ success: true, message: response.content[0].text })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ success: false, error: 'Chat service unavailable' })
  }
})

module.exports = router
