# Cost Estimate (v1)

Date of estimate: 2026-02-08  
Purpose: planning estimate for monthly operating cost.

## 1) Assumptions
1. Active users per month (MAU): `1,000`.
2. Active days per user per month: `20`.
3. Assistant interactions per active day: `15`.
4. Total interactions/month:
   - `1,000 * 20 * 15 = 300,000 interactions`.
5. Token usage per interaction (blended):
   - Input tokens: `1,200`
   - Output tokens: `300`
6. Model mix:
   - 90% low-cost model path
   - 10% higher-cost model path (complex cases)
7. Voice usage:
   - 40% of interactions are voice (ASR + TTS path).
8. Calendar APIs:
   - assumed near-zero direct API cost at MVP scale (quota-limited rather than metered).
9. Infra baseline (backend, DB, queue, logging, monitoring):
   - small production footprint, estimate range provided below.

## 2) Workload Math
1. Total input tokens/month:
   - `300,000 * 1,200 = 360,000,000`
2. Total output tokens/month:
   - `300,000 * 300 = 90,000,000`
3. Low-cost path tokens (90%):
   - Input: `324,000,000`
   - Output: `81,000,000`
4. High-cost path tokens (10%):
   - Input: `36,000,000`
   - Output: `9,000,000`

## 3) Formula
Use this formula per provider/model:

`LLM monthly cost = (input_tokens/1M * input_price_per_1M) + (output_tokens/1M * output_price_per_1M)`

## 4) Reference Rates Used in Examples
The following rates are examples from provider pricing pages on/near 2026-02-08. Recheck before launch.

1. OpenAI
   - GPT-5 mini: `$0.25 / 1M input`, `$2.00 / 1M output`.
   - GPT-5.2: `$1.75 / 1M input`, `$14.00 / 1M output`.
2. Gemini
   - Gemini 2.5 Flash Preview: `$0.30 / 1M input (text/image/video)`, `$2.50 / 1M output`.
   - Gemini 2.5 Pro: `$1.25 / 1M input`, `$10.00 / 1M output` (<=200k token prompts tier).

## 5) Concrete Model Cost Scenarios (300k interactions/month)

## Scenario A: OpenAI cost-optimized (90% GPT-5 mini, 10% GPT-5.2)
1. GPT-5 mini cost:
   - Input: `324M / 1M * $0.25 = $81.00`
   - Output: `81M / 1M * $2.00 = $162.00`
   - Subtotal: `$243.00`
2. GPT-5.2 cost:
   - Input: `36M / 1M * $1.75 = $63.00`
   - Output: `9M / 1M * $14.00 = $126.00`
   - Subtotal: `$189.00`
3. Total LLM cost: `$432.00 / month`

## Scenario B: Gemini cost-optimized (90% 2.5 Flash, 10% 2.5 Pro)
1. Gemini 2.5 Flash cost:
   - Input: `324M / 1M * $0.30 = $97.20`
   - Output: `81M / 1M * $2.50 = $202.50`
   - Subtotal: `$299.70`
2. Gemini 2.5 Pro cost:
   - Input: `36M / 1M * $1.25 = $45.00`
   - Output: `9M / 1M * $10.00 = $90.00`
   - Subtotal: `$135.00`
3. Total LLM cost: `$434.70 / month`

## Scenario C: Quality-heavier hybrid (60% low-cost, 40% premium)
Assume blended effective rates:
1. Input: `$0.85 / 1M`
2. Output: `$6.00 / 1M`
Then:
1. Input cost: `360M / 1M * $0.85 = $306.00`
2. Output cost: `90M / 1M * $6.00 = $540.00`
3. Total LLM cost: `$846.00 / month`

## 6) Voice Processing Add-On (Example Math)
Assumptions:
1. Voice interactions/month: `300,000 * 40% = 120,000`.
2. Average user speech per voice interaction: `8 seconds`.
3. Average assistant speech per voice interaction: `10 seconds`.
4. Total ASR minutes: `120,000 * 8 / 60 = 16,000 minutes`.
5. Total TTS minutes: `120,000 * 10 / 60 = 20,000 minutes`.

Example with OpenAI published minute estimates:
1. ASR (`gpt-4o-mini-transcribe` estimated `$0.003/min`):
   - `16,000 * 0.003 = $48.00`
2. TTS (`gpt-4o-mini-tts` estimated `$0.015/min`):
   - `20,000 * 0.015 = $300.00`
3. Voice subtotal: `$348.00 / month`

## 7) Infrastructure Add-On (non-model costs)
1. Backend compute + queue workers: `$150 - $800 / month`.
2. Managed DB + backups: `$100 - $600 / month`.
3. Monitoring/logging + object storage: `$50 - $400 / month`.
4. Total infra envelope: `$300 - $1,800 / month`.

## 8) Combined Monthly Envelope (1,000 MAU)
Using the concrete examples above:
1. Scenario A + voice + infra:
   - `$432 + $348 + ($300 to $1,800) = $1,080 to $2,580 / month`
2. Scenario B + voice + infra:
   - `$434.70 + $348 + ($300 to $1,800) = $1,082.70 to $2,582.70 / month`
3. Scenario C + voice + infra:
   - `$846 + $348 + ($300 to $1,800) = $1,494 to $2,994 / month`

## 9) Unit Economics View
Cost per active user per month:
1. Scenario A envelope: `$1.08 - $2.58`
2. Scenario B envelope: `$1.08 - $2.58`
3. Scenario C envelope: `$1.49 - $2.99`

## 10) Biggest Cost Drivers
1. Token volume per interaction (prompt bloat is expensive).
2. Model routing share (cheap vs premium model percentage).
3. Voice minutes per interaction.
4. Retry/error rates from external integrations.

## 11) Cost-Control Levers
1. Keep prompts short and structured.
2. Use confidence-based model escalation.
3. Cache reusable context and summaries.
4. Set strict max token limits per endpoint.
5. Summarize long history before sending to models.
6. Monitor per-endpoint token burn daily.

## 12) Finance Planning Note
Before implementation, create a live pricing sheet with:
1. current provider rates,
2. measured pilot token/voice usage,
3. low/expected/high traffic scenarios,
4. 20-30% contingency for variance.
