import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { processes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('AI Scheduler: Analyzing processes:', processes);

    // Create a detailed prompt for the AI
    const processData = processes.map((p: any) => 
      `Process ${p.id}: Arrival=${p.arrivalTime}ms, Burst=${p.burstTime}ms, Priority=${p.priority}`
    ).join('\n');

    const systemPrompt = `You are an expert CPU scheduling algorithm advisor. Analyze the given process data and recommend the BEST scheduling algorithm.

Available algorithms:
- FCFS (First Come First Serve): Good for non-preemptive scenarios, simple but can cause convoy effect
- SJF (Shortest Job First): Minimizes average waiting time, good when burst times vary significantly
- RR (Round Robin): Fair time-sharing, good for interactive systems, prevents starvation
- Priority: Good when processes have different importance levels, may cause starvation of low-priority processes

Consider:
1. Process arrival times spread
2. Burst time variance
3. Priority distribution
4. Number of processes

Respond with ONLY a JSON object in this EXACT format:
{
  "algorithm": "FCFS|SJF|RR|Priority",
  "reason": "Brief explanation (max 100 words)"
}`;

    const userPrompt = `Analyze these processes and recommend the best algorithm:\n\n${processData}\n\nProvide your recommendation in JSON format.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI Gateway request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the AI response
    let recommendation;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback recommendation
      recommendation = {
        algorithm: 'SJF',
        reason: 'AI response parsing failed. Using SJF as a safe default that minimizes average waiting time.'
      };
    }

    // Validate the algorithm
    const validAlgorithms = ['FCFS', 'SJF', 'RR', 'Priority'];
    if (!validAlgorithms.includes(recommendation.algorithm)) {
      recommendation.algorithm = 'SJF';
      recommendation.reason = 'Invalid algorithm suggested. Defaulting to SJF.';
    }

    console.log('Final recommendation:', recommendation);

    return new Response(
      JSON.stringify(recommendation),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('AI Scheduler error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        algorithm: 'SJF',
        reason: 'Error occurred during AI analysis. Using SJF as fallback.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
